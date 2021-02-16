import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';
import { Album, Content } from '../../../model/contentModel';
import { AuthProps } from '../../../redux/reducers/AuthReducer';
import { RootState } from '../../../redux/reducers/RootReducer';
import { getArticle } from '../../../utils/Search';
import { Firebase } from '../../../utils/firebase';
import {
  PerformerDetail,
  ArticleInitialState,
} from '../../../model/SearchModel';
import { chooseDummyImage } from './common';
import PlayIcon from '../../../assets/images/playIcon.png';
import { actions as playerActions } from '../../../redux/reducers/PlayerReducer';
import { fireLoginUser } from '../../../hooks/useProfile';
import LoginModal from '../artist/LoginModal';

interface Props {
  activeAlbum: Album;
  activeContents: Content[];
  goBack: () => void;
  collection: any;
}

const PerformerImage = ({
  id,
  collection,
}: {
  id: string;
  collection: any;
}): JSX.Element => {
  const authState = useSelector((state: { auth: AuthProps }) => state.auth);
  const { authToken } = authState;
  const [artist, setArtist] = useState<PerformerDetail>();
  const dummyImage = chooseDummyImage(collection);
  useEffect(() => {
    getArticle({
      authToken,
      id,
      collection: 'artist',
    }).then((rep) => {
      setArtist(rep?.response?.result);
    });
  }, []);

  const loadImage = (e: any): void => {
    e.src = dummyImage;
  };

  return (
    <ArtistImage
      src={artist?.image || dummyImage}
      onError={loadImage}
      alt="artists"
    />
  );
};

const AlbumDetail: FC<Props> = ({
  activeAlbum,
  activeContents,
  goBack,
  collection,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const articleState = useSelector(articleSelector);
  const contentSelector = (state: RootState): any => state.content;
  const contentState = useSelector(contentSelector);
  const { addToast } = useToasts();

  const [googleProvider] = useState(new Firebase.auth.GoogleAuthProvider());
  const [fbProvider] = useState(new Firebase.auth.FacebookAuthProvider());
  const [showModal, setShowModal] = useState(false);
  let mainPerformer = '';
  const performersIds: string[] = _.map(activeAlbum.performers, (obj) => {
    if (obj.type === 'Main') mainPerformer = obj.name;
    return obj.id;
  });

  const googleLogin = (): void => {
    googleProvider.addScope('email');
    fireLoginUser({
      setShowModal,
      dispatch,
      provider: googleProvider,
    });
  };

  const fbLogin = (): void => {
    fbProvider.addScope('email');
    fireLoginUser({
      setShowModal,
      dispatch,
      provider: fbProvider,
    });
  };

  const redirectToPremium = (): void => {
    window.open(process?.env?.REACT_APP_PREMIUM_SERVER, '_blank');
  };

  const playAudio = (contents: any[], index: number): void => {
    const isPurchasedPremiumContent =
      activeAlbum?.isPurchased && activeAlbum?.premium;
    const nonPremium = activeAlbum?.premium === false;
    if (!articleState?.currentUser?.isLogin) {
      setShowModal(true);
    }
    if (nonPremium || isPurchasedPremiumContent) {
      dispatch(playerActions.addSongs({ contents, index }));
    } else if (!articleState?.isUserSubscribe) {
      addToast('You are not subscribed user. Please buy subsciption.', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else if (!activeAlbum.isPurchased) {
      redirectToPremium();
    }

    // let isPurchasedByUser = false;
    // for (let i = 0; i < albums.length; i++) {
    //   if (albums[i].id == contents[0].album.id) {
    //     if (albums[i].isPurchased == true) {
    //       isPurchasedByUser = true;
    //       break;
    //     }
    //   }
    // }
    // if (
    //   (articleState.isUserSubscribe == true && articleState.authToken != '') ||
    //   isPurchasedByUser == true
    // )
    // dispatch(playerActions.addSongs({ contents, index }));
    // else if (articleState.authToken == '')
    //   addToast('Please login to play content.', {
    //     appearance: 'error',
    //     autoDismiss: true,
    //   });
    // else
    //   addToast('You are not subscribed user. Please buy subsciption.', {
    //     appearance: 'error',
    //     autoDismiss: true,
    //   });
  };

  const handleBack = (): void => {
    // dispatch(playerActions.addSongs({ contents: [], index: 0 }));
    goBack();
  };

  const calcDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `00:${Math.round(seconds)}`;
    }
    const mins = Math.round(seconds / 60);
    const secs = Math.round(seconds % 60);
    const zMins = mins < 10 ? `0${mins}` : mins;
    const zSecs = secs < 10 ? `0${secs}` : secs;
    return `${zMins}:${zSecs}`;
  };

  return (
    <AlbumDetails>
      <AlbumDetailCard>
        <CardRow>
          <AlbumInfo>
            <Image src={activeAlbum.image} alt="albumImage" />
            <Info>
              <TopBlock>
                <Title>{activeAlbum.title}</Title>
                <Artist>{mainPerformer}</Artist>
              </TopBlock>
              <Artists>
                {performersIds.map((id) => (
                  <PerformerImage key={id} {...{ id, collection }} />
                ))}
              </Artists>
            </Info>
          </AlbumInfo>
          <RightContainer onClick={handleBack}>
            <Button>
              <i className="fa fa-arrow-circle-o-left" />
              <span className="txt">Back</span>
            </Button>
          </RightContainer>
        </CardRow>
      </AlbumDetailCard>
      <SongsContainer>
        <FilesContainer>
          {activeContents?.length > 0 &&
            activeContents.map((file, index) => {
              return (
                <FileRow
                  key={file.title}
                  isLast={activeContents.length - 1 === index}
                  onClick={(): void => playAudio(activeContents, index)}
                >
                  <PlayImage src={PlayIcon} alt="playIcon" />
                  <FileNames>
                    <SongTitle>{file.title}</SongTitle>
                    <SongArtist>{file.metadata.artist[0].name}</SongArtist>
                  </FileNames>
                  <Duration>
                    <span>{calcDuration(file?.duration || 0)}</span>
                  </Duration>
                </FileRow>
              );
            })}
        </FilesContainer>
      </SongsContainer>

      <LoginModal
        {...{ showModal, setShowModal, article: null, googleLogin, fbLogin }}
      />
    </AlbumDetails>
  );
};

const AlbumDetails = styled.div`
  flex: 1 1 0;
  position: relative;
  p {
    color: white;
  }
`;
const AlbumDetailCard = styled.div`
  display: flex;
  justify-content: space-between;
`;
const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 145px;
  width: 100%;
`;
const Image = styled.img`
  width: 186px;
  height: 145px;
  border-radius: 10px;
`;
const AlbumInfo = styled.div`
  display: flex;
  width: 100%;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
`;
const TopBlock = styled.div`
  flex: 1 1 50%;
`;
const Title = styled.h3`
  color: ${({ theme }): string => theme.white};
`;
const Artist = styled.p``;
const Artists = styled.div`
  flex: 1 1 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;
const ArtistImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 4px;
`;
const RightContainer = styled.div`
  flex: 1 1 20%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
const Button = styled.div`
  cursor: pointer;
  width: 100px;
  display: flex;
  align-items: center;
  background-color: #585858;
  border-radius: 25px;
  padding: 5px 12px 4px 4px;
  outline: none;
  .fa {
    color: ${(props): string => props.theme.white};
    font-size: 26px;
    padding-left: 5px;
  }
  .txt {
    color: ${(props): string => props.theme.white};
    font-size: 18px;
    font-weight: bold;
    padding-left: 8px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const SongsContainer = styled.div`
  background-color: ${({ theme }): string => theme.white};
  margin-top: 1rem;
  border-radius: 10px;
  font-family: Poppins;
`;
const FilesContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;
const FileRow = styled.div<{ isLast: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: ${({ isLast }): string => (isLast ? '' : '1px solid grey')};
`;
const PlayImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const FileNames = styled.div`
  width: 80%;
  margin-left: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`;
const Duration = styled.div`
  display: flex;
  justify-content: flex-start;
  font-family: Nunito;
  align-items: center;
  margin-left: 1rem;
  color: #999999;
  height: 50px;
`;
const SongTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  font-family: Nunito;
  color: ${({ theme }): string => theme.black};
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const SongArtist = styled.span`
  font-size: 10px;
  font-weight: 300;
  font-family: Nunito;
  color: ${({ theme }): string => theme.black};
`;

export default AlbumDetail;

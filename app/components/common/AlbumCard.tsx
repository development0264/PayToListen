import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Icon from '@material-ui/core/Icon';

// import { Spinner } from 'react-bootstrap';
import { Album } from '../../../model/contentModel';
import { chooseDummyImage } from './common';
import { useFetchStatsByAlbumId } from '../../../hooks/useContentStats';
import Premium from '../../../assets/images/premium.png';
import { checkAlbumWithVideo } from '../../../utils/services';

type Props = Album & {
  openAlbum: () => void;
  authorized: boolean;
  collection: any;
  premium: boolean;
  isPurchased: boolean;
  paymentStatus: any;
  publishAlbum?: () => void;
  viewAlbum?: (e: any) => void;
  openPremium?: () => void;
  isPremiumOpening?: boolean;
};

const AlbumCard: FC<Props> = ({
  id,
  title,
  image,
  performers,
  openAlbum,
  authorized,
  isPublished,
  publishAlbum,
  viewAlbum,
  collection,
  openPremium,
  premium,
  isPurchased,
  paymentStatus,
  isPremiumOpening,
}: Props): JSX.Element => {
  const [isVideoAlbum, setIsVideoAlbum] = useState(true);
  const contentStat = useFetchStatsByAlbumId(id);
  const dummyImage = chooseDummyImage(collection);
  let mainPerformer = '';
  const performer = _.map(performers, (obj) => {
    if (obj.type === 'Main') mainPerformer = obj.name;
    return _.startCase(_.toLower(obj.name));
  }).join(' , ');
  const loadDefaultImage = (e: any): any => {
    e.target.src = dummyImage;
  };

  const redirectToPremium = (): void => {
    window.open(process?.env?.REACT_APP_PREMIUM_SERVER, '_blank');
  };

  useEffect(() => {
    checkAlbumWithVideo(id).then((resp) => {
      setIsVideoAlbum(resp);
    });
  }, [id]);
  return (
    <Container authorized={authorized}>
      <Image
        src={image || dummyImage}
        onError={loadDefaultImage}
        alt="event_image"
      />
      <Details>
        {premium && isPublished && <PremiumAlbum src={Premium} alt="" />}

        <Title>{_.startCase(_.toLower(title))}</Title>
        <Info>
          <i className="fa fa-user" />
          <Text>
            {mainPerformer !== ''
              ? mainPerformer
              : performer || 'Unknown Artist'}
          </Text>
        </Info>
        <Info>
          <i className="fa fa-play-circle" />
          <Text>{`${contentStat} plays`}</Text>
          <Icon
            color="primary"
            style={{ marginTop: -5, cursor: 'pointer' }}
            onClick={viewAlbum}
          >
            playlist_play
          </Icon>
        </Info>
        {premium && isPurchased === false && !authorized ? (
          <Info>
            <Button
              onClick={redirectToPremium}
              style={{
                backgroundColor: 'green',
                right: '10px',
                position: 'absolute',
                bottom: '10px',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              Buy
            </Button>
          </Info>
        ) : null}
        <Footer>
          {authorized && (
            <>
              {!isPublished && !isVideoAlbum && (
                <Button
                  style={{ backgroundColor: '#29CC5E' }}
                  onClick={publishAlbum}
                >
                  <i className="fa fa-caret-right" />
                  Publish
                </Button>
              )}
              <Button
                style={{ backgroundColor: '#459eff' }}
                onClick={openAlbum}
              >
                <i className="fa fa-pencil" />
                Edit Album
              </Button>

              <Button
                style={{ backgroundColor: '#459eff' }}
                onClick={openPremium}
              >
                <PremiumIcon src={Premium} alt="" />
                Premium
              </Button>
            </>
          )}
        </Footer>
      </Details>
    </Container>
  );
};

AlbumCard.defaultProps = {
  publishAlbum: undefined,
  viewAlbum: undefined,
  openPremium: undefined,
  isPremiumOpening: false,
};

const Container = styled.div<{ authorized: boolean }>`
  background-color: ${({ authorized }): string =>
    !authorized ? 'white' : 'rgba(59, 67, 242, 0.06)'};
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  width: 90%;
  height: 103px;
  margin: 1rem;
  margin-bottom: 20px !important;
  @media (min-width: 1270px) {
    width: 375px;
  }
  @media (min-width: 1280px) {
    margin: 0.5rem;
  }
`;
const Image = styled.img`
  margin-right: 10px;
  width: 90px;
  border-radius: 5px;
  object-fit: contain;
  height: 100%;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 75%;
  height: 100%;
  position: relative;
`;
const Title = styled.h2`
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  margin-bottom: 0;
  color: black;
`;
const Info = styled.div`
  display: flex;
  .fa {
    width: 18px;
    text-align: left;
    color: #585858;
  }
`;
const Text = styled.span`
  color: #585858;
  font-size: 10px;
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;
const Button = styled.div`
  width: 82px;
  height: 20px;
  padding: 3px 5px;
  border-radius: 3px;
  color: #ffffff;
  font-size: 10px;
  line-height: 15px;
  cursor: pointer;
  margin-right: 10px;
  .fa {
    margin-right: 5px;
  }
`;
const PremiumIcon = styled.img`
  width: 15px;
  height: 15px;
  top: -1px;
  margin-right: 5px;
  position: relative;
`;
const PremiumAlbum = styled.img`
  width: 15px;
  height: 15px;
  top: 0;
  right: 10px;
  position: absolute;
`;
export default AlbumCard;

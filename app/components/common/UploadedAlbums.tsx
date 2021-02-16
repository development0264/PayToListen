/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';

import { RootState } from '../../../redux/reducers/RootReducer';
import {
  SearchCollState,
  ArticleInitialState,
} from '../../../model/SearchModel';
import { Album, Content } from '../../../model/contentModel';
import AlbumCard from './AlbumCard';
import { actions as uploadActions } from '../../../redux/reducers/ContentReducer';
import NewAlbumModal from '../uploadContent/modals/NewModal';
import {
  checkAlbumContentsUploaded,
  fetchPricingOfAlbum,
  getContents,
} from '../../../utils/services';
import AlbumDetail from './AlbumDetail';
import PremiumModal from '../uploadContent/modals/PremiumModal';
import { db } from '../../../utils/firebase';

interface AlbumProps {
  activeMenu: string;
  createAlbum: () => void;
  authorized: boolean;
  setSpinner: (v: boolean) => void;
  collectionId: string;
  setAlbumDetail?: (value: boolean) => void;
  showAlbumDetail?: boolean;
  showAlbumModal?: boolean;
  setShowAlbumModal?: (value: boolean) => void;
  collection: 'performers' | 'sabhas' | 'venues';
}
interface UploadedData {
  contentId: string;
  fileName: string;
}

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
  className: string;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const UploadedAlbums: FC<AlbumProps> = ({
  activeMenu,
  createAlbum,
  authorized,
  setSpinner,
  collectionId,
  showAlbumDetail,
  setAlbumDetail,
  showAlbumModal,
  setShowAlbumModal,
  collection,
}: AlbumProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const articleState = useSelector(articleSelector);
  const collectionState = useSelector(collectionSelector);
  const { article } = collectionState;
  //   const [showEditAlbum, setShowEditAlbum] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<Album>();
  const [activeContents, setActiveContents] = useState<Content[]>();
  //   const [currentUploadedData, setCurrentUploadedData] = useState<
  //     UploadedData[]
  //   >([]);
  const [isEdit, setEdit] = useState(false);
  const [isAlbumUploadPending, setIsAlbumUploadPending] = useState<boolean>(
    false
  );
  //   Premium Data
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const initialPremiumState = {
    startTime: null,
    endTime: null,
    pricing: [],
  };
  const [premiumData, setPremiumData] = useState(initialPremiumState);
  const [isPremiumEdit, setIsPremiumEdit] = useState(false);
  const [isPremiumOpening, setPremiumOpening] = useState(false);

  const handleChange = (event, newValue: number): void => {
    setValue(newValue);
  };

  //   const authSelector = (state: RootState): any => state.auth;
  const contentSelector = (state: RootState): any => state.content;
  const contentState = useSelector(contentSelector);
  const { albums, albumId, uploadedData } = contentState;
  const { addToast } = useToasts();
  useEffect(() => {
    if (!showPremiumModal) {
      setPremiumData(initialPremiumState);
    }
  }, [showPremiumModal]);

  useEffect(() => {
    const fetchNewAlbums = async () => {
      db.collection('EMS-UserPremiumContent').onSnapshot((newSnap) => {
        console.log('NEW SNAP CALLEd ---> ', newSnap);

        dispatch(
          uploadActions.fetchAlbums({
            id: collectionId,
            loginUserID: articleState.currentUser.id || '',
          })
        );
      });
    };

    fetchNewAlbums();
  }, []);

  //   useEffect(() => {
  //     setCurrentUploadedData((data) => {
  //       data.push(...uploadedData);
  //       const uniqData = _.uniqBy(data, 'contentId');
  //       return uniqData;
  //     });
  //   }, [uploadedData]);

  useEffect(() => {
    if (!showAlbumModal) {
      //   setCurrentUploadedData([]);
      setEdit(false);
    }
  }, [showAlbumModal]);

  useEffect(() => {
    dispatch(
      uploadActions.fetchAlbums({
        id: collectionId,
        loginUserID: articleState.currentUser.id || '',
      })
    );
    setSpinner(false);
  }, [articleState.currentUser.id]);

  const openAlbum = (album: Album): void => {
    setEdit(true);
    setActiveAlbum(album);
    getContents(album.id).then((contents) => {
      //   const extractFields = contents.map((content) => {
      //     return { contentId: content.id, fileName: content.title };
      //   });
      //   setCurrentUploadedData([...extractFields]);
      setActiveContents(contents);
      setShowAlbumModal(true);
    });
  };

  const viewAlbum = (album: Album): void => {
    setAlbumDetail(true);
    setActiveAlbum(album);
    getContents(album.id).then((contents) => {
      setActiveContents(contents);
    });
  };

  const publishAlbum = (album: Album): void => {
    setIsAlbumUploadPending(false);
    checkAlbumContentsUploaded(album.id).then((isAllUploaded) => {
      if (isAllUploaded) {
        dispatch(uploadActions.publishAlbum({ id: album.id || '' }));
        setIsPremiumEdit(false);
        setShowPremiumModal(false);
      } else {
        setIsAlbumUploadPending(true);
      }
    });
  };
  const goBack = (): void => {
    setAlbumDetail(false);
  };
  const openPremium = (album: Album, isNew: boolean): void => {
    setIsAlbumUploadPending(false);
    setPremiumOpening(true);
    checkAlbumContentsUploaded(album.id).then((isAllUploaded) => {
      if (isAllUploaded) {
        fetchPricingOfAlbum(album.id).then((resp) => {
          setPremiumOpening(false);
          if (resp.isPresent) {
            setPremiumData(resp.data);
          }
          setActiveAlbum(album);
          setIsPremiumEdit(!isNew);
          setShowPremiumModal(true);
        });
      } else {
        setIsAlbumUploadPending(true);
      }
    });
  };
  const addPremiumContent = (): void => {
    const { startTime, endTime, pricing } = premiumData;
    const sTime = startTime !== null ? moment(startTime).valueOf() : null;
    const eTime = startTime !== null ? moment(endTime).valueOf() : null;
    dispatch(
      uploadActions.publishPremiumAlbum({
        id: activeAlbum.id || '',
        startTime: sTime,
        endTime: eTime,
        pricing,
      })
    );
    setIsPremiumEdit(false);
    setActiveAlbum(undefined);
  };

  const draftAlbums = albums.filter((a) => !a.isPublished);
  const publishedAlbums = albums.filter((a) => a.isPublished);

  if (showAlbumDetail) {
    return (
      <AlbumDetail {...{ activeAlbum, activeContents, goBack, collection }} />
    );
  }

  if (authorized) {
    return (
      <Container>
        <Card className="profileCardView">
          <Card.Header as="h5" className="card-item-style">
            <TitleRow>
              <Title>{activeMenu}</Title>
              <RightActions>
                <Button onClick={createAlbum}>
                  <i className="fa fa-plus-circle" />
                  <span className="txt">Add New</span>
                </Button>
              </RightActions>
            </TitleRow>
          </Card.Header>
          <Card.Body className="body">
            <>
              <Paper className={classes.root}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  centered
                >
                  <Tab label="Draft Albums" />
                  <Tab label="Published Albums" />
                </Tabs>
              </Paper>
              <TabPanel value={value} index={0} className="profileCardBody">
                {isAlbumUploadPending && (
                  <span
                    className="text-danger"
                    style={{
                      position: 'absolute',
                      top: 70,
                      left: 10,
                    }}
                  >
                    * File upload is pending, please wait some time
                  </span>
                )}
                {draftAlbums.length > 0 ? (
                  draftAlbums.map((album: Album) => {
                    return (
                      <AlbumCard
                        key={album.id}
                        authorized={authorized}
                        openAlbum={(): void => openAlbum(album)}
                        viewAlbum={(): void => viewAlbum(album)}
                        publishAlbum={(): void => publishAlbum(album)}
                        collection={collection}
                        openPremium={(): void => openPremium(album, true)}
                        isPremiumOpening={isPremiumOpening}
                        {...album}
                      />
                    );
                  })
                ) : (
                  <p>There is no more albums</p>
                )}
              </TabPanel>
              <TabPanel value={value} index={1} className="profileCardBody">
                {publishedAlbums.length > 0 ? (
                  publishedAlbums.map((album: Album) => {
                    return (
                      <AlbumCard
                        key={album.id}
                        authorized={authorized}
                        openPremium={(): void => openPremium(album, false)}
                        viewAlbum={(): void => viewAlbum(album)}
                        isPremiumOpening={isPremiumOpening}
                        openAlbum={(): void => openAlbum(album)}
                        collection={collection}
                        {...album}
                      />
                    );
                  })
                ) : (
                  <p>There is no more albums</p>
                )}
              </TabPanel>
            </>
          </Card.Body>
        </Card>
        {((isEdit && activeAlbum && activeContents) ||
          (!isEdit && showAlbumModal)) && (
          <NewAlbumModal
            {...{
              isEdit,
              article,
              currentCollection: collection,
              visible: showAlbumModal,
              toggleVisible: setShowAlbumModal,
              album: activeAlbum,
              contents: activeContents,
              albumId: isEdit ? activeAlbum?.id : albumId,
              uploadedData,
            }}
          />
        )}
        {showPremiumModal && (
          <PremiumModal
            {...{
              showPremiumModal,
              setShowPremiumModal,
              premiumData,
              setPremiumData,
              addPremiumContent,
              changeAsRegular: publishAlbum,
              album: activeAlbum,
              collectionFrom: collection,
              isEdit: isPremiumEdit,
            }}
          />
        )}
      </Container>
    );
  }

  return albums.length > 0 ? (
    <Albums>
      {albums.length > 0 ? (
        _.chain(albums)
          .map(o => !!!o.recorded ? o : false)
          .compact()
          .filter({ isPublished: true })
          .value()
          .map((album: Album) => {
            console.log('Album..', album);
            return (
              <AlbumCard
                key={album.id}
                authorized={authorized}
                openAlbum={(): void => openAlbum(album)}
                viewAlbum={
                  (): void => viewAlbum(album)
                  // articleState.authToken
                  //   ? album.isPurchased === false && album.premium === true
                  //     ? redirectToPremium()
                  //     : viewAlbum(album)
                  //   : addToast('Please login to view content.', {
                  //       appearance: 'info',
                  //       autoDismiss: true,
                  //     })
                }
                collection={collection}
                isPurchased={
                  album.paymentStatus === undefined ||
                  album.paymentStatus !== 'settled'
                    ? false
                    : album.isPurchased
                }
                paymentStatus={album.paymentStatus}
                {...album}
              />
            );
          })
      ) : (
        <p>There is no more album</p>
      )}
    </Albums>
  ) : (
    <EmptyContent>There is no more album</EmptyContent>
  );
};

const Albums = styled.div`
  margin-bottom: 1rem;
  position: relative;
  max-height: 400px;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  @media (min-width: 768px) {
    justify-content: flex-start;
    flex-direction: row;
    align-items: stretch;
  }
`;

const Container = styled.div`
  margin-bottom: 1rem;
  .profileCardView {
    border: transparent;
    border-radius: 10px;
    overflow: hidden;
    background-color: transparent;
  }
  .card-item-style {
    background-color: ${({ theme }): string => theme.black};
    padding: 16px;
    margin: 0px;
  }
  .body {
    background-color: #ffffff;
  }
  .profileCardBody {
    background-color: #ffffff;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    @media (min-width: 1270px) {
      justify-content: flex-start;
      flex-direction: row;
      align-items: stretch;
    }
  }
  .profileContent {
    color: #000000;
  }
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }): string => theme.white};
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${(props): string => props.theme.violet};
  border-radius: 25px;
  padding: 5px 12px 4px 4px;
  outline: none;
  .fa {
    color: ${(props): string => props.theme.white};
    font-size: 26px;
  }
  .txt {
    color: ${(props): string => props.theme.white};
    font-size: 18px;
    font-weight: bold;
    padding-left: 2px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;
const EmptyContent = styled.p`
  width: 100%;
  text-align: center;
  position: relative;
  color: white;
`;

export default UploadedAlbums;

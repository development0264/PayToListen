import React, { FC, useEffect, useState } from 'react';
import { Row, Col, Nav, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import AppContainer from '../components/common/AppContainer';
import Footer from '../components/common/Footer';
import { RootState } from '../../redux/reducers/RootReducer';
import { actions as uploadActions } from '../../redux/reducers/ContentReducer';

import MusicIcon from '../../assets/images/musicIcon1.png';
import MusicIconEnabled from '../../assets/images/musicIcon2.png';
import FolderIcon from '../../assets/images/folderIcon1.png';
import FolderIconEnabled from '../../assets/images/folderIcon2.png';
import VideoIcon from '../../assets/images/videoIcon1.png';
import VideoIconEnabled from '../../assets/images/videoIcon2.png';
import Album from '../components/uploadContent/Album';
import Audio from '../components/uploadContent/Audio';
import Video from '../components/uploadContent/Video';
import EppopediaNavBar from '../components/eppopediaHome/NavBar';
import { SearchCollState, ArticleInitialState } from '../../model/SearchModel';
import AlbumActions from '../components/uploadContent/AlbumActions';
import NotFound from './NotFound';

const Upload: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const location: {
    pathname: string;
  } = useLocation();
  const { pathname } = location;
  const contentSelector = (state: RootState): any => state.content;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;

  const collectionState = useSelector(collectionSelector);
  const contentState = useSelector(contentSelector);
  const articleState = useSelector(articleSelector);
  const { currentCollection, currentUser } = articleState;
  const {
    mediaUploading,
    albums,
    audios,
    videos,
    uploadedData,
    albumId,
  } = contentState;
  const { article } = collectionState;

  const [highlightAlbum, sethighlightAlbum] = useState<boolean>(true);
  const [highlightAudio, sethighlightAudio] = useState<boolean>(false);
  const [highlightVideo, sethighlightVideo] = useState<boolean>(false);
  const enableAlbum = (): void => {
    sethighlightAlbum(true);
    sethighlightAudio(false);
    sethighlightVideo(false);
  };
  const enableAudio = (): void => {
    sethighlightAudio(true);
    sethighlightAlbum(false);
    sethighlightVideo(false);
  };
  const enableVideo = (): void => {
    sethighlightVideo(true);
    sethighlightAlbum(false);
    sethighlightAudio(false);
  };

  const initialState = [
    {
      id: 1,
      name: 'Albums',
      enable: enableAlbum,
      isEnabled: highlightAlbum,
      icon: highlightAlbum ? FolderIconEnabled : FolderIcon,
    },
    {
      id: 2,
      name: 'Audios',
      enable: enableAudio,
      isEnabled: highlightAudio,
      icon: highlightAudio ? MusicIconEnabled : MusicIcon,
    },
    {
      id: 3,
      name: 'Videos',
      enable: enableVideo,
      isEnabled: highlightVideo,
      icon: highlightVideo ? VideoIconEnabled : VideoIcon,
    },
  ];
  const [menus, setMenus] = useState(initialState);

  const updateMenu = (): void => {
    setMenus(initialState);
  };

  const loadInitialData = (): void => {
    dispatch(uploadActions.fetchAlbums({ id: article?.result?.id || '' }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    updateMenu();
  }, [highlightAlbum, highlightAudio, highlightVideo]);

  useEffect(() => {
    loadInitialData();
  }, []);

  if (!currentUser.isLogin) {
    return <NotFound />;
  }

  return (
    <Container>
      <AppContainer />
      <EppopediaNavBar />
      <MainContainer>
        <TabContainer>
          <Tab.Container id="left-tabs" defaultActiveKey="Albums">
            <Row>
              <Col xs={12} md={2} style={{ marginTop: 50 }}>
                <Nav className="flex-column">
                  {menus.map((menu) => {
                    return (
                      <Nav.Item key={menu.id}>
                        <Nav.Link eventKey={menu.name} onClick={menu.enable}>
                          <Menu active={menu.isEnabled}>
                            <MenuIcon
                              style={{ marginBottom: 5 }}
                              src={menu.icon}
                              alt="Albums"
                            />
                            <MenuTxt>{menu.name}</MenuTxt>
                          </Menu>
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
              </Col>
              <Col xs={12} md={10}>
                <Tab.Content className="w-100">
                  <Tab.Pane eventKey="Albums">
                    <AlbumActions
                      {...{ isEdit: true, isTrash: true, isMove: false }}
                    />

                    <Album
                      {...{
                        mediaUploading,
                        albums,
                        article,
                        currentCollection,
                        uploadedData,
                        albumId,
                      }}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Audios">
                    <AlbumActions
                      {...{ isEdit: true, isTrash: true, isMove: true }}
                    />
                    <Audio
                      {...{
                        mediaUploading,
                        audios,
                        article,
                        currentCollection,
                        uploadedData,
                        albumId,
                      }}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Videos">
                    <AlbumActions
                      {...{ isEdit: true, isTrash: true, isMove: true }}
                    />
                    <Video
                      {...{
                        mediaUploading,
                        videos,
                        article,
                        currentCollection,
                        uploadedData,
                        albumId,
                      }}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </TabContainer>
        <Footer />
      </MainContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  margin-top: 7rem;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const TabContainer = styled.div`
  width: 87%;
  margin: 0 auto;
`;
const Menu = styled.div<{ active: boolean }>`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme, active }): string =>
    active ? theme.lightPink : theme.white};
  outline: none;
  text-align: center;
`;
const MenuIcon = styled.img`
  width: 36px;
  height: 30px;
`;
const MenuTxt = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
`;

export default Upload;

/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';

import SearchBox from '../components/common/SearchBox';
import EppopediaNavBar from '../components/eppopediaHome/NavBar';
import ArtistDetail from '../components/artist/ArtistDetail';
import AppContainer from '../components/common/AppContainer';
import { RootState } from '../../redux/reducers/RootReducer';
import {
  SearchCollState,
  SearchCollectionParams,
  ArticleInitialState,
} from '../../model/SearchModel';
import { Firebase } from '../../utils/firebase';
import { actions as MainSearchActions } from '../../redux/reducers/SearchReducer';
import { actions as SearchActions } from '../../redux/reducers/searchCollectionReducer';
import { actions as ArticleActions } from '../../redux/reducers/ArticleReducer';
import { useInitialProfile, useAuthorized } from '../../hooks/useProfile';
import ArtistFooter from '../components/artist/ArtistFooter';
import NewFooter from '../components/common/NewFooter';
import { fetchCollectionId } from '../../utils/services';

const EppopediaArticle: FC = (): JSX.Element => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, state: pathState }: any = location;
  console.log('Data is ', location);
  // const currentId = state?.id;
  const [currentId, setCurrentId] = useState(pathState?.id || '');
  const [isFetching, setIsFetching] = useState(false);
  const [none, collectionName, name]: any[] = pathname.split('/');

  const [collection, setCollection] = useState(
    name === undefined ? 'performers' : collectionName
  );

  const dispatch = useDispatch();
  const authSelector = (state: { auth: any }): any => state.auth;
  const authState = useSelector(authSelector);
  const articleSelector = (state: RootState): any => state.article;
  const articleState: ArticleInitialState = useSelector(articleSelector);
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const collectionState = useSelector(collectionSelector);

  const contentSelector = (state: RootState): any => state.content;
  const contentState = useSelector(contentSelector);
  const { mediaUploading } = contentState;
  const { currentUser, fetching: articleFetching } = articleState;
  const { authToken } = authState;
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showSpinner, setSpinner] = useState<boolean>(false);

  useEffect(() => {
    if (currentId === '') {
      // setSearchValue(name);
      setIsFetching(true);
      const key =
        collection === 'sabhas'
          ? 'Series'
          : _.startCase(collection.slice(0, -1));
      fetchCollectionId({
        key,
        name: name === undefined ? collectionName : name,
      }).then(({ id }) => {
        if (id === '') setIsFetching(false);
        setCurrentId(id);
      });
    }
  }, [currentId, pathState?.id, name]);

  useEffect(() => {
    if (pathState?.id) {
      setCurrentId(pathState?.id);
    }
  }, [pathState?.id]);

  const {
    article,
    currentPerformerSearch,
    currentSabhaSearch,
    currentVenueSearch,
  } = collectionState;
  const loadCollection = (): void => {};
  let searchResult = currentPerformerSearch;
  switch (collection) {
    case 'performers': {
      searchResult = currentPerformerSearch;
      break;
    }
    case 'sabhas': {
      searchResult = currentSabhaSearch;
      break;
    }
    case 'venues': {
      searchResult = currentVenueSearch;
      break;
    }
    default:
      searchResult = currentPerformerSearch;
  }

  const onchangeText = (value: string, fetching = true): void => {
    setSearchValue(value);
    if (fetching) {
      const searchParams: SearchCollectionParams = {
        collection: collection || 'performers',
        key: '',
        page: 1,
        pageSize: 10,
        authToken,
        order: 'asc',
        view: false,
      };
      if (value?.length > 2) {
        switch (collection) {
          case 'performers': {
            dispatch(
              SearchActions.onPerformerFieldChange({
                ...searchParams,
                key: value,
              })
            );
            break;
          }
          case 'sabhas': {
            dispatch(
              SearchActions.onSabhaFieldChange({ ...searchParams, key: value })
            );
            break;
          }
          case 'venues': {
            dispatch(
              SearchActions.onVenueFieldChange({ ...searchParams, key: value })
            );
            break;
          }
          default:
            dispatch(
              SearchActions.onPerformerFieldChange({
                ...searchParams,
                key: value,
              })
            );
        }
      }
    }
  };

  useEffect(() => {
    if (articleFetching || mediaUploading) {
      setSpinner(true);
    } else {
      setSpinner(false);
    }
  }, [articleFetching, mediaUploading]);

  useEffect(() => {
    if (article?.result?.name !== undefined) {
      onchangeText(article?.result?.name);
      setSpinner(false);
    }
    return () => {
      setSearchValue('');
    };
  }, [article?.result]);

  useEffect(() => {
    if (article?.result?.id) {
      const recentParams = { collection, item: article?.result };
      dispatch(MainSearchActions.addRecentSearch(recentParams));
    }
  }, [article]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useInitialProfile({ setSpinner, collection, currentId, authToken });
  const { authorized } = useAuthorized({ currentUser, currentId, article });
  console.log('isAuth..', authorized);
  // if (articleState.authToken !== '') {
  //   authorized = null;
  // }

  const openLoginModal = (): void => {
    setShowModal(true);
  };

  const logout = (): void => {
    Firebase.auth()
      .signOut()
      .then(() => {
        dispatch(ArticleActions.userLogoutRequest({ id: currentId }));
      })
      .catch((err) => {
        console.log('Logout error...');
      });
  };

  const gotoPending = (): void => {
    history.push({
      pathname: '/pendingProfiles',
      state: {
        authorized,
      },
    });
  };

  return (
    <Container>
      <AppContainer />
      {/* <EppopediaNavBar /> */}
      {(showSpinner || (currentId === '' && isFetching)) && (
        <ProfileSpinner>
          <Spinner
            animation="border"
            variant="light"
            role="status"
            className="spin"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </ProfileSpinner>
      )}

      <MainPage
        isAdmin={currentUser?.isAdmin}
        isNonAdmin={currentUser?.isLogin && !currentUser?.isAdmin}
      >
        <BodyBlock>
          {currentUser.email && (
            <NameBlock>
              <Name>{currentUser.email}</Name>
            </NameBlock>
          )}
          {currentUser?.isAdmin && (
            <UserInfo>
              <PendingButton onClick={gotoPending}>
                <span className="txt">Pending Profiles</span>
              </PendingButton>
            </UserInfo>
          )}
          <SearchBox
            from={collection || 'performers'}
            searchValue={searchValue}
            loadCollection={loadCollection}
            onChangeText={onchangeText}
            currentSearch={searchResult}
            isSamePage
            containerStyle={{
              width: '94%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          />
          {currentId === '' && !isFetching ? (
            <EmptyMsg>
              <p>No record found!</p>
            </EmptyMsg>
          ) : (
            <>
              <ArtistDetail
                detail={article?.result}
                from={collection}
                loginModal={openLoginModal}
                logout={logout}
                authToken={authToken}
                collectionId={currentId}
                authorized={authorized}
                setSpinner={setSpinner}
              />
            </>
          )}
        </BodyBlock>
        <ArtistFooter
          {...{
            authorized,
            article,
            collection,
            currentId,
            showModal,
            setShowModal,
          }}
        />
        <NewFooter />
      </MainPage>
    </Container>
  );
};

const Container = styled.div`
  flex: 1,
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const PendingButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${(props): string => props.theme.violet};
  border-radius: 25px;
  padding: 5px 12px;
  outline: none;
  margin-right: 6%;
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
const UserInfo = styled.div`
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  margin-bottom: 0.5rem;
`;
const NameBlock = styled.div`
  width: 100%;
  text-align: right;
  margin-top: 1rem;
`;
const Name = styled.span`
  position: relative;
  margin-right: 6%;
  color: ${({ theme }): string => theme.primary};
`;

const ProfileSpinner = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
  .spin {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 60px;
    width: 60px;
    margin: 0px auto;
    z-index: 99999;
  }
`;
const MainPage = styled.div<{ isAdmin: boolean; isNonAdmin: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  margin-top: ${({ isAdmin, isNonAdmin }): string =>
    isAdmin ? '0' : isNonAdmin ? '1rem' : '4rem'};
`;

const EmptyMsg = styled.div`
  flex: 1;
  position: relative;
  color: white;
  text-align: center;
`;
const BodyBlock = styled.div``;

const LogoutButton = styled.span`
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
  padding: 4px 12px;
  margin: 0.5rem 0;
  margin-left: 5px;
  outline: none;
  width: 105px;
  position: relative;
  background-color: ${({ theme }): string => theme.white};
  .fa {
    background-color: ${({ theme }): string => theme.primary};
    color: ${({ theme }): string => theme.white};
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin: 0 0.2rem;
    margin-left: -10px;
    text-align: center;
    padding: 6px 9px;
  }
`;

const LogoutTxt = styled.span`
  color: ${({ theme }): string => theme.primary};
  padding-left: 5px;
`;

export default EppopediaArticle;

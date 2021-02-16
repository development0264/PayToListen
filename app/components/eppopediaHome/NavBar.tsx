/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import NavBar from '../common/NavBar';
import { Firebase } from '../../../utils/firebase';
import { actions as ArticleActions } from '../../../redux/reducers/ArticleReducer';
import { RootState } from '../../../redux/reducers/RootReducer';
import Logo from '../../../assets/images/logo.png';
import LoginModal from '../artist/LoginModal';
import { fireLoginUser } from '../../../hooks/useProfile';
import {
  ArticleInitialState,
  SearchCollState,
} from '../../../model/SearchModel';
import { actions as playerActions } from '../../../redux/reducers/PlayerReducer';

const EppopediaNavBar: FC = (): JSX.Element => {
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const articleState = useSelector(articleSelector);
  const collectionState = useSelector(collectionSelector);
  const { currentCollection } = articleState;

  const { article } = collectionState;
  const [showModal, setShowModal] = useState(false);
  const [googleProvider] = useState(new Firebase.auth.GoogleAuthProvider());
  const [fbProvider] = useState(new Firebase.auth.FacebookAuthProvider());

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  // console.log("NavBarFile", articleState);
  const logOut = (): void => {
    Firebase.auth()
      .signOut()
      .then(() => {
        dispatch(ArticleActions.userLogoutRequest({ id: article?.result?.id }));
        history.push({
          pathname: `/${currentCollection}/${article?.result?.id}`,
          state: { from: currentCollection },
        });
      })
      .catch((err) => {
        // console.log('Logout error...');
      });
  };
  const toggleShowModal = (): void => {
    setShowModal(!showModal);
  };
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

  const logoutUser = (): void => {
    dispatch(ArticleActions.userLogout({ id: articleState.currentUser.id }));
    dispatch(playerActions.addSongs({ contents: [], index: 0 }));
  };

  const isOtherMatch = location.pathname.match(/createEvent|uploadnew/);
  const otherNavs = isOtherMatch === null;
  return (
    <>
      <LoginModal
        {...{ showModal, setShowModal, article: null, googleLogin, fbLogin }}
      />
      <NavBar
        loginModal={toggleShowModal}
        logo={Logo}
        otherNavs={otherNavs}
        logOut={logOut}
        logoutUser={logoutUser}
        authToken={articleState.authToken}
        page="eppopediaHome"
      />
    </>
  );
};

export default EppopediaNavBar;

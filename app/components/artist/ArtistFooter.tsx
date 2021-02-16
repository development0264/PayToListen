import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { PendingProfileParams } from '../../../model/SearchModel';
import { Firebase } from '../../../utils/firebase';
import { fireLogin } from '../../../hooks/useProfile';
import { actions as ArticleActions } from '../../../redux/reducers/ArticleReducer';
import { useToasts } from 'react-toast-notifications';

interface ArtistFooterProps {
  authorized: boolean;
  article: any;
  collection: 'performers' | 'sabhas' | 'venues';
  currentId: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const ArtistFooter: FC<ArtistFooterProps> = ({
  article,
  collection,
  currentId,
  showModal,
  setShowModal,
}: ArtistFooterProps): JSX.Element => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [showPendingModal, setPendingModal] = useState(false);
  const [googleProvider] = useState(new Firebase.auth.GoogleAuthProvider());
  const [fbProvider] = useState(new Firebase.auth.FacebookAuthProvider());

  const [pendingDetails, setPendingsDetails] = useState<PendingProfileParams>({
    collection: 'performers',
    userId: '',
    name: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    uid: '',
    referrerEmail: '',
    rCountryCode: '',
    referrerPhoneNumber: '',
  });

  const [isAllValid, setAllValid] = useState(false);
  const [isNameEmpty, setNameEmpty] = useState<boolean>(true);
  const [isNameValid, setNameValid] = useState<boolean>(true);
  const [isEmailEmpty, setEmailEmpty] = useState<boolean>(true);
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const [isPhoneEmpty, setPhoneEmpty] = useState<boolean>(true);
  const [isPhoneValid, setPhoneValid] = useState<boolean>(true);
  const [isCCodeEmpty, setCCode] = useState<boolean>(true);
  const [isRCodeEmpty, setRCode] = useState<boolean>(false);
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    const cond =
      !isNameEmpty &&
      !isEmailEmpty &&
      !isPhoneEmpty &&
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      !isCCodeEmpty &&
      !isRCodeEmpty;
    if (cond) {
      setAllValid(true);
    } else {
      setAllValid(false);
    }
  }, [pendingDetails]);

  const updateLoginProfile = (
    emailName: string | null,
    email: string | null,
    name: string,
    isName: boolean,
    uid: string
  ): void => {
    if (isName) {
      setNameEmpty(false);
    } else if (emailName && emailName?.length > 2) {
      setNameEmpty(false);
      setNameValid(true);
    }
    if (name?.length > 2) {
      setNameValid(true);
    }
    if (email && email?.length > 0) {
      setEmailEmpty(false);
    }
    if (email !== null && emailPattern.test(email)) {
      setEmailValid(true);
    }
    const userId = currentId;
    if (emailName !== null && email !== null) {
      if (!isName) {
        setPendingsDetails({
          ...pendingDetails,
          name: emailName,
          email,
          userId,
          uid,
        });
      } else {
        setPendingsDetails({
          ...pendingDetails,
          name,
          email,
          userId,
          uid,
        });
      }
    } else if (email === null && emailName !== null) {
      if (!isName) {
        setPendingsDetails({
          ...pendingDetails,
          name: emailName,
          userId,
          uid,
        });
      } else {
        setPendingsDetails({ ...pendingDetails, name, uid, userId });
      }
    } else if (email !== null && emailName === null) {
      setPendingsDetails({
        ...pendingDetails,
        email,
        name,
        uid,
        userId,
      });
    } else {
      setPendingsDetails({ ...pendingDetails, name, uid, userId });
    }
    setPendingModal(true);
  };

  const googleLogin = (): void => {
    googleProvider.addScope('email');
    fireLogin({
      setShowModal,
      updateLoginProfile,
      collection,
      currentId,
      article,
      dispatch,
      provider: googleProvider,
    });
  };
  const fbLogin = (): void => {
    fbProvider.addScope('email');
    fireLogin({
      setShowModal,
      updateLoginProfile,
      collection,
      currentId,
      article,
      dispatch,
      provider: fbProvider,
    });
  };

  const addDetails = (): void => {
    const {
      countryCode,
      rCountryCode,
      phoneNumber,
      referrerPhoneNumber,
      ...other
    } = pendingDetails;
    const newParams = {
      phoneNumber: `${countryCode} ${phoneNumber}`,
      referrerPhoneNumber: `${rCountryCode} ${referrerPhoneNumber}`,
      ...other,
    };
    const articlePendingParams: Partial<PendingProfileParams> = {
      ...newParams,
      collection,
    };
    dispatch(ArticleActions.addPendingProfile(articlePendingParams));
    addToast(
      'Your request is being processed, we will notify you by email with 48 hours. Please email us at support@eppomusic.com, if you have any questions.',
      {
        appearance: 'info',
        autoDismiss: true,
      }
    );
    setPendingModal(false);
  };

  return (
    <>
      <LoginModal
        {...{ showModal, setShowModal, article, googleLogin, fbLogin }}
      />
      <SignupModal
        {...{
          showPendingModal,
          setPendingModal,
          article,
          setNameEmpty,
          setNameValid,
          setEmailEmpty,
          setEmailValid,
          setPhoneEmpty,
          setPhoneValid,
          emailPattern,
          isNameEmpty,
          isNameValid,
          isEmailEmpty,
          isEmailValid,
          isPhoneEmpty,
          isPhoneValid,
          isCCodeEmpty,
          isRCodeEmpty,
          setCCode,
          setRCode,
          addDetails,
          isAllValid,
          pendingDetails,
          setPendingsDetails,
        }}
      />
    </>
  );
};

export default ArtistFooter;

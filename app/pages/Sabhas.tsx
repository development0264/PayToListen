// @ts-nocheck
import React, { useEffect, FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { RootState } from '../../redux/reducers/RootReducer';
import { actions } from '../../redux/reducers/searchCollectionReducer';
import {
  SearchCollState,
  SearchCollectionParams,
  SearchState,
} from '../../model/SearchModel';
import CollectionListing from '../components/listing/CollectionListing';

const Sabhas: FC = (): JSX.Element => {
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const searchSelector = (state: RootState): SearchState => state.search;
  const authSelector = (state: RootState): any => state.auth;
  const authState = useSelector(authSelector);
  const collectionState = useSelector(collectionSelector);
  const searchState = useSelector(searchSelector);
  const dispatch = useDispatch();
  const {
    sabhas,
    searchSabhaKey,
    fetching,
    currentSabhaSearch,
    isPageEnd,
  } = collectionState;
  const { authToken } = authState;
  const {
    searchKey: { key },
  } = searchState;
  const [searchValue, setSearchValue] = useState(
    searchSabhaKey?.key || key || ''
  );
  const { pathname, state } = useLocation();
  const params: SearchCollectionParams = {
    collection: 'sabhas',
    key: '',
    page: 1,
    pageSize: 10,
    authToken,
    order: state?.views ? 'desc' : 'asc',
    view: !!state?.views,
  };

  const fetchInitialCollection = (): void => {
    dispatch(actions.fetchSabhas({ ...params, key: searchValue }));
  };

  useEffect(() => {
    fetchInitialCollection();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const loadFunc = (): void => {
    const { page } = searchSabhaKey;
    if (!fetching && !isPageEnd) {
      dispatch(
        actions.fetchSabhas({ ...params, key: searchValue, page: page + 1 })
      );
    }
  };
  const onChangeText = (value: string, trigger = true): void => {
    setSearchValue(value);
    if (trigger) {
      dispatch(actions.onSabhaFieldChange({ ...params, key: value }));
      if (value === '') {
        dispatch(actions.fetchSabhas(params));
      }
    }
  };
  const loadCollection = (): void => {
    dispatch(actions.fetchSabhas({ ...params, key: searchValue }));
  };
  return (
    <CollectionListing
      {...{
        searchValue,
        onChangeText,
        loadCollection,
        loadFunc,
        currentSearch: currentSabhaSearch,
        collection: sabhas,
        collectionFrom: 'sabhas',
        collIndex: 1,
        isPageEnd,
      }}
    />
  );
};

export default Sabhas;

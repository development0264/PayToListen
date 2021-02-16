// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { RootState } from '../../redux/reducers/RootReducer';
import {
  SearchCollState,
  SearchCollectionParams,
  SearchState,
} from '../../model/SearchModel';
import { actions } from '../../redux/reducers/searchCollectionReducer';
import CollectionListing from '../components/listing/CollectionListing';

const Performers = (): JSX.Element => {
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const searchSelector = (state: RootState): SearchState => state.search;
  const authSelector = (state: RootState): any => state.auth;
  const searchState = useSelector(searchSelector);
  const authState = useSelector(authSelector);
  const collectionState = useSelector(collectionSelector);
  const dispatch = useDispatch();
  const { authToken } = authState;
  const {
    performers,
    searchPerformerKey,
    fetching,
    currentPerformerSearch,
    isPageEnd,
  } = collectionState;
  const {
    searchKey: { key },
  } = searchState;
  const [searchValue, setSearchValue] = useState(
    searchPerformerKey?.key || key || ''
  );
  const { pathname, state } = useLocation();
  const params: SearchCollectionParams = {
    collection: 'performers',
    key: '',
    page: 1,
    pageSize: 10,
    authToken,
    order: state?.views ? 'desc' : 'asc',
    view: !!state?.views,
  };
  const fetchInitialCollection = (): void => {
    dispatch(actions.fetchPerformers({ ...params, key: searchValue }));
  };

  useEffect(() => {
    fetchInitialCollection();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const onChangeText = (value: string, trigger = true): void => {
    setSearchValue(value);
    if (trigger) {
      dispatch(actions.onPerformerFieldChange({ ...params, key: value }));
      if (value === '') {
        dispatch(actions.fetchPerformers(params));
      }
    }
  };
  const loadCollection = (): void => {
    dispatch(actions.fetchPerformers({ ...params, key: searchValue }));
  };
  const loadFunc = (): void => {
    const { page } = searchPerformerKey;
    if (!fetching && !isPageEnd) {
      dispatch(
        actions.fetchPerformers({ ...params, key: searchValue, page: page + 1 })
      );
    }
  };
  return (
    <CollectionListing
      {...{
        searchValue,
        onChangeText,
        loadCollection,
        loadFunc,
        currentSearch: currentPerformerSearch,
        collection: performers,
        collectionFrom: 'performers',
        collIndex: 0,
        isPageEnd,
      }}
    />
  );
};

export default Performers;

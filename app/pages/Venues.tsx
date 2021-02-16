// @ts-nocheck
import React, { useEffect, FC, useState } from 'react';
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

const Venues: FC = (): JSX.Element => {
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const searchSelector = (state: RootState): SearchState => state.search;
  const authSelector = (state: RootState): any => state.auth;
  const authState = useSelector(authSelector);
  const collectionState = useSelector(collectionSelector);
  const dispatch = useDispatch();
  const {
    venues,
    searchVenueKey,
    fetching,
    currentVenueSearch,
    isPageEnd,
  } = collectionState;
  const searchState = useSelector(searchSelector);
  const {
    searchKey: { key },
  } = searchState;
  const [searchValue, setSearchValue] = useState(
    searchVenueKey?.key || key || ''
  );
  const { authToken } = authState;
  const { pathname, state } = useLocation();
  const params: SearchCollectionParams = {
    collection: 'venues',
    key: '',
    page: 1,
    pageSize: 10,
    authToken,
    order: state?.views ? 'desc' : 'asc',
    view: !!state?.views,
  };
  const fetchInitialCollection = (): void => {
    dispatch(actions.fetchVenues({ ...params, key: searchValue }));
  };

  useEffect(() => {
    fetchInitialCollection();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const loadFunc = (): void => {
    const { page } = searchVenueKey;
    if (!fetching && !isPageEnd) {
      dispatch(
        actions.fetchVenues({ ...params, page: page + 1, key: searchValue })
      );
    }
  };
  const onChangeText = (value: string, trigger = true): void => {
    setSearchValue(value);
    if (trigger) {
      dispatch(actions.onVenueFieldChange({ ...params, key: value }));
      if (value === '') {
        dispatch(actions.fetchVenues(params));
      }
    }
  };
  const loadCollection = (): void => {
    dispatch(actions.fetchVenues({ ...params, key: searchValue }));
  };
  return (
    <CollectionListing
      {...{
        searchValue,
        onChangeText,
        loadCollection,
        loadFunc,
        currentSearch: currentVenueSearch,
        collection: venues,
        collectionFrom: 'venues',
        collIndex: 2,
        isPageEnd,
      }}
    />
  );
};

export default Venues;

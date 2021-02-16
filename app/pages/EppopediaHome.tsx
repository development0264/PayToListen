import React, { FC, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Levenshtein from 'levenshtein';
import { useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

import EppopediaNavBar from '../components/eppopediaHome/NavBar';
import SearchCollectionBox from '../components/eppopediaHome/SearchCollectionBox';
import ListItems from '../components/eppopediaHome/ListItems';
import NewFooter from '../components/common/NewFooter';
import AppContainer from '../components/common/AppContainer';
import { RootState } from '../../redux/reducers/RootReducer';
import {
  SearchState,
  SearchCollectionParams,
  SearchCollState,
} from '../../model/SearchModel';
import { actions } from '../../redux/reducers/SearchReducer';
import { actions as CollectionActions } from '../../redux/reducers/searchCollectionReducer';
import EppoFeatures from '../components/eppopediaHome/EppoFeatures';
import downArrow from '../../assets/images/downArrow.png';
import upArrow from '../../assets/images/upArrow.png';
import Updates from '../components/eppopediaHome/EppoUpdates';
import TopViews from '../components/eppopediaHome/TopViews';

const publicIp = require('public-ip');

const EppopediaHomePage: FC = (): JSX.Element => {
  const searchSelector = (state: RootState): SearchState => state.search;
  const authSelector = (state: RootState) => state.auth;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const { pathname } = useLocation();
  const searchState = useSelector(searchSelector);
  const authState = useSelector(authSelector);
  const collectionState = useSelector(collectionSelector);
  const dispatch = useDispatch();
  const [block, setBlock] = useState(0);
  const [down, setDown] = useState(true);
  const [showSpinner, setSpinner] = useState(false);
  const { authToken } = authState;
  const {
    sabhas,
    performers,
    venues,
    currentSearch,
    albums,
    searchKey: { key },
    recentSearch,
  } = searchState;
  const {
    topPremiumAlbum,
    topPerformers,
    topSabhas,
    topVenues,
    fetching,
  } = collectionState;
  const [isSearch, setSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState(key);

  const searchResult = [
    {
      id: 1,
      for: 'Performers',
      collection: performers,
    },
    {
      id: 2,
      for: 'Sabhas',
      collection: sabhas,
    },
    {
      id: 3,
      for: 'Venues',
      collection: venues,
    },
    {
      id: 4,
      for: 'Albums',
      collection: albums,
    },
  ];

  useEffect(() => {
    const getLocation = async (): Promise<void> => {
      dispatch(
        CollectionActions.getUserLocation({
          ipAddress: await publicIp.v4(),
        })
      );
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (
      topPerformers.length > 0 ||
      topSabhas.length > 0 ||
      topVenues.length > 0 ||
      topPremiumAlbum.length > 0
    ) {
      setSpinner(false);
    } else {
      setSpinner(true);
    }
  }, [topPerformers, topSabhas, topVenues, topPremiumAlbum]);

  //   console.log('COLLECTION STATE ==> ', collectionState);

  const getTopCollections = (): void => {
    const params: SearchCollectionParams = {
      collection: 'performers',
      key: '',
      authToken,
      page: 1,
      pageSize: 20,
      order: 'desc',
      view: true,
    };
    dispatch(CollectionActions.fetchTopCollection(params));
    dispatch(
      CollectionActions.fetchTopCollection({ ...params, collection: 'sabhas' })
    );
    dispatch(
      CollectionActions.fetchTopCollection({ ...params, collection: 'venues' })
    );
    dispatch(
      CollectionActions.fetchTopCollection({ ...params, collection: 'albums' })
    );
  };

  const scrollTop = (
    element: HTMLElement,
    to: number,
    duration: number
  ): void => {
    if (duration <= 0) return;
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      element.scrollTop += perTick;
      if (element.scrollTop === to) return;
      scrollTop(element, to, duration - 10);
    }, 10);
  };

  useEffect(() => {
    if (authToken?.length > 0) {
      getTopCollections();
    }
  }, [authToken]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const clearSearch = (): void => {
    dispatch(actions.clearSearch());
  };

  const onSearch = (keyValue: string, trigger = true): void => {
    if (trigger) {
      const params: SearchCollectionParams = {
        collection: 'performers',
        key: keyValue,
        authToken,
        page: 1,
        pageSize: 20,
        order: 'asc',
        view: false,
      };
      if (keyValue?.length > 2) {
        dispatch(actions.onChangeField(params));
        dispatch(actions.onChangeField({ ...params, collection: 'sabhas' }));
        dispatch(actions.onChangeField({ ...params, collection: 'venues' }));
        dispatch(actions.onChangeField({ ...params, collection: 'albums' }));
      }
    }
    if (keyValue?.length === 0) {
      clearSearch();
    }
    setSearchValue(keyValue);
  };

  const getElement = (id: string): HTMLElement | null =>
    document.getElementById(id);

  const showBottom = (): void => {
    const element: HTMLElement = document.documentElement;
    if (element !== null) {
      switch (block) {
        case 0:
        case 1:
        case 2:
        case 3: {
          const top = getElement(`topContainer${block + 1}`);
          if (top !== null) {
            scrollTop(element, top.offsetTop + 180, 600);
          }
          setBlock((v) => (down ? v + 1 : v - 1));
          break;
        }
        case 4: {
          const top = getElement('ourUpdates');
          if (top !== null) {
            scrollTop(element, top.offsetTop + 170, 600);
          }
          setBlock(3);
          setDown(false);
          break;
        }
        default:
          scrollTop(element, 0, 600);
          setBlock(0);
          setDown(true);
      }
    }
  };

  const searchListing = useCallback(() => {
    const eppoCollection: any = [];
    if (venues?.length > 0) {
      venues?.forEach((venue) => {
        eppoCollection.push({ collection: 'venues', item: venue });
      });
    }
    if (sabhas?.length > 0) {
      sabhas?.forEach((sabha) => {
        eppoCollection.push({ collection: 'sabhas', item: sabha });
      });
    }
    if (performers?.length > 0) {
      performers?.forEach((performer) => {
        eppoCollection.push({ collection: 'performers', item: performer });
      });
    }
    if (albums?.length > 0) {
      albums?.forEach((premiumAlbum) => {
        eppoCollection.push({ collection: 'albums', item: premiumAlbum });
      });
    }

    // sort the collection with most relevant search name using Levenshtein algo
    return eppoCollection.sort(
      (a: { item: { name: string } }, b: { item: { name: string } }) => {
        return (
          new Levenshtein(a?.item?.name || '', searchValue).distance -
          new Levenshtein(b?.item?.name || '', searchValue).distance
        );
      }
    );
  }, [venues, sabhas, performers]);

  const isTopCollection =
    topPerformers?.length > 0 || topSabhas?.length > 0 || topVenues?.length > 0;

  const renderFooter = (): JSX.Element => {
    const isCollection = searchResult?.findIndex(
      (search) => search.collection.length > 0
    );
    if (!isSearch || isCollection !== -1) {
      return <NewFooter />;
    }
    return null;
  };

  return (
    <>
      <AppContainer />
      {/* <EppopediaNavBar /> */}
      {showSpinner && (
        <SpinnerContainer>
          <Spinner
            animation="border"
            variant="light"
            role="status"
            className="spin"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </SpinnerContainer>
      )}
      <Container>
        <SearchCollectionBox
          {...{
            setSearch,
            sabhas,
            list: searchListing(),
            currentSearch,
            searchValue,
            onSearch,
            clear: clearSearch,
            recentSearch,
          }}
        />
        {!isSearch && (
          <>
            <EppoFeatures />
            <TopViews
              {...{
                isTopCollection,
                albums: topPremiumAlbum,
                performers: topPerformers,
                sabhas: topSabhas,
                venues: topVenues,
                id: 'topContainer',
              }}
            />
            <Updates {...{ id: 'ourUpdates' }} />
            <ArrowIcon
              onClick={showBottom}
              onKeyPress={showBottom}
              role="button"
              tabIndex={0}
            >
              <img src={down ? downArrow : upArrow} alt="down" />
            </ArrowIcon>
          </>
        )}
        {isSearch && (
          <SearchResult>
            {searchResult.map((search) => {
              if (search.collection.length === 0 || searchValue.length === 0)
                return (
                  <NoResult>
                    <Title>{search.for}</Title>
                    <Text>No search result found</Text>
                  </NoResult>
                );
              return (
                <ListItems
                  key={search.id.toString()}
                  listFor={search.for}
                  showTitle
                  data={search.collection}
                />
              );
            })}
          </SearchResult>
        )}
        {renderFooter()}
      </Container>
    </>
  );
};

const SpinnerContainer = styled.div`
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
const Container = styled.div`
  position: absolute;
  top: 12rem;
  width: 100%;
`;

const ArrowIcon = styled.div`
  outline: none;
  position: fixed;
  bottom: 80px;
  right: 30px;
  z-index: 9999;
  img {
    cursor: pointer;
    width: 40px;
  }
`;
const SearchResult = styled.div`
  margin: 1rem auto;
  width: 85%;
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const NoResult = styled.div`
  width: 100%;
  margin: 1rem 0;
`;
const Title = styled.h3`
  color: ${({ theme }): string => theme.white};
`;
const Text = styled.div`
  color: ${({ theme }): string => theme.white};
  font-size: 20px;
  text-align: center;
`;

export default EppopediaHomePage;

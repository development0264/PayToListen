import React, { FC, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';

import styled from 'styled-components';
import AppContainer from '../common/AppContainer';
import EppopediaNavBar from '../eppopediaHome/NavBar';
import SearchBox from '../common/SearchBox';
import CollectionHeader from '../eppopediaHome/CollectionHeader';
import Item from '../eppopediaHome/Item';
import upArrow from '../../../assets/images/upArrow.png';

interface Props {
  searchValue: string;
  onChangeText: (value: string, fetching?: boolean) => void;
  currentSearch: any[];
  loadCollection: () => void;
  loadFunc: () => void;
  collection: any[];
  collectionFrom: 'performers' | 'sabhas' | 'venues';
  collIndex: number;
  isPageEnd: boolean;
}

const Loader = (): JSX.Element => {
  return (
    <LoaderComponent key={0}>
      <Spinner animation="border" role="status" className="colSpinner">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </LoaderComponent>
  );
};

const CollectionListing: FC<Props> = ({
  searchValue,
  onChangeText,
  currentSearch,
  loadCollection,
  loadFunc,
  collection,
  collectionFrom,
  collIndex,
  isPageEnd,
}: Props): JSX.Element => {
  const [isMovedDown, setMovedDown] = useState(false);
  const [views, setViews] = useState({ xs: 12, sm: 6, md: 3, lg: 2 });

  useEffect(() => {
    if (collectionFrom === 'venues') {
      setViews({ xs: 12, sm: 6, md: 4, lg: 3 });
    }
  }, []);

  window.onscroll = (): void => {
    const element = document.documentElement;
    if (element.scrollTop > 500) {
      setMovedDown(true);
    } else {
      setMovedDown(false);
    }
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

  const moveTop = (): void => {
    const element = document.documentElement;
    scrollTop(element, 0, 600);
  };

  return (
    <ListingContainer>
      <AppContainer />
      {/* <EppopediaNavBar /> */}
      <div className="position-relative">
        <div style={{ marginTop: '7rem' }}>
          <Container>
            <Row className="my-1">
              <Col sm={12} md={5} className="my-3">
                <SearchBox
                  from={collectionFrom}
                  placeholder={`Search ${collectionFrom} here...`}
                  searchValue={searchValue}
                  onChangeText={onChangeText}
                  currentSearch={currentSearch}
                  loadCollection={loadCollection}
                />
              </Col>
              <Col sm={12} md={7} className="filter">
                <Col xs={12} sm={12} md={5}>
                  <CollectionHeader pos={collIndex} />
                </Col>
              </Col>
            </Row>
            <div className="pt-4">
              <InfiniteScroll
                pageStart={0}
                loadMore={loadFunc}
                hasMore={!isPageEnd}
                loader={<Loader />}
              >
                <Row>
                  {collection.map((performer) => {
                    return (
                      <Col {...views} key={performer.id}>
                        <Item {...{ item: performer, to: collectionFrom }} />
                      </Col>
                    );
                  })}
                </Row>
              </InfiniteScroll>
            </div>
          </Container>
          {isMovedDown && (
            <div
              className="upArrow"
              onClick={moveTop}
              onKeyPress={moveTop}
              role="button"
              tabIndex={0}
            >
              <img src={upArrow} className="arrowBtn" alt="up" />
            </div>
          )}
        </div>
        {/* {collection.length > 0 && <Footer />} */}
      </div>
    </ListingContainer>
  );
};

const ListingContainer = styled.div`
  .filter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 80%;
    }
    @media screen and (min-width: 576px) {
      display: flex;
      justify-content: flex-end;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }
    }
  }
`;

const LoaderComponent = styled.div`
  width: 100%;
  color: white;
  font-size: 20;
  text-align: center;
`;

export default CollectionListing;

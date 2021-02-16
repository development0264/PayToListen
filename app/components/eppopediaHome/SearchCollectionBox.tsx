/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import SpeechRecognition from 'react-speech-recognition';

import styled from 'styled-components';
import { Sabha } from '../../../model/SearchModel';
import VoiceToText from '../common/VoiceToText';

interface SearchProps {
  setSearch: (v: boolean) => void;
  list: { collection: string; item: any }[];
  sabhas: Sabha[];
  searchValue: string;
  onSearch: (key: string, fetching?: boolean) => void;
  clear: () => void;
  recentSearch: any[];
}

const SearchCollectionBox: FC<SearchProps> = ({
  setSearch,
  list,
  searchValue,
  onSearch,
  clear,
  recentSearch,
}: SearchProps): JSX.Element => {
  const [isFocus, setFocus] = useState(false);
  const [cursor, setCursor] = useState<number | any>('');
  const [currentSearchObj, setCurrentSearchObj] = useState<any | null>(null);
  const [searchListing, setSearchListing] = useState<any[]>([]);
  const [showVoiceContent, setVoiceContent] = useState<boolean>(false);
  const [isListening, setListening] = useState<boolean>(false);
  const [isVoiceReg] = useState<boolean>(
    SpeechRecognition.browserSupportsSpeechRecognition()
  );
  const history = useHistory();
  const updateListing = (): void => {
    setSearchListing(
      list.length > 0 ? list.slice(0, 10) : recentSearch.slice(0, 10)
    );
  };

  useEffect(() => {
    if (searchValue.length === 0) {
      setSearch(false);
    }
  }, [searchValue]);

  useEffect(() => {
    updateListing();
  }, [list]);

  const isSearchChar = searchValue.length > 0;

  useEffect(() => {
    if (searchListing.length > 0 && cursor !== '' && searchListing[cursor]) {
      onSearch(searchListing[cursor]?.item?.name, false);
      setCurrentSearchObj(searchListing[cursor]);
    }
  }, [cursor]);

  const onChangeSearch = (e: any): void => {
    const {
      target: { value },
    } = e;
    onSearch(value);
    setCurrentSearchObj(null);
    setCursor('');
  };

  const callFocus = (): void => {
    setFocus(true);
  };
  const callBlur = (): void => {
    setTimeout(() => {
      setFocus(false);
    }, 250);
  };
  const ShowListing = (): void => {
    setSearch(true);
    setFocus(false);
  };
  const focusSearch = (): void => {
    const searchBox: HTMLElement | null = document.getElementById('searchBox');
    if (searchBox) {
      searchBox.focus();
      setTimeout(() => {
        setFocus(true);
      }, 300);
    }
  };
  const clearSearch = (): void => {
    focusSearch();
    onSearch('');
    clear();
    setSearch(false);
  };
  const updateSearch = (collection: string, id: string, name: string): void => {
    history.push({
      pathname: collection === 'performers' ? `/${name}` :`${collection}/${name}`,
      state: { from: collection, id, req: 'mainSearch' },
    });
    // onSearch(name);
  };
  const submitSearch = (e: any): void => {
    if (e.keyCode === 13) {
      ShowListing();
      if (currentSearchObj) {
        const { collection, item } = currentSearchObj;
        const { id, name } = item;
        updateSearch(collection, id, name);
      }
      const searchBox: HTMLElement | null = document.getElementById(
        'searchBox'
      );
      if (searchBox) {
        searchBox.blur();
      }
    }
    if (e.keyCode === 38 && (cursor > 0 || cursor === '')) {
      setCursor((prevCursor) => {
        if (prevCursor === '') {
          return 0;
        }
        return prevCursor - 1;
      });
    } else if (
      e.keyCode === 40 &&
      (cursor < searchListing.length - 1 || cursor === '')
    ) {
      setCursor((prevCursor) => {
        if (prevCursor === '') {
          return 0;
        }
        return prevCursor + 1;
      });
    }
  };

  const showVoiceToTxt = (): void => {
    setVoiceContent(true);
  };

  return (
    <Container>
      <InnterContainer isFocus={isFocus && searchValue.length > 3}>
        <SearchBox>
          <SearchInput
            isFocus={isFocus && searchValue.length > 3}
            id="searchBox"
            type="text"
            value={searchValue}
            placeholder={isListening ? 'Listening...' : ''}
            onChange={onChangeSearch}
            onKeyDown={submitSearch}
            onFocus={callFocus}
            onBlur={callBlur}
          />
          <SearchIcons isSearch={isSearchChar}>
            {isSearchChar && (
              <span className="close" onClick={clearSearch}>
                X
              </span>
            )}
            {isVoiceReg &&
              (!showVoiceContent ? (
                <span onClick={showVoiceToTxt}>
                  <i className="fa fa-microphone" />
                </span>
              ) : (
                <VoiceToText
                  {...{
                    setSearch: onSearch,
                    toggleBtn: setVoiceContent,
                    showListing: setFocus,
                    setListening,
                  }}
                />
              ))}
            <span onClick={ShowListing}>
              <i className="fa fa-search" />
            </span>
          </SearchIcons>
        </SearchBox>
        {isFocus && searchValue.length > 3 && (
          <ListingContainer>
            <Row>
              <Col xs={8} className="recent">
                {list.length === 0 && <SearchTitle>Recent Search</SearchTitle>}
                <Row>
                  {searchListing.map((listItem: any, i: number) => {
                    // const { collection, item } = listItem;
                    const collection = listItem?.collection;
                    const item = listItem?.item;
                    if (item) {
                      const name = item?.name || '';
                      const id = item?.id || '';
                      return (
                        <Col key={id} sm={12} md={6}>
                          <CurrentMenu
                            className="recentColItem"
                            isCurrent={cursor === i}
                            onClick={(): void => updateSearch(collection, id, name)}
                          >
                            {name}
                          </CurrentMenu>
                        </Col>
                      );
                    }
                    return null;
                  })}
                </Row>
              </Col>
              <Col xs={4} className="menus">
                <Link to="/performers">
                  <Menu>PERFORMERS</Menu>
                </Link>
                <Link to="/sabhas">
                  <Menu>SABHAS</Menu>
                </Link>
                <Link to="/venues">
                  <Menu>VENUES</Menu>
                </Link>
              </Col>
            </Row>
          </ListingContainer>
        )}
      </InnterContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
  @media screen and (min-width: 480px) {
    flex: 0 0 93.33%;
    max-width: 93.33%;
  }
  @media screen and (min-width: 576px) {
    flex: 0 0 83.33%;
    max-width: 83.33%;
  }
  @media screen and (min-width: 768px) {
    flex: 0 0 66.66%;
    max-width: 66.66%;
  }
  @media screen and (min-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
`;
const InnterContainer = styled.div<{ isFocus: boolean }>`
  position: relative;
  height: auto;
  border-radius: 2rem;
  ${({ isFocus }): string =>
    isFocus
      ? `
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    `
      : ``}
`;

const Menu = styled.h5`
  color: ${({ theme }): string => theme.primary};
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 0;
  padding: 10px 2px;
  &:hover {
    color: ${({ theme }): string => theme.white};
    background-color: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
`;
const CurrentMenu = styled.div<{ isCurrent: boolean }>`
  color: ${({ theme }): string => theme.black};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  line-height: 27px;
  text-overflow: ellipsis;
  &:hover {
    color: ${({ theme }): string => theme.white};
  }
  ${({ isCurrent, theme }): string =>
    isCurrent
      ? `
  color: ${theme.white};
  background-color: #707070;
  cursor: pointer;
  `
      : ``}
`;
const SearchTitle = styled.h4`
  color: #707070;
  font-weight: bold;
  font-size: 14px;
  margin: 0.5rem 0;
`;
const ListingContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  background-color: ${({ theme }): string => theme.white};
  width: 100%;
  padding: 0 2rem;
  border-radius: 0 0 2rem 2rem;
  z-index: 999;
  position: relative;
  border-top: 1px solid #e0e0e0;
  .recent {
    border-right: 1px solid #e0e0e0;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    .recentColItem:hover {
      background-color: #707070;
      color: ${({ theme }): string => theme.white};
      cursor: pointer;
    }
  }
  a:hover {
    text-decoration: none;
  }
  .menus {
    padding: 0.5rem 0 1rem 0.5rem;
  }
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
`;
const SearchInput = styled.input<{ isFocus: boolean }>`
  height: 3rem;
  border-radius: 2rem;
  padding: 0 6rem 0 2rem;
  outline: 0;
  border: 0;
  ${({ isFocus }): string => (isFocus ? `border-radius: 2rem 2rem 0 0;` : ``)}
`;
const SearchIcons = styled.div<{ isSearch: boolean }>`
  position: absolute;
  right: 10px;
  top: 13px;
  width: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }): string => theme.white};
  ${({ isSearch, theme }): string =>
    isSearch
      ? `
        width: 85px;
        background-color: ${theme.white};
        padding: 0 3px;
    `
      : ''}
  & i,
  & span {
    cursor: pointer;
  }
  & .close {
    font-size: 18px;
    color: #707070;
  }
  & .fa {
    color: ${({ theme }): string => theme.secondary};
  }
  & .fa-search {
    color: ${({ theme }): string => theme.white};
    background-color: ${({ theme }): string => theme.primary};
    width: 40px;
    height: 25px;
    border-radius: 20px;
    text-align: center;
    padding-top: 4px;
  }
`;

export default SearchCollectionBox;

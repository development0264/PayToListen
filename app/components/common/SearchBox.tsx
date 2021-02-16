/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import SpeechRecognition from 'react-speech-recognition';
import VoiceToText from './VoiceToText';

interface Props {
  placeholder?: string;
  onChangeText: (value: string, fetching?: boolean) => void;
  currentSearch?: any;
  from: string;
  searchValue: string;
  loadCollection: () => void;
  isSamePage?: boolean;
  containerStyle?: object;
}

const SearchBox: FC<Props> = ({
  placeholder,
  onChangeText,
  currentSearch,
  from,
  searchValue,
  loadCollection,
  containerStyle = {},
}: Props): JSX.Element => {
  const [isFocusing, setFocusing] = useState(false);
  const [cursor, setCursor] = useState<number | any>('');
  const [currentSearchObj, setCurrentSearchObj] = useState<any | null>(null);
  const [showVoiceContent, setVoiceContent] = useState<boolean>(false);
  const [isListening, setListening] = useState<boolean>(false);
  const [isVoiceReg] = useState<boolean>(
    SpeechRecognition.browserSupportsSpeechRecognition()
  );

  useEffect(() => {
    if (currentSearch.length > 0 && cursor !== '' && currentSearch[cursor]) {
      onChangeText(currentSearch[cursor]?.name, false);
      setCurrentSearchObj(currentSearch[cursor]);
    }
  }, [cursor]);

  useEffect(() => {
    if (currentSearch.length > 0) {
      setCursor(0);
      setCurrentSearchObj(currentSearch[0]);
    }
  }, [currentSearch]);

  const updateFocus = (): void => {
    setFocusing(true);
  };
  const history = useHistory();
  const updateBlur = (): void => {
    setTimeout(() => {
      setFocusing(false);
    }, 250);
  };
  const ShowListing = (): void => {
    loadCollection();
  };
  const clearSearch = (): void => {
    const ele: HTMLElement | null = document.getElementById('isearchBox');
    if (ele) {
      ele.focus();
      setTimeout(() => {
        setFocusing(true);
      }, 300);
    }
    onChangeText('');
  };
  const onChange = (e: any): void => {
    const {
      target: { value },
    } = e;
    onChangeText(value);
  };
  const isSearchChar = searchValue?.length > 0;
  const updateSearch = (collection: string, id: string, name: string): void => {
    history.push({
      pathname:
        collection === 'performers' ? `/${name}` : `/${collection}/${name}`,
      state: { from: collection, id, req: 'currentSearch' },
    });
    // if (isSamePage) {
    //   window.location.reload();
    // }
    onChangeText(name);
  };

  const submitSearch = (e: any): void => {
    if (e.keyCode === 13) {
      ShowListing();
      updateBlur();
      if (currentSearchObj !== null) {
        const { id, name } = currentSearchObj;
        updateSearch(from, id, name);
      }

      const ele = document.getElementById('isearchBox');
      if (ele) {
        ele.blur();
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
      (cursor < currentSearch.length - 1 || cursor === '')
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
    onChangeText('');
  };

  return (
    <Container style={containerStyle}>
      <Box>
        <SearchInput
          isFocus={isFocusing}
          type="text"
          id="isearchBox"
          value={searchValue}
          onFocus={updateFocus}
          onBlur={updateBlur}
          onKeyDown={submitSearch}
          placeholder={isListening ? 'Listening...' : placeholder}
          onChange={onChange}
        />
        <SearchIcons isContent={isSearchChar}>
          {isSearchChar && <Close onClick={clearSearch}>X</Close>}
          {isVoiceReg &&
            (!showVoiceContent ? (
              <span onClick={showVoiceToTxt}>
                <i className="fa fa-microphone" />
              </span>
            ) : (
              <VoiceToText
                {...{
                  setSearch: onChangeText,
                  toggleBtn: setVoiceContent,
                  showListing: setFocusing,
                  setListening,
                }}
              />
            ))}
          <i className="fa fa-search" onClick={ShowListing} />
        </SearchIcons>
        {currentSearch && isFocusing && (
          <ListingContainer>
            {currentSearch.length > 0 ? (
              currentSearch.map(
                (current: any, i: number): JSX.Element => {
                  const { id, name } = current;
                  return (
                    <div key={current.id}>
                      <span onClick={() => updateSearch(from, id, name)}>
                        <SearchItem active={cursor === i}>{name}</SearchItem>
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <span>
                <div>No search result</div>
              </span>
            )}
          </ListingContainer>
        )}
      </Box>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  @media (max-width: 768px) {
    width: 100% !important;
    display: flex;
    justify-content: center !important;
    align-items: center;
  }
`;
const Box = styled.div`
  position: relative;
  width: 450px;
`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.white};
  width: 100%;
  border-radius: 0 0 2rem 2rem;
  position: absolute;
  padding: 1rem 2rem;
  border-top: 1px solid gray;
  z-index: 9999;
`;
interface SearchIconProps {
  isContent: boolean;
  theme: any;
}
const SearchIcons = styled.div<SearchIconProps>`
  position: absolute;
  right: 10px;
  top: 13px;
  width: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }): string => theme.white};
  ${({ isContent }): string =>
    isContent &&
    `
  width: 85px;
  background-color: #ffffff;
  padding: 0 3px;
  `}

  i,
  span {
    cursor: pointer;
  }
  .fa {
    color: ${(props): string => props.theme.secondary};
  }
  .fa-search {
    background-color: ${(props): string => props.theme.primary};
    color: ${(props): string => props.theme.white};
    width: 40px;
    height: 25px;
    border-radius: 20px;
    text-align: center;
    padding-top: 4px;
  }
`;
const Close = styled.span`
  font-size: 18px;
  color: #707070;
`;
const SearchInput = styled.input<{ isFocus: boolean }>`
  height: 3rem;
  border-radius: 2rem;
  padding: 0 6rem 0 2rem;
  position: relative;
  width: 100%;
  outline: 0;
  border: 0;
  ${({ isFocus }) =>
    isFocus
      ? `
  border-radius: 2rem 2rem 0 0;
  `
      : ``}
`;
const SearchItem = styled.div<{ active: boolean }>`
  color: ${(props): string => props.theme.black};
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #919191;
    color: ${({ theme }): string => theme.white};
  }
  ${({ active, theme }) =>
    active
      ? `
  background-color: #919191;
  color: ${theme.white};
  `
      : ``}
`;

export default SearchBox;

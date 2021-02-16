/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
import React, { FC, useEffect, useState, useRef } from 'react';
import { Form, ListGroup, Spinner } from 'react-bootstrap';
import ReactStrReplace from 'react-string-replace';
import styled from 'styled-components';

interface Props {
  label: string;
  inputValue: string;
  result: any[];
  field: string;
  onChangeField: (value: string, field: string, fetch?: boolean) => void;
  setSelectedItem?: (item: any) => void;
  selectedSeries?: (item: any) => void;
  selectedVenue?: (item: any) => void;
  isRequired: boolean;
  openNewPerformers?: () => void;
  openNewSeries?: () => void;
  openNewVenues?: () => void;
  showSpinner: boolean;
  setSkill?: (v: string) => void;
  setIsPerformerSelected?: (v: boolean) => void;
  setPerformerSkills?: (skils: any[]) => void;
  listWidth?: number;
}

const DropDownList: FC<Props> = ({
  label,
  inputValue,
  result,
  field,
  onChangeField,
  setSelectedItem,
  isRequired,
  openNewPerformers,
  openNewSeries,
  openNewVenues,
  selectedSeries,
  selectedVenue,
  showSpinner,
  setSkill,
  setIsPerformerSelected,
  setPerformerSkills,
  listWidth,
}: Props): JSX.Element => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [cursor, setCursor] = useState<number | any>('');
  const [showList, setShowList] = useState(false);
  //   console.log('Result is', result);

  const toTitleCase = (str: string): string => {
    return str.replace(
      /.*/g,
      (txt: string): string =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const scrollPos = (): void => {
    const ele: HTMLElement | null = document.getElementById('listItems');
    const listItem: HTMLElement | null = document.querySelector(
      '.active.list-group-item'
    );
    if (ele !== null) {
      ele.scrollTop = 0;
    }
    if (ele !== null && listItem !== null) {
      const top = listItem.offsetTop;
      ele.scrollTop = top - 34 * 2;
    }
    if (setPerformerSkills && cursor !== '') {
      setPerformerSkills(result[cursor]?.skill || []);
    }
    if (setSelectedItem && cursor !== '') {
      const obj = result[cursor];
      setSelectedItem(obj);
      const skill = obj?.skill[0] || '';
      const skillTitle = toTitleCase(skill);
      if (setSkill) setSkill(skillTitle);
      if (setIsPerformerSelected) setIsPerformerSelected(false);
    }
    if (selectedSeries && cursor !== '') {
      selectedSeries(result[cursor]);
    }
    if (selectedVenue && cursor !== '') {
      selectedVenue(result[cursor]);
    }
    if (cursor !== '') {
      onChangeField(result[cursor]?.name, field, false);
    }
  };

  const moveInitialPos = (): void => {
    if (result.length > 0) {
      if (result[0]?.name?.toLowerCase() === inputValue?.toLowerCase()) {
        setCursor(0);
      } else {
        setCursor('');
      }
    }
  };

  useEffect(() => {
    moveInitialPos();
  }, [result]);

  useEffect(() => {
    scrollPos();
  }, [cursor]);

  const handleKeyDown = (e): void => {
    // console.log('enter keu', e.keyCode);
    if (
      e.keyCode === 13 &&
      inputValue &&
      inputValue.length > 0 &&
      result &&
      result.length > 0 &&
      inputElement !== null
    ) {
      setShowList(false);
      inputElement?.current?.blur();
      if (cursor === '') {
        setCursor(0);
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
      (cursor < result.length - 1 || cursor === '')
    ) {
      setCursor((prevCursor) => {
        if (prevCursor === '') {
          return 0;
        }
        return prevCursor + 1;
      });
    }
  };

  const showPList = (): void => {
    setShowList(true);
  };
  const hidePList = (): void => {
    setTimeout(() => {
      setShowList(false);
    }, 200);
  };

  const selectItem = (i: number): void => {
    setCursor(i);
    onChangeField(result[i]?.name, field);
  };

  const createNew = (): void => {
    if (openNewPerformers && (field === 'performers' || field === 'guru')) {
      openNewPerformers();
    }
    if (openNewSeries && field === 'series') {
      openNewSeries();
    }
    if (openNewVenues && field === 'venue') {
      openNewVenues();
    }
  };
  //   const fWidth = field !== 'performer';
  return (
    <Container>
      <Form.Label className="labelSt">
        {label}
        {isRequired && <span className="text-danger"> *</span>}
      </Form.Label>
      <Form.Control
        ref={inputElement}
        className="formInput"
        value={inputValue}
        onFocus={showPList}
        onBlur={hidePList}
        onKeyDown={handleKeyDown}
        onChange={({ target: { value } }): void => onChangeField(value, field)}
      />
      {showSpinner && <Spinner animation="grow" className="inputSpinner" />}

      <ListItems showList={showList} width={listWidth} id="listItems">
        <ListGroup className="inner">
          {inputValue?.length > 3 && result.length > 0
            ? result.map((res, i) => {
                return (
                  <ListGroup.Item
                    key={res.id}
                    className={cursor === i ? 'active' : ''}
                    onClick={(): void => selectItem(i)}
                  >
                    {ReactStrReplace(res.name, inputValue, (match) => (
                      <b>{match}</b>
                    ))}
                  </ListGroup.Item>
                );
              })
            : inputValue?.length > 3 && (
                <ListGroup.Item
                  key={`new-${field}`}
                  className={cursor === 0 ? 'active' : ''}
                >
                  {`${inputValue} `}(
                  <NewButton
                    onClick={createNew}
                    onKeyDown={createNew}
                    tabIndex={0}
                    role="button"
                  >
                    Create New
                  </NewButton>
                  )
                </ListGroup.Item>
              )}
        </ListGroup>
      </ListItems>
    </Container>
  );
};

const Container = styled.div`
  flex: 1 1;
  .labelSt {
    margin: 0;
    font-size: 14px;
  }
  .inputSpinner {
    position: absolute;
    right: 0.5rem;
    top: 1.7rem;
  }
`;

const ListItems = styled.div<{
  showList: boolean;
  width: number;
}>`
  position: absolute;
  max-height: 150px;
  overflow: auto;
  box-shadow: 1px 0 5px #999;
  border-radius: 5px;
  background-color: #f1f1f1;
  z-index: 9999;
  ${({ showList }): string =>
    showList === true ? `display: block` : `display: none`};
  ${({ width }): string =>
    width !== undefined ? `width: ${width}%` : 'width: 87%'};
  .inner {
    height: 100%;
    .list-group-item {
      cursor: pointer;
    }
    .active.list-group-item {
      background-color: #a8b2b9;
      border-color: #a8b2b9;
      color: #3c3c3c;
    }
  }
`;

const NewButton = styled.span`
  color: ${({ theme }): string => theme.secondary};
  font-size: 14px;
  cursor: pointer;
`;

export default DropDownList;

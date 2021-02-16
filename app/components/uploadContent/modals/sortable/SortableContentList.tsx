/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import styled from 'styled-components';
import {
  Form,
  Button,
  Accordion,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { FileList, MetaData } from '../../../../../model/contentModel';
import PlayIcon from '../../../../../assets/images/playIcon.png';

interface Props {
  value: FileList;
  index: number;
  indexValue: number;
  files: FileList[];
  activeFileIndex: number;
  article: any;
  toggleCurrentMeta: (index: number) => void;
  defaultValues: any[];
  defaultAccs: any[];
  handleChange: (
    performers: any,
    i: number,
    type: 'Main' | 'Accompanist'
  ) => void;
  promiseOptions: (
    input: string,
    index: number,
    type: 'Main' | 'Accompanist'
  ) => Promise<any[]>;
  currentMetaIndex: number;
  updateMetaIndex: (value: number) => void;
  clearMeta: (index: number) => void;
  getMetaValue: (index: number) => { label: string; value: string } | null;
  watchEnter: (event: any) => void;
  onFocusOut: (v: any) => void;
  handleMetaChange: (value: { value: string; label: string }) => void;
  fetchMetas: (input: string, key: string) => Promise<any>;
  currentEntry: string;
  setEntryValue: () => void;
  updateMetaData: (index: number, event: any) => void;
  currentClass: (i: number) => 'activeBlock' | 'visitedBlock' | 'progressBlock';
}

const SortableItem = SortableElement((props: Props) => {
  const {
    value: file,
    indexValue: i,
    files,
    activeFileIndex,
    article,
    toggleCurrentMeta,
    defaultValues,
    defaultAccs,
    handleChange,
    promiseOptions,
    currentMetaIndex,
    updateMetaIndex,
    clearMeta,
    getMetaValue,
    watchEnter,
    onFocusOut,
    handleMetaChange,
    fetchMetas,
    currentEntry,
    setEntryValue,
    updateMetaData,
    currentClass,
  } = props;
  return (
    <MetaBox isActive={activeFileIndex === i}>
      <MetaFileRow>
        <ContentRow>
          <div>
            <PlayImage src={PlayIcon} alt="playIcon" />
          </div>
          <FileContainer>
            <FileName>{file?.name || ''}</FileName>
            <Author>{article?.result?.name}</Author>
          </FileContainer>
        </ContentRow>
        <ButtonContent isActive={activeFileIndex === i}>
          <Accordion.Toggle
            as={Button}
            variant="button"
            onClick={(): void => toggleCurrentMeta(i)}
            eventKey={i?.toString()}
          >
            {activeFileIndex === i ? 'Save' : 'Edit'}
            &nbsp;Meta
          </Accordion.Toggle>
        </ButtonContent>
      </MetaFileRow>
      <Accordion.Collapse eventKey={i?.toString()}>
        <MetaInputContainer>
          {/* <ArtistContainer>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              placeholder="Select Main Performer"
              value={defaultValues[i]}
              onChange={(values: any): void => handleChange(values, i, 'Main')}
              loadOptions={(input: string): Promise<any[]> =>
                promiseOptions(input, i, 'Main')
              }
            />
            <AsyncSelect
              isMulti
              // cacheOptions
              defaultOptions
              placeholder="Select Accompanists"
              value={defaultAccs[i]}
              onChange={(values: any): void =>
                handleChange(values, i, 'Accompanist')
              }
              loadOptions={(input: string): Promise<any[]> =>
                promiseOptions(input, i, 'Accompanist')
              }
            />
          </ArtistContainer> */}
          <InputContainer>
            {files &&
              activeFileIndex !== null &&
              files[activeFileIndex].metaDatas.map(
                (metaData: MetaData, index: number) => {
                  return (
                    <React.Fragment key={metaData.id}>
                      {(metaData?.value?.length > 0 ||
                        typeof metaData?.value === 'number') &&
                      index !== currentMetaIndex ? (
                        <OverlayTrigger
                          key={metaData.id.toString()}
                          placement="top"
                          overlay={
                            // eslint-disable-next-line react/jsx-wrap-multilines
                            <Tooltip id={metaData.name}>
                              <strong>{metaData.name}</strong>
                            </Tooltip>
                          }
                        >
                          <MetaDataValue>
                            <MetaTxt
                              className="metaValueTxt"
                              onClick={(): void => updateMetaIndex(index)}
                              onKeyPress={(): void => updateMetaIndex(index)}
                              role="button"
                              tabIndex={0}
                            >
                              {metaData?.value}
                            </MetaTxt>
                            <i
                              className="fa fa-times"
                              onClick={(): void => clearMeta(index)}
                              onKeyPress={(): void => clearMeta(index)}
                            />
                          </MetaDataValue>
                        </OverlayTrigger>
                      ) : (
                        index === currentMetaIndex &&
                        activeFileIndex === i &&
                        (_.includes(
                          [
                            'raga',
                            'tala',
                            'composer',
                            'songType',
                            'contentType',
                          ],
                          metaData.key
                        ) ? (
                          <MetaDropdown>
                            <AsyncSelect
                              autoFocus
                              cacheOptions
                              defaultOptions
                              placeholder={metaData.name}
                              value={getMetaValue(i)}
                              onKeyDown={watchEnter}
                              onBlur={onFocusOut}
                              onChange={(values: any): void =>
                                handleMetaChange(values)
                              }
                              loadOptions={(input: string): Promise<any[]> =>
                                fetchMetas(input, metaData.key)
                              }
                            />
                          </MetaDropdown>
                        ) : (
                          <MetaDataInput>
                            <Form.Control
                              className="metaInput"
                              id={`metaInput-${activeFileIndex}-${index}`}
                              placeholder={metaData.name}
                              value={currentEntry}
                              onFocus={setEntryValue}
                              onKeyDown={watchEnter}
                              onBlur={onFocusOut}
                              onChange={(e: any): void =>
                                updateMetaData(index, e)
                              }
                            />
                          </MetaDataInput>
                        ))
                      )}
                    </React.Fragment>
                  );
                }
              )}
          </InputContainer>
          <ProgressBox>
            <ProgressContainer>
              {files &&
                activeFileIndex !== null &&
                files[activeFileIndex].metaDatas.map(
                  (metaData: MetaData, index: number): JSX.Element => {
                    return (
                      <OverlayTrigger
                        key={metaData.id.toString()}
                        placement="top"
                        overlay={
                          // eslint-disable-next-line react/jsx-wrap-multilines
                          <Tooltip id={metaData.name}>
                            <strong>{metaData.name}</strong>
                          </Tooltip>
                        }
                      >
                        <ProgressBlock
                          key={metaData.id}
                          blockState={currentClass(index)}
                          onClick={(): void => updateMetaIndex(index)}
                          onKeyPress={(): void => updateMetaIndex(index)}
                          role="button"
                          tabIndex={0}
                        />
                      </OverlayTrigger>
                    );
                  }
                )}
            </ProgressContainer>
          </ProgressBox>
        </MetaInputContainer>
      </Accordion.Collapse>
    </MetaBox>
  );
});

const SortableContentList = SortableContainer(
  ({ files, ...otherProps }: Props) => {
    return (
      <ul style={{ marginLeft: -40 }}>
        {files.map((value, index) => {
          const key = `item-${value?.id || index}`;
          return (
            <SortableItem
              key={key}
              {...{
                index,
                value,
                files,
                indexValue: index,
                ...otherProps,
              }}
            />
          );
        })}
      </ul>
    );
  }
);

const MetaDropdown = styled.div`
  width: 200px;
  height: 35px;
`;
const MetaBox = styled.div<{ isActive: boolean }>`
  border-radius: ${({ isActive }): string => (isActive ? '15px' : '5px')};
  z-index: 99999;
  margin: 0.5rem 0;
  border: 1px solid
    ${({ isActive, theme }): string => (isActive ? theme.primary : 'gray')};
  border-left-width: 5px;
  border-radius: 15px;
  padding: 1rem;
`;
const MetaFileRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  padding: 0.5rem;
`;
const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  width: 80%;
`;
const PlayImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const FileContainer = styled.div`
  width: 50%;
  margin-left: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`;
const FileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  line-height: 27px;
  text-overflow: ellipsis;
`;
const Author = styled.span`
  font-size: 12px;
  color: #999999;
`;
const ButtonContent = styled.div<{ isActive: boolean }>`
  width: 20%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .btn {
    font-size: 14px;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    color: ${({ theme }): string => theme.white};
    border-radius: 3px;
    text-transform: uppercase;
    background-color: ${({ isActive, theme }): string =>
      isActive ? theme.green : theme.black};
  }
`;
const MetaInputContainer = styled.div`
  background-color: #f1f1f1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 200px;
  padding: 5px;
`;
const MetaDataValue = styled.div`
  background-color: ${({ theme }): string => theme.primary};
  border-radius: 20px;
  height: 30px;
  padding: 0 0.5rem;
  margin: 0.2rem 0.5rem;
  color: ${({ theme }): string => theme.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .fa {
    margin: 5px;
  }
`;
const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;
  justiify-content: space-between;
  flex: 1 1 20%;
  & > div {
    margin: 0.5rem 0;
  }
`;
const InputContainer = styled.div`
  padding: 0.5rem 0;
  flex: 1 1 80%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const MetaDataInput = styled.div`
  height: 30px;
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .metaInput {
    border: none;
    padding: 0 5px;
    background-color: ${({ theme }): string => theme.white};
    height: 25px;
    margin: 0.2rem 0.5rem;
  }
`;
const ProgressBox = styled.div`
  height: 5%;
  display: flex;
`;
const ProgressContainer = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: stretch;
`;
const ProgressBlock = styled.span<{
  blockState: 'activeBlock' | 'visitedBlock' | 'progressBlock';
}>`
  flex: 1;
  background-color: ${({ theme, blockState }): string =>
    blockState === 'activeBlock'
      ? theme.primary
      : blockState === 'visitedBlock'
      ? theme.green
      : theme.lightGray1};
  border: 0.5px solid
    ${({ theme, blockState }): string =>
      blockState === 'activeBlock' ? theme.green : theme.white};
  cursor: pointer;
`;
const MetaTxt = styled.span`
  margin: 0 0.5rem;
`;

export default SortableContentList;

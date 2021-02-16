/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-curly-newline */
import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import {
  UpdateMetaProps,
  PerformerFileProp,
  PerformerKeyProp,
  FileList,
} from '../../../../model/contentModel';
import { SearchCollection, searchMetas } from '../../../../utils/Search';
import { PerformerDetail } from '../../../../model/SearchModel';
import SortableContent from './sortable/SortableContent';

const UpdateMetadataPanel: FC<UpdateMetaProps> = ({
  files,
  currentMetaIndex,
  setMetaIndex,
  activeFileIndex,
  setActiveFileIndex,
  updateFileList,
  saveContent,
  article,
  setSelectedPerformers,
  selectedPerformers,
  mainPerformers,
  setMainPerformers,
  uploadedData,
}: UpdateMetaProps) => {
  const style = {
    createBtn: {
      background: '#3B43F2',
      borderRadius: '5px',
    },
  };
  const authState = useSelector((state: { auth: any }) => state.auth);
  const { authToken } = authState;
  const [currentEntry, setEntry] = useState<string>('');
  const [defaultValues, setDefaultValues] = useState<any[]>([]);
  const [defaultAccs, setDefaultAccs] = useState<any[]>([]);
  const [updatedFiles, setUpdatedFiles] = useState<any[]>(
    _.chain(files).filter('id').sortBy('sortIndex').value()
  );

  useEffect(() => {
    if (uploadedData.length > 0) {
      const withoutIdIndex = files?.findIndex((file) => file?.id === undefined);
      let newFiles = files;
      if (withoutIdIndex !== -1) {
        const firstPart = files.slice(0, withoutIdIndex);
        const secondPart = files.slice(withoutIdIndex).map((file, i) => {
          return {
            ...file,
            id: uploadedData[i]?.contentId || '',
          };
        });
        newFiles = _.concat(firstPart, secondPart);
      }
      const sortedFiles = _.chain(newFiles)
        .filter('id')
        .sortBy('sortIndex')
        .value();
      //    _.sortBy(_.filter(newFiles, 'id'), 'sortIndex');
      setUpdatedFiles([...sortedFiles]);
      updateFileList([...sortedFiles]);
    }
  }, [uploadedData]);

  const performersKeyCollection = (
    performers: any,
    index: number
  ): string[] => {
    const selectedUsers: PerformerKeyProp[] = _.get(performers, index);
    return _.flatten(_.map(selectedUsers, (obj) => _.keys(obj)));
  };

  const promiseOptions = async (
    input: string,
    index: number,
    type: 'Main' | 'Accompanist'
  ): Promise<any[]> => {
    const resp = await SearchCollection({
      collection: 'performers',
      key: input,
      page: 1,
      pageSize: 20,
      view: true,
      order: 'asc',
      authToken,
    });
    const { status, response } = resp;
    if (status === 200) {
      const result = (response.result as PerformerDetail[])
        .filter(({ id }) => {
          return !_.includes(
            performersKeyCollection(
              type === 'Main' ? selectedPerformers : mainPerformers,
              index
            ),
            id
          );
        })
        .map((performer) => ({
          value: performer.name,
          label: performer.name,
          performer,
        }));
      return result;
    }
    return [];
  };

  const handleChange = (
    performers: any,
    i: number,
    type: 'Main' | 'Accompanist'
  ): void => {
    if (performers !== null) {
      const restrictedKeys = performersKeyCollection(
        type === 'Main' ? selectedPerformers : mainPerformers,
        i
      ); // Getting opponent keys for restriction
      let formatedPerformers: any[] = [];
      formatedPerformers = _.compact(
        _.map(performers, ({ performer }) => {
          const { id, name } = performer; // adding id, name and type only for performer collection
          if (!_.includes(restrictedKeys, id)) {
            return {
              [id]: { id, name, type },
            };
          }
          return undefined;
        })
      );
      if (type === 'Accompanist') {
        setSelectedPerformers((artists) => ({
          ...artists,
          [activeFileIndex]: formatedPerformers,
        }));
      } else {
        setMainPerformers((artists) => ({
          ...artists,
          [activeFileIndex]: formatedPerformers,
        }));
      }
    }
  };
  const filterContent = (options: string[], inputValue: string): string[] => {
    return options.filter((i) =>
      i.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const fetchMetas = async (input: string, key: string): Promise<any> => {
    enum Type {
      composer = 1,
      raga,
      tala,
      songType,
    }
    if (key === 'contentType') {
      const options = [
        'Carnatic Vocal',
        'Carnatic Instrumental',
        'Devotional',
        'Namasankeerathanam',
      ];
      const filteredValues = filterContent(options, input);
      return _.map(filteredValues, (o) => ({
        value: o,
        label: o,
      }));
    }
    if (key !== 'contentType') {
      const resp = await searchMetas({
        authToken,
        key: input,
        type: Type[key],
        page: 1,
        pageSize: 20,
      });
      const { status, response } = resp;
      const keyTypes = ['composer', 'ragam', 'tala', 'type'];
      if (status === 200) {
        return _.chain(response.result)
          .map(keyTypes[Type[key] - 1])
          .uniq()
          .map((a: string) => ({ value: a, label: a }))
          .value();
      }
      return [];
    }
    return [];
  };

  const getMetaValue = (
    index: number
  ): { label: string; value: string } | null => {
    const metaValue = updatedFiles[index]?.metaDatas[currentMetaIndex].value;
    if (metaValue?.length > 0) return { label: metaValue, value: metaValue };
    return null;
  };

  const toggleCurrentMeta = (index: number): void => {
    if (activeFileIndex === index) {
      setActiveFileIndex(null);
    } else {
      setActiveFileIndex(index);
    }
    if (updatedFiles && index !== null) {
      const metaDataCollection = updatedFiles[index]?.metaDatas;
      const ind = metaDataCollection?.findIndex((mCol) => mCol.value === '');
      if (ind !== -1) setMetaIndex(ind);
    }
  };

  const getList = (collectionValues: PerformerFileProp): any[] => {
    const mainArtists = Object.values(collectionValues);
    // console.log('Main artist...', mainArtists);
    return mainArtists.map((artist: any[]) => {
      return artist.map((art) => {
        const obj1: any = Object.values(art)[0];
        return { label: obj1.name, value: obj1.name, performer: obj1 };
      });
    });
  };

  const updateDefaultValues = (): void => {
    if (mainPerformers !== undefined) {
      const extractMainArtist = getList(mainPerformers);
      setDefaultValues(extractMainArtist);
    }
    if (selectedPerformers !== undefined) {
      const extractMainArtist = getList(selectedPerformers);
      setDefaultAccs(extractMainArtist);
    }
  };

  useEffect(() => {
    updateDefaultValues();
  }, [mainPerformers, selectedPerformers]);

  useEffect(() => {
    const element = document.getElementById(
      `metaInput-${activeFileIndex}-${currentMetaIndex}`
    );
    if (element) {
      element.focus();
    }
  }, [currentMetaIndex]);

  useEffect(() => {
    const element = document.getElementById(
      `metaInput-${activeFileIndex}-${currentMetaIndex}`
    );
    if (element) {
      setTimeout(() => {
        element.focus();
      }, 200);
    }
  }, [activeFileIndex]);

  const currentClass = (
    i: number
  ): 'activeBlock' | 'visitedBlock' | 'progressBlock' => {
    if (i === currentMetaIndex) {
      return 'activeBlock';
    }
    const metaValue = updatedFiles[activeFileIndex].metaDatas[i].value;
    if (
      updatedFiles &&
      activeFileIndex !== null &&
      (metaValue?.length > 0 || typeof metaValue === 'number')
    ) {
      return 'visitedBlock';
    }
    return 'progressBlock';
  };

  const updateMetaIndex = (index: number): void => {
    setMetaIndex(index);
  };

  const updateMetaValue = (
    value: string,
    metaIndex: number,
    clear = true
  ): void => {
    const currentFile = updatedFiles[activeFileIndex];
    const parseValue = JSON.stringify(currentFile?.metaDatas);
    const metaDataCollection = JSON.parse(parseValue);
    const currentFileMeta = metaDataCollection[metaIndex];
    currentFileMeta.value = value;
    if (metaIndex === 0) {
      currentFile.name = value;
    }
    updatedFiles.splice(activeFileIndex, 1, {
      ...currentFile,
      metaDatas: metaDataCollection,
    });
    const newFile = [...updatedFiles];
    updateFileList(newFile);
    setUpdatedFiles(newFile);
    if (clear) setEntry('');
  };

  const handleMetaChange = (value: { value: string; label: string }): void => {
    updateMetaValue(value.value, currentMetaIndex);
  };

  const clearMeta = (index: number): void => {
    setMetaIndex(index);
    updateMetaValue('', index);
  };

  const moveNext = (isNext: boolean): void => {
    if (isNext) {
      setMetaIndex(currentMetaIndex + 1);
    } else {
      setMetaIndex(0);
    }
  };

  const updateAndMoveNext = (value: string, goNext = true): void => {
    const currentFile = updatedFiles[activeFileIndex];
    const currentValue = currentFile?.metaDatas[currentMetaIndex].value;
    const totalmetaLength = currentFile?.metaDatas?.length;
    const valueFeed = value.length === 0 ? currentValue : value;
    updateMetaValue(valueFeed, currentMetaIndex, goNext);
    const isNext = currentMetaIndex < totalmetaLength - 1;
    if (goNext) {
      moveNext(isNext);
    }
  };

  const watchEnter = (event: any): void => {
    if (updatedFiles && activeFileIndex !== null && event.keyCode === 13) {
      updateAndMoveNext(event.target.value);
    }
  };

  const onFocusOut = (e: any): void => {
    updateAndMoveNext(e.target.value, false);
  };

  const setEntryValue = (): void => {
    const currentFileMeta =
      updatedFiles &&
      activeFileIndex !== null &&
      updatedFiles[activeFileIndex].metaDatas[currentMetaIndex];
    if (currentFileMeta) {
      setEntry(currentFileMeta.value);
    }
  };

  const updateMetaData = (index: number, event: any): void => {
    const {
      target: { value },
    } = event;
    setEntry(value);
  };

  const updateSorting = (fileList: FileList[]): void => {
    const filesL = [...fileList];
    setUpdatedFiles(filesL);
    updateFileList(filesL);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-center w-100"
        >
          <h3>Update Meta Data</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pendingBody cal-create-event-by">
        <Row className="fieldRow">
          <Col className="display-flex flex-direction-column">
            <Accordion defaultActiveKey={activeFileIndex?.toString()}>
              <SortableContent
                {...{
                  files: updatedFiles,
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
                  updateSorting,
                }}
              />
            </Accordion>
          </Col>
        </Row>
        <Form>
          <Form.Group className="text-center">
            <Button
              style={style.createBtn}
              variant="primary"
              onClick={saveContent}
            >
              Save
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default UpdateMetadataPanel;

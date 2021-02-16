/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useCallback, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import CreatePanel from './CreatePanel';
import UpdateMetadataPanel from './UpdateMetaDataPanel';
import {
  CreateAlbumModalProps,
  FileList,
  PerformerFileProp,
  PerformerProp,
  PerformerKeyProp,
  SaveMetaContentProps,
  PerformerData,
  SelectedPerformer,
} from '../../../../model/contentModel';
import { initialMetaData } from '../../../../redux/Constants';
import { actions as contentActions } from '../../../../redux/reducers/ContentReducer';
import {
  uploadToCloud,
  toTitleCase,
  toCapCase,
  chooseDummyImage,
} from '../../common/common';

const NewAlbumModal: FC<CreateAlbumModalProps> = ({
  visible,
  toggleVisible,
  article,
  currentCollection,
  uploadedData,
  albumId,
  album,
  contents,
  isEdit,
}: CreateAlbumModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const dummyImage: string = chooseDummyImage(currentCollection);
  const [showMetaPanel, setMetaPanel] = useState<boolean>(false);
  const [albumImage, setAlbumImage] = useState<string>(
    article?.result?.image || dummyImage
  );
  const [fileList, updateFileList] = useState<FileList[]>([]);
  const [albumName, setAlbumName] = useState<string>('');
  const [recordingType, setRecordingType] = useState<string>('');
  const [yearOfRecording, setYearOfRecording] = useState<string>('');
  const [filesCount, setFilesCount] = useState<number>(0);
  const [isValidName, setValidName] = useState<boolean>(true);
  const [isValidFiles, setValidFiles] = useState<boolean>(true);
  const [currentMetaIndex, setMetaIndex] = useState<number>(0);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [mainPerformers, setMainPerformers] = useState<PerformerFileProp>();
  const [selectedPerformers, setSelectedPerformers] = useState<
    PerformerFileProp
  >();
  const [albumSpinner, setAlbumSpinner] = useState<boolean>(false);
  const [albumSubmitted, setAlbumSubmitted] = useState<boolean>(false);
  const initialState: PerformerData = {
    performers: '',
    performerType: '',
  };

  const [currentSelectedPerformers, setCurrentSelectedPerformers] = useState<
    SelectedPerformer[]
  >([]);
  const [currentPerformerData, setCurrentPerformerData] = useState<
    PerformerData
  >(initialState);

  const updateFields = (): void => {
    const { performers } = album;
    const performerArray = Object.values(performers).reduce((acc, cur) => {
      acc.push({ id: cur.id, performer: cur, type: cur.type, skill: '' });
      return acc;
    }, []);
    const fileUpdatedList = contents.map((content, index) => {
      const { id, title: name, type, metadata, fileUrl: file } = content;
      const duration = content?.duration || 0;
      const extractedMetas = Object.entries(metadata)
        .filter(([key, value]) => !key.match(/artist|accompanist/))
        .map(([k, v], i) => {
          return {
            id: i + 1,
            name: toCapCase(k),
            key: k,
            value: v as string,
          };
        });
      const metaStructureString = JSON.stringify(initialMetaData);
      const metaStructure = JSON.parse(metaStructureString);
      const finalMeta = metaStructure.map((meta) => {
        const obj = extractedMetas.find((metaObj) => metaObj.key === meta.key);
        if (obj) {
          return { ...meta, value: obj.value };
        }
        return meta;
      });
      const sortIndex =
        content?.sortIndex !== undefined ? content.sortIndex : index;
      return {
        id,
        name,
        duration,
        sortIndex,
        metaDatas: finalMeta,
        fileData: new File([], name, { type: `${type}/*` }),
      };
    });
    updateFileList(fileUpdatedList);
    setCurrentSelectedPerformers(performerArray);
  };

  useEffect(() => {
    if (isEdit) {
      setAlbumName(album.title);
      setYearOfRecording(album.yearOfRecording || null);
      setRecordingType(album.recordingType || '');
      setAlbumImage(album.image);
      updateFields();
    }
  }, [album, contents]);
  useEffect(() => {
    if (albumSubmitted) {
      setMetaPanel(true);
    } else {
      setMetaPanel(false);
    }
  }, [albumSubmitted]);

  useEffect(() => {
    if (fileList.length > 0) {
      setFilesCount(fileList.length);
    }
  }, [fileList]);

  const updateNameStatus = useCallback(() => {
    if (albumName.length > 0) {
      setValidName(true);
    } else {
      setValidName(false);
    }
  }, [albumName]);

  const closeModal = (): void => {
    toggleVisible(false);
    setValidFiles(true);
    setValidName(true);
    setMainPerformers(undefined);
    setSelectedPerformers(undefined);
    setCurrentSelectedPerformers([]);
    setMetaPanel(false);
    setAlbumSubmitted(false);
    setAlbumImage(article?.result?.image || dummyImage);
    updateFileList([]);
    setFilesCount(0);
    setMetaIndex(0);
    setActiveFileIndex(null);
    setAlbumName('');
    setRecordingType('');
    setYearOfRecording('');
  };

  const getCurrentPerformers = (
    main: any,
    accompanist: any
  ): { [key: string]: SelectedPerformer }[] => {
    const mP = JSON.stringify(main);
    const aP = JSON.stringify(accompanist);
    const smp: {
      [key: number]: { [key: string]: SelectedPerformer }[];
    } = JSON.parse(mP);
    const sap: {
      [key: number]: { [key: string]: SelectedPerformer }[];
    } = JSON.parse(aP);
    const currentPerformers: { [key: string]: SelectedPerformer }[] = [];
    for (const [key, value] of Object.entries(smp)) {
      const newValue = [...value];
      newValue.push(...sap[key]);
      const reduced = newValue.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});
      currentPerformers.push(reduced);
    }
    return currentPerformers;
  };

  const getMainandAccompanist = (
    performersColl: PerformerKeyProp[]
  ): { mainArtists: PerformerKeyProp[]; accompanists: PerformerKeyProp[] } => {
    const mainArtists: PerformerKeyProp[] = performersColl.filter(
      (artist) => (Object.values(artist)[0] as PerformerProp).type === 'Main'
    );
    const accompanists: PerformerKeyProp[] = performersColl.filter(
      (artist) =>
        (Object.values(artist)[0] as PerformerProp).type === 'Accompanist'
    );
    return { mainArtists, accompanists };
  };

  const updateMainandAcc = (
    index: number,
    mainArtists: PerformerKeyProp[],
    accompanists: PerformerKeyProp[]
  ): void => {
    const mainArtist = {
      [index]: mainArtists,
    };
    const accArtist = {
      [index]: accompanists,
    };
    setMainPerformers((performer) => ({
      ...performer,
      ...mainArtist,
    }));
    setSelectedPerformers((acc) => ({
      ...acc,
      ...accArtist,
    }));
  };

  const gettingCurrentSelectedArtistandAcc = (): {
    mainArtists: PerformerKeyProp[];
    accompanists: PerformerKeyProp[];
  } => {
    const performersDataArray: PerformerKeyProp[] = currentSelectedPerformers.reduce(
      (acc, cur) => {
        const { id, name } = cur.performer;
        acc.push({
          [id]: { id, name, type: cur.type },
        });
        return acc;
      },
      []
    );
    return getMainandAccompanist(performersDataArray);
  };

  const onCreate = (): void => {
    const validName = albumName.length > 0;
    const validFiles = filesCount > 0;
    const finalPerformers: PerformerKeyProp = {};
    if (validName) {
      setValidName(true);
    } else {
      setValidName(false);
    }
    if (validFiles) {
      setValidFiles(true);
    } else {
      setValidFiles(false);
    }
    if (validName && validFiles) {
      setAlbumSubmitted(true);
      if (!isEdit || contents.length === 0) {
        const {
          mainArtists,
          accompanists,
        } = gettingCurrentSelectedArtistandAcc();
        fileList.forEach((file, index) => {
          updateMainandAcc(index, mainArtists, accompanists);
        });
        const artistArray = [...mainArtists];
        artistArray.push(...accompanists);
        const finalData = artistArray.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
        Object.assign(finalPerformers, finalData);
      } else {
        // this iteration updating all performer from content

        contents.forEach((content, index) => {
          const performerArray: PerformerKeyProp[] = Object.values(
            content.performers
          ).reduce((acc: any[], cur) => {
            acc.push({ [(cur as any).id]: cur });
            return acc;
          }, []);
          const { mainArtists, accompanists } = getMainandAccompanist(
            performerArray
          );
          updateMainandAcc(index, mainArtists, accompanists);
        });
        // filtering newly added music file
        const newFileIndexes: number[] = fileList
          .map((currentFile, i) => {
            return currentFile.id === undefined ? i : undefined;
          })
          .filter((indexColl) => indexColl !== undefined);
        if (newFileIndexes.length > 0) {
          const {
            mainArtists,
            accompanists,
          } = gettingCurrentSelectedArtistandAcc();
          newFileIndexes.forEach((location) => {
            updateMainandAcc(location, mainArtists, accompanists);
          });
        }

        const performersDataArray = currentSelectedPerformers.reduce(
          (acc, cur) => {
            const { id, name } = cur.performer;
            acc.push({
              [id]: { id, name, type: cur.type },
            });
            return acc;
          },
          []
        );
        const { mainArtists, accompanists } = getMainandAccompanist(
          performersDataArray
        );
        const artistArray = [...mainArtists];
        artistArray.push(...accompanists);
        const finalData = artistArray.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
        Object.assign(finalPerformers, finalData);
      }
      const timeStamp = new Date().valueOf();
      if (isEdit) {
        const newFiles = fileList.filter((currentFile) => {
          return currentFile.id === undefined;
        });
        if (newFiles.length > 0) {
          dispatch(contentActions.uploadMediaFileToServer(newFiles));
        }

        dispatch(
          contentActions.updateAlbum({
            id: albumId,
            title: albumName,
            image: albumImage,
            description: '',
            performers: finalPerformers,
            isPublished: false,
            premium: false,
            publishedDate: timeStamp,
            yearOfRecording,
            recordingType,
          })
        );
      } else {
        const creatorId = article?.result?.id || '';
        const creatorType = toTitleCase(currentCollection).slice(0, -1);
        dispatch(contentActions.uploadMediaFileToServer(fileList));
        dispatch(
          contentActions.addNewAlbum({
            title: albumName,
            image: albumImage,
            description: '',
            createdDate: timeStamp,
            creator: {
              id: creatorId,
              type: creatorType as 'Performer' | 'Sabha' | 'Venue',
            },
            performers: finalPerformers,
            isPublished: false,
            premium: false,
            publishedDate: timeStamp,
            yearOfRecording,
            recordingType,
          })
        );
      }
    }
  };

  const updateAlbumImage = (image: string): void => {
    uploadToCloud(image, 'Album', ({ secureUrl }) => {
      setAlbumSpinner(false);
      setAlbumImage(secureUrl);
    });
  };

  const saveContent = (): void => {
    const currentPerformers = getCurrentPerformers(
      mainPerformers,
      selectedPerformers
    );
    const creatorId = article?.result?.id || '';
    const creatorType = toTitleCase(currentCollection).slice(0, -1);
    const params: SaveMetaContentProps = {
      fileList,
      uploadedData,
      albumId,
      albumName,
      image: albumImage,
      performers: currentPerformers,
      creator: {
        id: creatorId,
        type: creatorType as 'Performer' | 'Sabha' | 'Venue',
      },
    };
    console.log('Params../', params);
    dispatch(contentActions.addNewContent(params));
    closeModal();
  };

  return (
    <Modal
      show={visible}
      onHide={closeModal}
      backdrop="static"
      dialogClassName={showMetaPanel ? 'metaModal-50ws' : ''}
      aria-labelledby="contained-modal-title-vcenter"
    >
      {!showMetaPanel ? (
        <CreatePanel
          {...{
            isEdit,
            onCreate,
            albumImage,
            updateAlbumImage,
            updateFileList,
            setFilesCount,
            filesCount,
            albumName,
            setAlbumName,
            recordingType,
            setRecordingType,
            yearOfRecording,
            setYearOfRecording,
            isValidName,
            isValidFiles,
            updateNameStatus,
            article,
            currentPerformerData,
            setCurrentPerformerData,
            albumSpinner,
            setAlbumSpinner,
            dummyImage,
            uploadedData, // only for removing purpose
            files: fileList,
            metaDatas: JSON.stringify(initialMetaData),
            selectedPerformers: currentSelectedPerformers,
            setSelectedPerformers: setCurrentSelectedPerformers,
          }}
        />
      ) : (
        <UpdateMetadataPanel
          {...{
            isEdit,
            currentMetaIndex,
            setMetaIndex,
            activeFileIndex,
            setActiveFileIndex,
            updateFileList,
            saveContent,
            article,
            setSelectedPerformers,
            mainPerformers,
            setMainPerformers,
            selectedPerformers,
            files: fileList,
            uploadedData,
          }}
        />
      )}
    </Modal>
  );
};

export default NewAlbumModal;

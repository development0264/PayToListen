/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { Spinner, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import PlayIcon from '../../../../assets/images/playIcon.png';
import {
  MetaData,
  FileList,
  PerformerData,
  UploadedDataProps,
} from '../../../../model/contentModel';
import PerformerSelection from '../../common/PerformerSelection';
import { removeContent } from '../../../../utils/services';

interface CreateProps {
  files: FileList[];
  albumImage: string;
  filesCount: number;
  metaDatas: string;
  albumName: string;
  isValidName: boolean;
  isValidFiles: boolean;
  updateNameStatus: any;
  article: any;
  currentPerformerData: PerformerData;
  selectedPerformers: any[];
  setSelectedPerformers: any;
  albumSpinner: boolean;
  isEdit?: boolean;
  dummyImage?: string;
  uploadedData: UploadedDataProps[];
  recordingType: string;
  yearOfRecording: string;
  setRecordingType: (value: any) => void;
  setYearOfRecording: (value: any) => void;
  setAlbumName: (v: string) => void;
  setCurrentPerformerData: (value: PerformerData) => void;
  onCreate: () => void;
  updateAlbumImage: (image: string) => void;
  updateFileList: (values: any) => void;
  setFilesCount: (value: number) => void;
  setAlbumSpinner: (value: boolean) => void;
}

const CreatePanel: FC<CreateProps> = ({
  onCreate,
  files: receivedFiles,
  albumImage,
  updateAlbumImage,
  updateFileList,
  filesCount,
  metaDatas,
  albumName,
  setAlbumName,
  isValidFiles,
  isValidName,
  updateNameStatus,
  article,
  currentPerformerData,
  setCurrentPerformerData,
  selectedPerformers,
  setSelectedPerformers,
  albumSpinner,
  setAlbumSpinner,
  isEdit,
  dummyImage,
  uploadedData,
  recordingType,
  setRecordingType,
  yearOfRecording,
  setYearOfRecording,
  setFilesCount,
}: CreateProps): JSX.Element => {
  const imageUploader = useRef<HTMLInputElement>(null);
  const audioUploader = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState(_.sortBy(receivedFiles, 'sortIndex'));

  useEffect(() => {
    if (receivedFiles?.length > 0) {
      const sortedFiles = _.sortBy(receivedFiles, 'sortIndex');
      setFiles(sortedFiles);
    }
  }, [receivedFiles]);

  const updateMetaKeyValue = (key: string, value: any): void => {
    if (files.length > 0) {
      files.forEach((file) => {
        const meta = file.metaDatas;
        const resultObj = meta.find((obj: any) => obj.key === key);
        resultObj.value = value || '';
      });
    }
  };

  useEffect(() => {
    updateMetaKeyValue('album', albumName);
  }, [albumName]);

  useEffect(() => {
    updateMetaKeyValue('recordingType', recordingType);
  }, [recordingType]);

  useEffect(() => {
    updateMetaKeyValue('yearOfRecording', yearOfRecording);
  }, [yearOfRecording]);

  const changeImage = (): void => {
    if (imageUploader !== null) {
      imageUploader?.current?.click();
    }
  };

  const readFile = (e: any): void => {
    const file = e.target.files[0];
    if (file) {
      setAlbumSpinner(true);
      const reader = new FileReader();
      reader.onload = (ev: any): void => {
        updateAlbumImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAudio = (): void => {
    if (audioUploader !== null) {
      audioUploader?.current?.click();
    }
  };

  const loadMedia = (file: File): Promise<number> =>
    new Promise((resolve, reject) => {
      let duration = 0;
      try {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.onloadedmetadata = (): void => {
          window.URL.revokeObjectURL(audio.src);
          duration = audio.duration;
          resolve(duration);
        };
        audio.src = URL.createObjectURL(file);
      } catch (err) {
        reject(err);
      }
    });

  const readUploadedFile = async (file: File, i): Promise<any> => {
    if (file.type.match(/audio|video/)) {
      //   const reader = new FileReader();
      // reader.onload = async (): Promise<void> => {
      // const dataUrl = reader.result;
      const { name } = file;
      const fileName = _.capitalize(
        _.startCase(name.split('.').slice(0, -1).join('.'))
      );
      const duration = await loadMedia(file);
      const freshMeta: MetaData[] = JSON.parse(metaDatas);
      if (freshMeta.length > 0) {
        const keys = ['album', 'songName', 'recordingType', 'yearOfRecording'];
        keys.forEach((key) => {
          const metaObj = freshMeta.find((obj: any) => obj.key === key);
          switch (key) {
            case 'album':
              metaObj.value = albumName;
              break;
            case 'songName':
              metaObj.value = fileName;
              break;
            case 'recordingType':
              metaObj.value = recordingType;
              break;
            case 'yearOfRecording':
              metaObj.value = yearOfRecording;
              break;
            default:
          }
        });
        files.push({
          duration,
          fileData: file,
          name: fileName,
          metaDatas: freshMeta,
          sortIndex: files?.length,
        });
        const newFiles = [...files];
        updateFileList(newFiles);
      }
      // };
      // reader.readAsDataURL(file);
    }
  };

  const readAudioFile = async (e: any): Promise<void> => {
    const { files: audioFiles } = e.target;
    const filesCollection: any[] = Object.values(audioFiles);
    await Promise.all(filesCollection.map(readUploadedFile));
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      await Promise.all(acceptedFiles.map(readUploadedFile));
    },
    [albumName, recordingType, yearOfRecording, files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const updateAlbum = (value: string, field: string): void => {
    switch (field) {
      case 'name':
        setAlbumName(value);
        break;
      case 'type':
        setRecordingType(value);
        break;
      case 'year':
        setYearOfRecording(value);
        break;
      default:
    }
  };

  const stopProp = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const calcDuration = (seconds: number): string => {
    if (seconds < 60) {
      const secs = Math.round(seconds);
      const zSecs = secs < 10 ? `0${secs}` : secs;
      return `00:${zSecs}`;
    }
    const mins = Math.round(seconds / 60);
    const secs = Math.round(seconds % 60);
    const zMins = mins < 10 ? `0${mins}` : mins;
    const zSecs = secs < 10 ? `0${secs}` : secs;
    return `${zMins}:${zSecs}`;
  };

  const removeFile = (index: number): void => {
    const removed = files.splice(index, 1);
    const newFile = [...files];
    uploadedData.splice(index, 1);
    if (removed[0]?.id) {
      removeContent(removed[0].id);
    }
    setFilesCount(newFile.length);
    updateFileList(newFile);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3>{isEdit ? 'Update' : 'Create'} Album</h3>
        </Modal.Title>
      </Modal.Header>
      <Body>
        <Modal.Body className="modalBody">
          <Row className="fieldRow">
            <Col xs={12} className="text-center">
              {albumSpinner && (
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

              <AlbumImage src={albumImage} alt="Image" />
            </Col>
            <Col className="display-flex text-center flex-direction-column">
              <Form.Control
                type="file"
                ref={imageUploader}
                className="hidden"
                accept="image/png,image/jpg,image/jpeg"
                onChange={readFile}
              />
              <Form.Text className="uploadImgTxt" onClick={changeImage}>
                Change Album Image
              </Form.Text>
            </Col>
          </Row>
          <Form onSubmit={stopProp}>
            <Form.Group>
              <Form.Label>
                Name <span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control
                placeholder="Name"
                value={albumName}
                onChange={({ target: { value } }: any): void =>
                  updateAlbum(value, 'name')
                }
                onBlur={updateNameStatus}
              />
              {!isValidName && (
                <Form.Text className="text-danger">Required</Form.Text>
              )}
            </Form.Group>
            <PerformerSelection
              {...{
                currentPerformerData,
                setCurrentPerformerData,
                selectedPerformers,
                setSelectedPerformers,
                isEdit,
                dummyImage,
              }}
            />
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Recording Type</Form.Label>
                  <Form.Control
                    value={recordingType}
                    onChange={({ target: { value } }: any): void =>
                      updateAlbum(value, 'type')
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Year of Recording</Form.Label>
                  <Form.Control
                    value={yearOfRecording}
                    onChange={({ target: { value } }: any): void =>
                      updateAlbum(value, 'year')
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>
                    Add files (
                    {files.length === 0
                      ? 0
                      : `${filesCount} file${filesCount > 1 ? 's' : ''}`}
                    )<span className="text-danger"> *</span>
                  </Form.Label>
                </Col>
                {files.length > 0 && (
                  <Col className="text-right">
                    <Form.Control
                      type="file"
                      ref={audioUploader}
                      className="hidden"
                      multiple
                      accept="audio/*|video/*"
                      onChange={readAudioFile}
                    />
                    <AddFile onClick={uploadAudio}>
                      <i className="fa fa-plus-circle" />
                    </AddFile>
                  </Col>
                )}
              </Row>
              {files.length > 0 ? (
                <FilesContainer>
                  {files.map((file, fileIndex) => {
                    return (
                      <FileRow
                        key={file.id || `${file.sortIndex} ${fileIndex}`}
                      >
                        <PlayImage src={PlayIcon} alt="playIcon" />
                        <FileNames>
                          <Title>{file?.name}</Title>
                          <Artist>{article?.result?.name}</Artist>
                        </FileNames>
                        <Duration>
                          <span>{calcDuration(file.duration)}</span>
                        </Duration>
                        <RemoveFile onClick={(): void => removeFile(fileIndex)}>
                          <i className="fa fa-times" />
                        </RemoveFile>
                      </FileRow>
                    );
                  })}
                </FilesContainer>
              ) : (
                <DropContainer active={isDragActive} {...getRootProps()}>
                  <input id="contained-button-file" {...getInputProps()} />
                  {isDragActive ? (
                    <DropPanel>Drop the files here ...</DropPanel>
                  ) : (
                    <UploadContainer>
                      <i className="fa fa-2x fa-upload" aria-hidden="true" />
                      <UploadTxt>Upload Music/Video</UploadTxt>
                      <DullTxt>
                        Drag a file to attach or
                        <Form.Label htmlFor="contained-button-file">
                          &nbsp; browse
                        </Form.Label>
                      </DullTxt>
                    </UploadContainer>
                  )}
                </DropContainer>
              )}

              {!isValidFiles && (
                <Form.Text className="text-danger">Required</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="text-center">
              <Button
                className="createButton"
                variant="primary"
                onClick={onCreate}
              >
                {isEdit ? 'Continue' : 'Create'}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Body>
    </>
  );
};

const SpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.6);
  .spin {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 30px;
    width: 30px;
    margin: 0px auto;
    z-index: 99999;
  }
`;
const Body = styled.div`
  .modal-body {
    padding: 0 2rem;
  }
  .fieldRow {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .hidden {
    display: none;
  }
  .uploadImgTxt {
    color: ${({ theme }): string => theme.secondary};
    cursor: pointer;
    display: inline-block;
  }
  .createButton {
    background: #3b43f2;
    borderradius: 5px;
  }
  .form-label {
    font-size: 14px;
    font-weight: bold;
  }
`;
const FilesContainer = styled.div`
  max-height: 200px;
  overflow: auto;
`;
const FileRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
`;
const PlayImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const FileNames = styled.div`
  width: 70%;
  margin-left: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`;
const AlbumImage = styled.img`
  width: 106px;
  height: 84px;
  border-radius: 10px;
  object-fit: cover;
`;
const AddFile = styled.span`
  cursor: pointer;
  .fa {
    color: ${({ theme }): string => theme.primary};
    font-size: 26px;
  }
`;
const Title = styled.span`
  font-size: 14px;
  width: 100%;
  display: -webkit-box;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const Artist = styled.span`
  font-size: 12px;
  color: #999999;
`;
const Duration = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 1rem;
  color: #999999;
  height: 50px;
`;
const DropContainer = styled.div<{ active: boolean }>`
  outline: none;
  border: 2px dashed
    ${({ active, theme }): string => (active ? theme.primary : '#dbe0e6')};
  border-radius: 8px;
  text-align: center;
  padding: 1rem;
`;
const DropPanel = styled.div`
  height: 100px;
  padding: 1rem;
`;

const UploadContainer = styled.div``;
const UploadTxt = styled.p`
  font-family: Circular Std;
  fontsize: 18px;
  line-height: 25px;
  color: #43484d;
  margin-top: 30;
  margin-bottom: 0;
`;
const DullTxt = styled.p`
  font-family: Circular Std;
  font-size: 14px;
  line-height: 25px;
  color: #a2abb3;
  margin-bottom: 0;
  label {
    font-weight: 600;
    font-size: 14px;
    line-height: 25px;
    cursor: pointer;
    color: #1148bf;
  }
`;
const RemoveFile = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.3rem 0 0.5rem;
  cursor: pointer;
  color: ${({ theme }): string => theme.primary};
  height: 50px;
  i {
    font-size: 18px;
  }
`;

export default CreatePanel;

import React, { FC, useEffect, useRef, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form } from 'react-bootstrap';
import styled from 'styled-components';

import { actions } from '../../../redux/reducers/ArticleReducer';
import { UpdateImagePrams } from '../../../model/SearchModel';
import AlbumIcon from '../../../assets/images/album.png';
import EventIcon from '../../../assets/images/event.png';
import {
  chooseDummyImage,
  DummyImage,
  isValidHttpUrl,
  uploadToCloud,
} from '../common/common';

interface Props {
  detail: any;
  authorized: boolean;
  children?: ReactNode;
  folderFor: 'Performers' | 'Series' | 'Venue';
  collection: 'Performer' | 'Series' | 'Venue';
  activeMenu: string;
  setActive: (label: string, index: number) => void;
}

const Card: FC<Props> = ({
  detail,
  authorized,
  children,
  folderFor,
  collection,
  setActive,
  activeMenu,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const uploader = useRef<HTMLDivElement>(null);
  const fileUploader = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState(DummyImage);
  const [toggleBackDrop, setBackDrop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (detail?.image.includes('cloudinary') || isValidHttpUrl(currentImage)) {
      setCurrentImage(detail?.image);
    } else {
      setCurrentImage(DummyImage);
    }
  }, [detail]);

  const showBackDrop = (): void => {
    setBackDrop(true);
  };
  const hideBackDrop = (): void => {
    setBackDrop(false);
  };
  const uploadImage = (): void => {
    fileUploader.current?.click();
  };
  const uploadViaLink = (): void => {
    setShowModal(true);
  };

  const changeImageInDb = (url: string): void => {
    const uploadPrams: UpdateImagePrams = {
      collectionId: detail?.id,
      image: url,
      collection,
    };
    dispatch(actions.updateImage(uploadPrams));
  };

  const readFile = (e: any): void => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev: any): void => {
      setCurrentImage(ev.target.result);
      uploadToCloud(ev.target.result, folderFor, ({ secureUrl }) => {
        changeImageInDb(secureUrl);
      });
    };
    reader.readAsDataURL(file);
  };
  const dummyImage = chooseDummyImage(collection);
  const loadDefaultImage = (e: any): any => {
    e.target.src = dummyImage;
  };

  const updateImage = (url: string): void => {
    setCurrentImage(url);
    if (isValidHttpUrl(url)) {
      setShowModal(false);
      uploadToCloud(url, folderFor, ({ secureUrl }) => {
        changeImageInDb(secureUrl);
      });
    }
  };

  const removeLink = (): void => {
    setCurrentImage('');
  };

  return (
    <Container>
      <ArtistCard>
        <ImageContainer
          onFocus={authorized ? showBackDrop : (): void => {}}
          onMouseOver={authorized ? showBackDrop : (): void => {}}
          onBlur={authorized ? hideBackDrop : (): void => {}}
          onMouseOut={authorized ? hideBackDrop : (): void => {}}
        >
          <Image
            src={currentImage || dummyImage}
            onError={loadDefaultImage}
            alt="userImage"
          />
          {authorized && (
            <>
              <BackDrop visible={toggleBackDrop} ref={uploader}>
                <UploadLocal
                  onClick={uploadImage}
                  onKeyPress={uploadImage}
                  role="button"
                  tabIndex={0}
                >
                  Update Image
                </UploadLocal>
                <br />
                <UploadLink
                  onClick={uploadViaLink}
                  onKeyPress={uploadViaLink}
                  role="button"
                  tabIndex={0}
                >
                  Update Via Link
                </UploadLink>
              </BackDrop>
              <FileInput
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                ref={fileUploader}
                onChange={readFile}
              />
            </>
          )}
        </ImageContainer>
        <RightContent>{children}</RightContent>
      </ArtistCard>
      <ContentCard>
        {/* <NewButton
          isActive={activeMenu === 'Past events'}
          onClick={(): void => setActive('Past events', 0)}
        >
          <ButtonRow>
            <Icon src={EventIcon} alt="events" />
            Past Events
          </ButtonRow>
        </NewButton> */}
        <NewButton
          isActive={activeMenu === 'Upcoming events'}
          onClick={(): void => setActive('Upcoming events', 0)}
        >
          <ButtonRow>
            <Icon src={EventIcon} alt="events" />
            Upcoming Events
          </ButtonRow>
        </NewButton>
        <NewButton
          isActive={activeMenu === 'Uploaded albums'}
          onClick={(): void => setActive('Uploaded albums', 0)}
        >
          <ButtonRow>
            <Icon src={AlbumIcon} alt="albums" />
            Uploaded Albums
          </ButtonRow>
        </NewButton>
      </ContentCard>

      <Modal
        show={showModal}
        onHide={(): void => setShowModal(false)}
        backdrop="static"
        dialogClassName="modal-40w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter align-center">
            Change image via link
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="lgBody" style={{ padding: '0.5rem 0' }}>
          <ImageLink>
            <Form.Control
              placeholder="Image URL"
              className="formInput w-100"
              value={currentImage}
              onChange={({ target: { value } }): void => updateImage(value)}
            />
            {currentImage?.length > 0 && (
              <Remove onClick={removeLink}>x</Remove>
            )}
          </ImageLink>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

Card.defaultProps = {
  children: undefined,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
  justify-content: space-around;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const ArtistCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 1 100%;
  border-radius: 10px;
  padding: 2rem;
  margin-right: 0;
  margin-bottom: 1rem;
  background-color: ${({ theme }): string => theme.black};
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1 1 70%;
    margin-right: 15px;
    margin-bottom: 0;
  }
`;
const ContentCard = styled.div`
  display: flex;
  flex: 1 1 20%;
  flex-direction: column;
  justify-content: center;
  & > div:not(:last-child) {
    margin-bottom: 1%;
  }
  @media (min-width: 768px) {
    & > div:not(:last-child) {
      margin-bottom: 2%;
    }
  }
`;
const NewButton = styled.div<{ isActive: boolean }>`
  background-color: ${({ theme }): string => theme.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  height: 45%;
  text-align: center;
  border-radius: 10px;
  color: ${({ isActive, theme }): string =>
    isActive ? theme.primary : theme.white};
`;
const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;
const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  @media (min-width: 768px) {
    margin-right: 5px;
  }
`;
const ImageContainer = styled.div`
  display: flex;
  flex: 1 1 120px;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  margin-right: 15px;
  align-items: center;
  position: relative;
  outline: none;
  overflow: hidden;
  box-shadow: 0 0 8px white;
  @media (max-width: 768px) {
    flex: 1 1 120px;
    margin-right: 0;
    align-items: center;
    align-self: center;
  }
`;
const Image = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  position: relative;
  @media (min-width: 900px) {
    width: 105px;
    height: 105px;
  }
`;
const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 2 1 70%;
  @media (max-width: 768px) {
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    flex: 2 1 60%;
    text-align: center;
  }
`;
const BackDrop = styled.div<{ visible: boolean }>`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  outline: none;
  display: ${({ visible }): string => (visible ? 'block' : 'none')};
`;
const FileInput = styled.input`
  display: none;
`;
const UploadLocal = styled.span`
  cursor: pointer;
  color: ${({ theme }): string => theme.white};
  position: relative;
  font-size: 12px;
  text-align: center;
  top: 30%;
`;

const UploadLink = styled.span`
  cursor: pointer;
  color: ${({ theme }): string => theme.white};
  position: relative;
  font-size: 12px;
  text-align: center;
  top: 40%;
`;
const ImageLink = styled.div`
  display: flex;
  align-items: center;
  width: 85%;
  margin: 0 0 2rem;
`;
const Remove = styled.span`
  cursor: pointer;
  position: absolute;
  right: 40px;
  width: 15px;
  text-align: center;
  background-color: ${({ theme }): string => theme.white};
  color: ${({ theme }): string => theme.primary};
`;

export default Card;

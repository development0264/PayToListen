import React, { FC, useState, useEffect } from 'react';
import { Spinner, Row, Col, Card, Badge } from 'react-bootstrap';
import styled from 'styled-components';
import NewAlbumModal from './modals/NewModal';
import { Album as AlbumItemProps } from '../../../model/contentModel';
import { getContents } from '../../../utils/services';

interface UploadedData {
  contentId: string;
  fileName: string;
}
interface AlbumProps {
  mediaUploading: boolean;
  albums: any[];
  article: any;
  currentCollection: 'performers' | 'sabhas' | 'venues';
  uploadedData: UploadedData[];
  albumId: string;
}

const Album: FC<AlbumProps> = ({
  mediaUploading,
  article,
  currentCollection,
  uploadedData,
  albumId,
  albums,
}: AlbumProps): JSX.Element => {
  const [showNewAlbumModal, setToggleAlbumModal] = useState<boolean>(false);
  const [showSpinner, setSpinner] = useState<boolean>(false);
  const [isEdit, setEdit] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<AlbumItemProps>();
  const [activeContents, setActiveContents] = useState<any[]>();
  const [currentUploadedData, setCurrentUploadedData] = useState<
    UploadedData[]
  >(uploadedData);

  useEffect(() => {
    setCurrentUploadedData((data) => {
      data.push(...uploadedData);
      return data;
    });
  }, [uploadedData]);

  useEffect(() => {
    if (mediaUploading) {
      setSpinner(true);
    } else {
      setSpinner(false);
    }
  }, [mediaUploading]);

  const openNewAlbum = (): void => {
    setToggleAlbumModal(true);
  };

  useEffect(() => {
    if (activeAlbum) {
      setEdit(true);
      setToggleAlbumModal(true);
    }
  }, [activeAlbum]);

  const clearData = (): void => {
    setEdit(false);
    setActiveAlbum(undefined);
    setActiveContents(undefined);
    setCurrentUploadedData([]);
  };

  useEffect(() => {
    if (!showNewAlbumModal) {
      clearData();
    }
  }, [showNewAlbumModal]);

  const editAlbum = (album: AlbumItemProps): void => {
    setActiveAlbum(album);
    getContents(album.id).then((contents) => {
      const extractFields = contents.map((content) => {
        return { contentId: content.id, fileName: content.title };
      });
      const uploads = [...currentUploadedData];
      uploads.push(...extractFields);
      setCurrentUploadedData(uploads);
      setActiveContents(contents);
    });
  };

  return (
    <Container>
      {showSpinner && (
        <ProfileSpinner>
          <Spinner
            animation="border"
            variant="light"
            role="status"
            className="spin"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </ProfileSpinner>
      )}

      <Row>
        <Col md={3}>
          <CardWrapper>
            <Card onClick={openNewAlbum}>
              <CreateNewCard>
                <i className="fa fa-plus" aria-hidden="true" />
              </CreateNewCard>
              <Card.Body>
                <Card.Text>Create Album</Card.Text>
              </Card.Body>
            </Card>
          </CardWrapper>
        </Col>

        {albums.map((album) => (
          <Col xs={12} sm={6} md={3} key={album.id}>
            <CardWrapper onClick={(): void => editAlbum(album)}>
              <Card style={{ marginBottom: 20 }}>
                <CardContainer>
                  <Card.Img variant="bottom" src={album?.image} />
                  <input type="checkbox" />
                  <Badge pill variant="primary">
                    {album?.views || 0}
                  </Badge>
                </CardContainer>

                <Card.Body>
                  <Card.Text>{album?.title}</Card.Text>
                </Card.Body>
              </Card>
            </CardWrapper>
          </Col>
        ))}
      </Row>
      <NewAlbumModal
        visible={showNewAlbumModal}
        toggleVisible={setToggleAlbumModal}
        {...{
          currentCollection,
          article,
          isEdit,
          uploadedData: currentUploadedData,
          album: activeAlbum,
          contents: activeContents,
          albumId: albumId || activeAlbum?.id,
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  overflow-x: hidden;
`;
const ProfileSpinner = styled.div`
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
const CreateNewCard = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }): string => theme.white};
  border-radius: 5px;
  cursor: pointer;
  .fa {
    top: 45%;
    left: 48%;
    color: ${({ theme }): string => theme.primary};
    position: absolute;
  }
`;
const CardWrapper = styled.div`
  .card {
    background-color: transparent;
    border: none;
    color: ${({ theme }): string => theme.white};
    margin-bottom: 20px;
    cursor: pointer;
  }
  .card-body {
    padding: 6px 0;
    p {
      font-size: 14px;
      text-align: left;
    }
  }
`;
const CardContainer = styled.div`
  position: relative;
  height: 200px;
  img {
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  .badge {
    right: 5px;
    bottom: 5px;
    background-color: ${({ theme }): string => theme.primary};
    padding: 7px 5px 0 5px;
    width: 24px;
    height: 24px;
    position: absolute;
  }
  input {
    left: 5px;
    top: 5px;
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 4px;
  }
`;

export default Album;

import React, { FC, useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import NewAlbumModal from './modals/NewModal';
import VideoPic from '../../../assets/images/videoPic.png';
import VideoLogo from '../../../assets/images/videoLogo.png';

interface VideoProps {
  mediaUploading: boolean;
  videos: any[];
  article: any;
  currentCollection: 'performers' | 'sabhas' | 'venues';
  uploadedData: { contentId: string; fileName: string }[];
  albumId: string;
}

const Video: FC<VideoProps> = ({
  currentCollection,
  article,
  uploadedData,
  albumId,
  mediaUploading,
}: VideoProps): JSX.Element => {
  const video = [
    {
      id: '1',
      name: 'Tunbam Nergaiyil Desh',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '2',
      name: 'Neerajakshi Kamakshi-H',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '3',
      name: 'Nadopasana',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '5',
      name: 'Ragam Tanam Pallavi',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '6',
      name: 'Male Maniva',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '7',
      name: 'Tunbam Nergaiyil Desh',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
    {
      id: '8',
      name: 'Neerajakshi Kamakshi-H',
      video: 'Video',
      album: 'Album',
      duration: '06:50',
    },
  ];

  const [showNewVideoModal, setToggleVideoModal] = useState<boolean>(false);

  const openNewVideo = (): void => {
    setToggleVideoModal(true);
  };

  const addNewVideo = (params: any): void => {
    console.log('AddVideo');
  };

  return (
    <div>
      <Row>
        <Col xs={12} md={8} lg={3}>
          <Card className="card-for-all text-center" onClick={openNewVideo}>
            <div className="position-relative">
              <Card.Img
                variant="top"
                className="thumbnails"
                src="https://via.placeholder.com/300.png/fff/fff"
              />
              <i
                className="fa fa-plus position-absolute create-icon text-center"
                aria-hidden="true"
              />
              <p className="add-audio-text text-center position-absolute">
                Add New
              </p>
            </div>
          </Card>
        </Col>

        {video.map((vid) => (
          <Col key={vid.id} xs={12} md={8} lg={3}>
            {/* <Col key={vid.id} md={3}> */}
            <Card className="card-for-all">
              <Card.Img variant="top" className="card-image" src={VideoPic} />
              <input type="checkbox" className="topleftcheckbox" />
              <Badge className="video-duration-badge" pill variant="dark">
                {vid.duration}
              </Badge>
              <Card.Body className="card-list-body">
                <Card.Title className="title-text">{vid.name}</Card.Title>
                <Row className="row-subtitle">
                  <img
                    className="track-icon"
                    src={VideoLogo}
                    alt="video"
                    width="18px"
                    height="18px"
                  />

                  <Card.Text className="card-subtext">{vid.video}</Card.Text>
                  <Card.Text className="card-subtext">{vid.album}</Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <NewAlbumModal
        visible={showNewVideoModal}
        toggleVisible={setToggleVideoModal}
        addAlbum={addNewVideo}
        {...{
          currentCollection,
          article,
          uploadedData,
          albumId,
          mediaUploading,
        }}
      />
    </div>
  );
};
export default Video;

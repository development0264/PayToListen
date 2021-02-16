import React, { FC, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import track from '../../../assets/images/track.png';
import NewAlbumModal from './modals/NewModal';

interface AudioProps {
  mediaUploading: boolean;
  audios: any[];
  article: any;
  currentCollection: 'performers' | 'sabhas' | 'venues';
  uploadedData: { contentId: string; fileName: string }[];
  albumId: string;
}

const Audio: FC<AudioProps> = ({
  currentCollection,
  article,
  uploadedData,
  albumId,
  mediaUploading,
}: AudioProps): JSX.Element => {
  const audio = [
    { id: '1', name: 'Tunbam Nergaiyil', audio: 'Audio', album: 'Albums' },
    {
      id: '2',
      name: 'Neerajakshi Kamakshi-H',
      audio: 'Audio',
      album: 'Album',
    },
    { id: '3', name: 'Nadopasana', audio: 'Audio', album: 'Album' },
    { id: '5', name: 'Ragam Tanam Pallavi', audio: 'Audio', album: 'Album' },
    { id: '6', name: 'Male Manivanna', audio: 'Audio', album: 'Album' },
    { id: '7', name: 'Tunbam Nergaiyil Desh', audio: 'Audio', album: 'Album' },
    {
      id: '8',
      name: 'Neerajakshi Kamakshi-H',
      audio: 'Audio',
      album: 'Album',
    },
  ];

  const [showNewAudioModal, setToggleAudioModal] = useState<boolean>(false);

  const openNewAudio = (): void => {
    setToggleAudioModal(true);
  };

  const addNewAudio = (params: any): void => {
    console.log('AddAudio');
  };

  return (
    <div>
      <Row>
        <Col xs={12} md={8} lg={3}>
          <Card className="card-for-all text-center" onClick={openNewAudio}>
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

        {audio.map((aud) => (
          <Col key={aud.id} xs={12} md={8} lg={3}>
            <Card className="card-for-all">
              <Card.Img
                variant="top"
                className="card-image"
                src="https://coolbackgrounds.io/images/backgrounds/black/pure-black-background-f82588d3.jpg"
              />
              <input type="checkbox" className="topleftcheckbox" />
              <img
                className="icon-center-image"
                src={track}
                alt="music"
                width="24px"
                height="28px"
              />

              <Card.Body className="card-list-body">
                <Card.Title className="title-text">{aud.name}</Card.Title>
                <Row className="row-subtitle">
                  <img
                    className="track-icon"
                    src={track}
                    alt="music"
                    width="14px"
                    height="18px"
                  />

                  <Card.Text className="card-subtext">{aud.audio}</Card.Text>
                  <Card.Text className="card-subtext">{aud.album}</Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <NewAlbumModal
        visible={showNewAudioModal}
        toggleVisible={setToggleAudioModal}
        addAlbum={addNewAudio}
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
export default Audio;

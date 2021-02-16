import React, { useEffect, FC, useState } from 'react';
import { Col, Row, Form, Modal, Button } from 'react-bootstrap';
import { chooseDummyImage } from '../common/common';

import ImageUploader from '../common/ImageUploader';
import './modal.css';

interface Props {
  visible: boolean;
  toggleVisible: (v: boolean) => void;
  addVenue: (params: any) => void;
  inputValue: string;
}

const NewVenueModal: FC<Props> = ({
  visible,
  toggleVisible,
  addVenue,
  inputValue,
}: Props): JSX.Element => {
  const initialState = {
    name: inputValue,
    abbr: '',
    address: '',
    city: '',
    contact: '',
    description: '',
    image: '',
    seating: '',
    type: '',
    coordinates: '',
  };
  const [venue, setVenue] = useState(initialState);
  const [isTitle, setIsTitle] = useState(true);
  const [isCity, setIsCity] = useState(true);
  const [isCoords, setIsCoords] = useState(false);

  const dummyImage = chooseDummyImage('venues');

  const clearState = (): void => {
    setVenue(initialState);
    setIsTitle(true);
    setIsCity(true);
    setIsCoords(false);
  };

  useEffect(() => {
    clearState();
  }, [visible]);

  const onChangeField = (field: string, value: string): void => {
    setVenue({ ...venue, [field]: value });
  };

  const onSubmit = (): void => {
    const { name, city, coordinates } = venue;
    const coordsPattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    const isvTitle = name.length === 0;
    const isvCity = city.length === 0;
    const isvCoords = coordsPattern.test(coordinates);
    if (isvTitle) {
      setIsTitle(false);
    } else {
      setIsTitle(true);
    }
    if (isvCity) {
      setIsCity(false);
    } else {
      setIsCity(true);
    }
    if (isvCoords) {
      setIsCoords(false);
    } else {
      setIsCoords(true);
    }
    // console.log('values..', isvTitle, isvCity, isvCoords);
    if (!isvTitle && !isvCity && isvCoords) {
      addVenue(venue);
    }
  };
  return (
    <Modal
      show={visible}
      onHide={(): void => toggleVisible(false)}
      backdrop="static"
      dialogClassName="modal-70w"
      className="coll-modal"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-center w-100"
        >
          <h3>Add Venue</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pendingBody cal-create-event-by">
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Venue Title
              <span className="text-danger"> *</span>
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={venue.name}
              onChange={({ target: { value } }): void =>
                onChangeField('name', value)
              }
            />
            {!isTitle && (
              <Form.Text className="text-danger">
                Venue title Required
              </Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Abbrevation
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={venue.abbr}
              onChange={({ target: { value } }): void =>
                onChangeField('abbr', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Address
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              value={venue.address}
              onChange={({ target: { value } }): void =>
                onChangeField('address', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">City</Form.Label>
            <span className="text-danger"> *</span>
          </Col>
          <Col>
            <Form.Control
              value={venue.city}
              onChange={({ target: { value } }): void =>
                onChangeField('city', value)
              }
            />
            {!isCity && (
              <Form.Text className="text-danger">City Required</Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Contact
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={venue.contact}
              onChange={({ target: { value } }): void =>
                onChangeField('contact', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Description
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              value={venue.description}
              onChange={({ target: { value } }): void =>
                onChangeField('description', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">Image</Form.Label>
          </Col>
          <Col>
            <ImageUploader
              image={venue.image}
              dummyImage={dummyImage}
              setImage={(img: string): void => onChangeField('image', img)}
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Seating capacity
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={venue.seating}
              onChange={({ target: { value } }): void =>
                onChangeField('seating', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">Type</Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={venue.type}
              onChange={({ target: { value } }): void =>
                onChangeField('type', value)
              }
            />
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Coordinates
            </Form.Label>
            <span className="text-danger"> *</span>
          </Col>
          <Col>
            <Form.Control
              placeholder="latitude, longitude"
              value={venue.coordinates}
              onChange={({ target: { value } }): void =>
                onChangeField('coordinates', value)
              }
            />
            {isCoords && (
              <Form.Text className="text-danger">
                Coordinates Required
              </Form.Text>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="mdFooter">
        <Button onClick={onSubmit} variant="success">
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewVenueModal;

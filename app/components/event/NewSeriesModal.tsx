import React, { useEffect, FC, useState } from 'react';
import { Col, Row, Form, Modal, Button } from 'react-bootstrap';

import './modal.css';
import ImageUploader from '../common/ImageUploader';
import { chooseDummyImage } from '../common/common';

interface Props {
  visible: boolean;
  toggleVisible: (v: boolean) => void;
  addSeries: (params: any) => void;
  inputValue: string;
}

const NewSeriesModal: FC<Props> = ({
  visible,
  toggleVisible,
  addSeries,
  inputValue,
}: Props): JSX.Element => {
  const initialState = {
    name: inputValue,
    image: '',
  };
  const [series, setSeries] = useState(initialState);
  const [isTitle, setIsTitle] = useState(true);
  const dummyImage = chooseDummyImage('sabhas');

  const clearState = (): void => {
    setSeries(initialState);
    setIsTitle(true);
  };

  useEffect(() => {
    clearState();
  }, [visible]);

  const onChangeField = (field: string, value: string): void => {
    setSeries({ ...series, [field]: value });
  };

  const onSubmit = (): void => {
    const { name } = series;
    const isVTitle = name.length === 0;
    if (isVTitle) {
      setIsTitle(false);
    } else {
      setIsTitle(true);
    }
    if (!isVTitle) {
      addSeries(series);
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
          <h3>Add Series</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pendingBody cal-create-event-by">
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Series Title
              <span className="text-danger"> *</span>
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={series.name}
              onChange={({ target: { value } }): void =>
                onChangeField('name', value)
              }
            />
            {!isTitle && (
              <Form.Text className="text-danger">
                Series title Required
              </Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">Image</Form.Label>
          </Col>
          <Col>
            <ImageUploader
              image={series.image}
              dummyImage={dummyImage}
              setImage={(img: string): void => onChangeField('image', img)}
            />
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

export default NewSeriesModal;

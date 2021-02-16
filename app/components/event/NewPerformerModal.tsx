import React, { useEffect, FC, useState } from 'react';
import { Col, Row, Form, Modal, Button } from 'react-bootstrap';
import _ from 'lodash';
import MultiSelect from '@khanacademy/react-multi-select';

import './modal.css';
import { SkillProp } from '../../../model/SearchModel';
import ImageUploader from '../common/ImageUploader';
import { chooseDummyImage } from '../common/common';

interface Props {
  visible: boolean;
  toggleVisible: (v: boolean) => void;
  addPerformer: (params: any) => void;
  skills: SkillProp[];
  inputValue: string;
}

const NewPerformerModal: FC<Props> = ({
  visible,
  toggleVisible,
  addPerformer,
  skills,
  inputValue,
}: Props): JSX.Element => {
  const initialState = {
    name: inputValue,
    gender: '',
    image: '',
    skill: [],
  };
  const [performer, setPerformer] = useState(initialState);
  const [isName, setIsName] = useState(true);
  const [isGender, setIsGender] = useState(true);
  const [isSkill, setIsSkill] = useState(true);
  const dummyImage = chooseDummyImage('performers');

  const clearState = (): void => {
    setPerformer(initialState);
    setIsName(true);
    setIsGender(true);
    setIsSkill(true);
  };

  useEffect(() => {
    clearState();
  }, [visible]);

  const onChangeField = (field: string, value: string): void => {
    setPerformer({ ...performer, [field]: value });
  };
  const onSkillChange = (skill: any): void => {
    setPerformer({ ...performer, skill });
  };

  const skillOptions = (): { label: string; value: string }[] => {
    const formatedSkill = _.chain(skills)
      .map((value) => _.capitalize(value.name))
      .sort()
      .value();
    return formatedSkill.map((skill) => {
      return { label: skill, value: skill };
    });
  };
  const onSubmit = (): void => {
    const { name, gender, skill } = performer;
    const isValidName = name.length === 0;
    const isValidGender = gender.length === 0;
    const isValidSkill = skill.length === 0;
    if (isValidName) {
      setIsName(false);
    } else {
      setIsName(true);
    }
    if (isValidGender) {
      setIsGender(false);
    } else {
      setIsGender(true);
    }
    if (isValidSkill) {
      setIsSkill(false);
    } else {
      setIsSkill(true);
    }
    if (!isValidName && !isValidGender && !isValidSkill) {
      addPerformer(performer);
    }
  };
  //   console.log('skills, ', skillOptions());
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
          <h3>Add Performer</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pendingBody cal-create-event-by">
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Name
              <span className="text-danger"> *</span>
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              value={performer.name}
              onChange={({ target: { value } }): void =>
                onChangeField('name', value)
              }
            />
            {!isName && (
              <Form.Text className="text-danger">Name Required</Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Gender
              <span className="text-danger"> *</span>
            </Form.Label>
          </Col>
          <Col>
            <Form.Control
              as="select"
              value={performer.gender}
              onChange={({ target: { value } }): void =>
                onChangeField('gender', value)
              }
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </Form.Control>
            {!isGender && (
              <Form.Text className="text-danger">Gender Required</Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">
              Skill
              <span className="text-danger"> *</span>
            </Form.Label>
          </Col>
          <Col>
            <MultiSelect
              options={skillOptions()}
              overrideStrings={{
                selectSomeItems: 'Select skill',
              }}
              selected={performer.skill}
              onSelectedChanged={onSkillChange}
            />
            {!isSkill && (
              <Form.Text className="text-danger">Skill Required</Form.Text>
            )}
          </Col>
        </Row>
        <Row className="fieldRow">
          <Col xs={4}>
            <Form.Label className="labelSt font-weight-bold">Image</Form.Label>
          </Col>
          <Col>
            <ImageUploader
              image={performer.image}
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

export default NewPerformerModal;

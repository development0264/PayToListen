/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { Performer } from '../../../model/SearchModel';
import Card from './Card';

interface Props {
  detail: Performer;
  authorized: boolean;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  toggleSkill: () => void;
  isSkillEditable: boolean;
  isValidSkill: boolean;
  activeMenu: string;
  setActive: (label: string, index: number) => void;
  skillModal: boolean;
  setSkillModal: (value: boolean) => void;
}

const PerformerCard: FC<Props> = ({
  detail,
  authorized,
  addSkill,
  removeSkill,
  toggleSkill,
  isSkillEditable,
  isValidSkill,
  activeMenu,
  setActive,
  skillModal,
  setSkillModal,
}: Props): JSX.Element => {
  const [newSkill, setNewSkill] = useState('');
  const [skill, setSkill] = useState(detail?.skill);
  const [name, setName] = useState(detail?.name || '');
  const updateState = (): void => {
    setSkill(detail?.skill);
    setName(detail?.name);
  };

  useEffect(() => {
    if (isSkillEditable) {
      setNewSkill('');
      setSkillModal(true);
    }
  }, [isSkillEditable]);

  useEffect(() => {
    updateState();
  }, [detail]);

  const onSkillChange = (e: any): void => {
    e.preventDefault();
    const {
      target: { value },
    } = e;
    setNewSkill(value);
  };

  const addNewSkill = (): void => {
    addSkill(newSkill);
    toggleSkill();
  };

  return (
    <Card
      {...{
        detail,
        authorized,
        setActive,
        activeMenu,
        folderFor: 'Performers',
        collection: 'Performer',
      }}
    >
      <Name>{name}</Name>
      {/* <>
        {authorized ? (
          <Container>
            <SkillContainer>
              <span>Skills:&nbsp;</span>
              <AddSkill onClick={toggleSkill} onKeyDown={toggleSkill}>
                <i className="fa fa-plus-circle" />
              </AddSkill>
              <br />
              {skill &&
                skill.map((skillItem) => {
                  return (
                    <SkillButtonView
                      key={skillItem}
                      onClick={(): void => removeSkill(skillItem)}
                    >
                      <span>{skillItem}</span>
                      <Close>x</Close>
                    </SkillButtonView>
                  );
                })}
            </SkillContainer>
          </Container>
        ) : (
          <Para>
            Skills:&nbsp;
            {skill && skill.join(', ')}
          </Para>
        )}
      </> */}
      <Modal
        show={skillModal}
        onHide={(): void => setSkillModal(false)}
        backdrop="static"
        dialogClassName="modal-40w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter align-center">
            Add Skill
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="lgBody">
          <EditSkillRow>
            <Form.Group controlId="Skills">
              <Form.Control
                placeholder="Skill"
                value={newSkill}
                onChange={onSkillChange}
              />
            </Form.Group>
            {!isValidSkill && (
              <Form.Text className="text-danger">Required</Form.Text>
            )}
            <Button onClick={addNewSkill}>
              <i className="fa fa-plus-circle" />
              <span className="txt">Add</span>
            </Button>
          </EditSkillRow>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

const Container = styled.div``;

const Name = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 0;
  color: ${(props): string => props.theme.white};
`;
const Para = styled.p`
  font-size: 14px;
  margin-bottom: 0;
  font-weight: 600;
  color: ${(props): string => props.theme.white};
`;
const AddSkill = styled.span`
  height: 2rem;
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  color: ${(props): string => props.theme.white};
  outline: none;
  cursor: pointer;
  .fa {
    font-size: 20px;
  }
`;
const SkillContainer = styled.div`
  color: ${(props): string => props.theme.white};
`;
const SkillButtonView = styled.span`
  margin: 0.2rem;
  border-radius: 30px;
  font-family: Nunito;
  background-color: ${(props): string => props.theme.lightPink};
  border-color: ${(props): string => props.theme.lightPink};
  padding: 0.2rem 0.6rem;
  outline: none;
  &: hover {
    cursor: pointer;
  }
  span {
    color: ${(props): string => props.theme.white};
  }
`;
const Close = styled.span`
  margin-left: 10px;
  font-size: 20px;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${(props): string => props.theme.violet};
  border-radius: 25px;
  padding: 5px 12px 4px 4px;
  outline: none;
  .fa {
    color: ${(props): string => props.theme.white};
    font-size: 26px;
  }
  .txt {
    color: ${(props): string => props.theme.white};
    font-size: 18px;
    font-weight: bold;
    padding-left: 2px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;
const EditSkillRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  .form-group {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default PerformerCard;

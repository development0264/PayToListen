import React, { FC } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import DropDownList from './DropDownList';
import { toTitleCase } from './common';

interface EditMode {
  toggleAddGuru: () => void;
  showGuruEntry: boolean;
  isValidEntry: boolean;
  addGuruName: () => void;
  cancelAddingGuruLineage: () => void;
  performers: any;
  onChangeField: (value: string, field: string, fetch?: boolean) => void;
  currentGuru: any;
  setSelectedItem: any;
  openNewPerformers: () => void;
  showPerformerSpinner: boolean;
  setSkill: (v: string) => void;
  setIsPerformerSelected: (v: boolean) => void;
  setPerformerSkills?: (skils: any[]) => void;
  selectedSkill: string;
  performerSkills: any[];
  guruLineages: { guru: any[]; shishya: any[] };
  editGuru: (i: number) => void;
  deleteGuru: (guru: any) => void;
  toggleEditGuru: boolean;
  editGuruIndex: number | undefined;
}

const GuruEditMode: FC<EditMode> = ({
  toggleAddGuru,
  guruLineages,
  showGuruEntry,
  isValidEntry,
  addGuruName,
  cancelAddingGuruLineage,
  performers,
  onChangeField,
  currentGuru,
  setSelectedItem,
  openNewPerformers,
  showPerformerSpinner,
  setSkill,
  setIsPerformerSelected,
  setPerformerSkills,
  selectedSkill,
  performerSkills,
  editGuru,
  deleteGuru,
  toggleEditGuru,
}: EditMode): JSX.Element => {
  return (
    <Container>
      <Header>
        <Title>Guru</Title>
        <AddButton
          onClick={toggleAddGuru}
          onKeyDown={toggleAddGuru}
          role="button"
          tabIndex={0}
        >
          <i className="fa fa-plus-circle" />
        </AddButton>
      </Header>
      {guruLineages?.guru &&
        guruLineages?.guru?.map(
          (guru: any, i: number): JSX.Element => {
            return (
              <GuruRow key={i}>
                <span key={guru?.id}>{guru?.guruDetails?.name}</span>
                <RowAction>
                  <Span
                    onClick={(): void => editGuru(i)}
                    onMouseDown={(): void => editGuru(i)}
                  >
                    <i className="fa fa-pencil text-warning" />
                  </Span>
                  <Span
                    onClick={(): void => deleteGuru(guru)}
                    onMouseDown={(): void => deleteGuru(guru)}
                  >
                    <i className="fa fa-trash text-danger" />
                  </Span>
                </RowAction>
              </GuruRow>
            );
          }
        )}
      {(showGuruEntry || toggleEditGuru) && (
        <>
          <Row>
            <Col xs={12} md={7}>
              <Row>
                <Col>
                  <DropDownList
                    label="Performer"
                    field="guru"
                    result={performers}
                    onChangeField={onChangeField}
                    inputValue={currentGuru}
                    setSelectedItem={setSelectedItem}
                    openNewPerformers={openNewPerformers}
                    showSpinner={showPerformerSpinner}
                    isRequired={false}
                    setSkill={setSkill}
                    setIsPerformerSelected={setIsPerformerSelected}
                    setPerformerSkills={setPerformerSkills}
                  />
                </Col>
                <Col className="position-relative">
                  <Form.Label className="labelSt">Skills</Form.Label>
                  <Form.Control
                    as="select"
                    className="formInput"
                    value={selectedSkill}
                    onChange={({ target: { value } }): void =>
                      onChangeField(value, 'skill', false)
                    }
                  >
                    <option>-Select-</option>
                    {performerSkills?.map((skill) => {
                      const mySkill = toTitleCase(skill);
                      return <option key={skill}>{mySkill}</option>;
                    })}
                  </Form.Control>
                </Col>
              </Row>
            </Col>
          </Row>
          <ActionButtonRow>
            <Centered>
              <Button onClick={addGuruName}>
                {toggleEditGuru ? 'Update' : 'Add'}
              </Button>
            </Centered>
            <Centered>
              <Button
                variant="outline-danger"
                onClick={cancelAddingGuruLineage}
              >
                Cancel
              </Button>
            </Centered>
          </ActionButtonRow>
        </>
      )}
      <div>
        {!isValidEntry && (
          <Form.Text className="text-danger">* Required</Form.Text>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div``;
const Header = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: bold;
`;
const AddButton = styled.span`
  height: 2rem;
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
  color: ${({ theme }): string => theme.white};
  outline: none;
  cursor: pointer;
  .fa {
    font-size: 20px;
    color: ${({ theme }): string => theme.primary};
  }
`;
const GuruRow = styled.div`
  display: flex;
  align-items: center;
`;

const RowAction = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 60px;
`;

const Span = styled.span`
  .fa {
    cursor: pointer;
  }
`;
const ActionButtonRow = styled.div`
  width: 220px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem 0;
`;

export default GuruEditMode;

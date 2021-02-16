/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC } from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import EditProfile from '../../../assets/images/editProfile.png';
import TrashProfile from '../../../assets/images/trashProfile.png';
import EditGrayIcon from '../../../assets/images/editGrayIcon.png';
import EditWhiteIcon from '../../../assets/images/editWhiteIcon.png';
import ContentEditor from './ContentEditor';

interface ProfileProps {
  activeMenu: string;
  editable: boolean;
  doneEdit: () => void;
  handleEditorChange: (value: string) => void;
  editContent: () => void;
  content: string;
  removeSection: () => void;
}

const ProfileContainer: FC<ProfileProps> = ({
  activeMenu,
  editable,
  doneEdit,
  handleEditorChange,
  editContent,
  content,
  removeSection,
}: ProfileProps): JSX.Element => {
  const editProfile = (): void => {
    editContent();
  };

  return (
    <Container>
      <Card className="profileCardView">
        <Card.Header as="h5" className="card-item-style">
          <TitleRow>
            <Title>{activeMenu}</Title>
            <RightActions>
              {editable ? (
                <DoneBtn onClick={doneEdit}>
                  <i className="fa fa-check-circle" />
                </DoneBtn>
              ) : (
                content?.length > 0 && (
                  <Span onClick={editContent}>
                    <EditIcon src={EditProfile} alt="edit" />
                  </Span>
                )
              )}
              <DeleteIcon
                onClick={removeSection}
                src={TrashProfile}
                alt="delete"
              />
            </RightActions>
          </TitleRow>
        </Card.Header>
        {content?.length > 0 ? (
          <Card.Body className="profileCardBody">
            {editable ? (
              <ContentEditor {...{ content, handleEditorChange }} />
            ) : (
              <div
                className="profileContent"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </Card.Body>
        ) : (
          <Card.Body className="profileCardBody">
            <>
              {editable ? (
                <ContentEditor {...{ content, handleEditorChange }} />
              ) : (
                <>
                  <EditView>
                    <EditContentIcon src={EditGrayIcon} alt="edit" />
                  </EditView>
                  <MessageTxt>
                    No data created yet. Please update this section
                    <br />
                    by clicking below button
                  </MessageTxt>

                  <EditBtnContainer>
                    <div onClick={editProfile}>
                      <EditContentButton src={EditWhiteIcon} alt="edit" />
                      <span>Enter Details</span>
                    </div>
                  </EditBtnContainer>
                </>
              )}
            </>
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 1rem;
  .profileCardView {
    border: transparent;
    border-radius: 10px;
    overflow: hidden;
    background-color: transparent;
  }
  .card-item-style {
    background-color: ${({ theme }): string => theme.black};
    padding: 16px;
    margin: 0px;
  }
  .profileCardBody {
    background-color: #ffffff;
    min-height: 300px;
  }
  .profileContent {
    color: #000000;
  }
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }): string => theme.white};
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
`;
const DoneBtn = styled.span`
  cursor: pointer;
  font-size: 0px;
  .fa {
    color: ${({ theme }): string => theme.green};
    font-size: 30px !important;
    margin-right: 10px;
  }
`;
const Span = styled.span`
  cursor: pointer;
`;
const EditIcon = styled.img`
  margin-right: 10px;
  width: 25px;
  height: 25px;
`;
const DeleteIcon = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
`;
const EditView = styled.div`
  text-align: center;
  margin-bottom: 10px;
  margin-top: 20px;
`;
const EditContentIcon = styled.img`
  margin-right: 10px;
  width: 35px;
  height: 35px;
`;
const MessageTxt = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }): string => theme.black};
`;
const EditBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    background-color: ${({ theme }): string => theme.violet};
    width: 160px;
    cursor: pointer;
    font-weight: bold;
    padding: 0.3rem 0.5rem;
    padding-left: 0.2rem;
    font-size: 14px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    span {
      font-family: Nunito;
      font-size: 18px;
      font-weight: bold;
      color: ${({ theme }): string => theme.white};
    }
  }
`;
const EditContentButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 0.5rem;
`;

export default ProfileContainer;

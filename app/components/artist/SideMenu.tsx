/* eslint-disable no-nested-ternary */
import React, { FC, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';

import VectorIcon from '../../../assets/images/vectorIcon.png';

interface SideMenuProps {
  authorized: boolean;
  isPendingProfile: boolean;
  detail: any;
  loginModal: () => void;
  logout: () => void;
  profileWithMenu: any[];
  activeMenu: string;
  setActive: (label: string, index: number) => void;
  onChangeLabel: (value: any) => void;
  newLabel: string;
  isValidLabel: boolean;
  addLabel: () => void;
  setNewLabel: (v: string) => void;
}

const SideMenu: FC<SideMenuProps> = ({
  authorized,
  isPendingProfile,
  detail,
  loginModal,
  logout,
  profileWithMenu,
  activeMenu,
  setActive,
  onChangeLabel,
  newLabel,
  isValidLabel,
  addLabel,
  setNewLabel,
}: SideMenuProps): JSX.Element => {
  const [labelModal, setLabelModal] = useState(false);
  console.log('authorized', authorized);
  const openModal = (): void => {
    setLabelModal(true);
    setNewLabel('');
  };
  const onSubmit = (): void => {
    if (newLabel.length > 0) {
      setLabelModal(false);
    }
    addLabel();
  };
  return (
    <Container>
      <LoginContainer>
        {!authorized && !isPendingProfile && (
          <LoginView>
            <span>
              Are you&nbsp;
              {detail?.name}
              &nbsp;?
            </span>
            <p>
              Manage your profile, events, schedules and activities by verifying
              here.
            </p>
          </LoginView>
        )}
        {!authorized ? (
          <CenterBlock>
            {isPendingProfile ? (
              <PendingButton>
                <span>Pending authorization</span>
              </PendingButton>
            ) : (
              <LoginButton
                onClick={loginModal}
                onKeyPress={loginModal}
                role="button"
                tabIndex={0}
              >
                <span className="badgeIcon">
                  <img src={VectorIcon} alt="bookmark" />
                </span>
                <LoginTxt>Yes I&apos;m</LoginTxt>
              </LoginButton>
            )}
          </CenterBlock>
        ) : (
          <LogoutButton
            onClick={logout}
            onKeyPress={logout}
            role="button"
            tabIndex={0}
          >
            <i className="fa fa-sign-out" />
            <LogoutTxt>Logout</LogoutTxt>
          </LogoutButton>
        )}
      </LoginContainer>
      <Hr />
      <LeftMenu>
        {profileWithMenu.map((menu: any, index: number) => {
          const label = menu?.label;
          if (label === 'Guru Lineage') return null;
          return (
            <MenuItem
              key={label}
              active={activeMenu === label}
              onClick={(): void => setActive(label, index)}
              onKeyPress={(): void => setActive(label, index)}
              role="button"
              tabIndex={index}
            >
              <span>{label}</span>
            </MenuItem>
          );
        })}
      </LeftMenu>
      {authorized && (
        <AddMenuItem
          onClick={(): void => openModal()}
          onKeyPress={(): void => openModal()}
          role="button"
          tabIndex={0}
        >
          <span>
            <i className="fa fa-plus" />
            &nbsp;Add New
          </span>
        </AddMenuItem>
      )}
      <Modal
        show={labelModal}
        onHide={(): void => setLabelModal(false)}
        backdrop="static"
        dialogClassName="modal-40w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter align-center">
            Add Menu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="lgBody">
          <EditLabelRow>
            <Form.Group>
              <Form.Control
                placeholder="Menu"
                value={newLabel}
                onChange={onChangeLabel}
              />
            </Form.Group>
            {!isValidLabel && (
              <Form.Text className="text-danger">Required</Form.Text>
            )}
            <Button onClick={onSubmit}>
              <i className="fa fa-plus-circle" />
              <span className="txt">Add</span>
            </Button>
          </EditLabelRow>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  position: relative;
  margin-right: 0;
  border-radius: 10px;
  margin: 1rem 0;
  padding: 10px;
  background-color: ${({ theme }): string => theme.black};
  @media (min-width: 768px) {
    flex: 1 1 20%;
    margin-right: 40px;
    margin: 1rem 2rem 0;
  }
  @media (min-width: 992px) {
    flex: 1 1 18%;
  }
  @media (min-width: 1500px) {
    flex: 1 1 12%;
  }
`;
const LoginContainer = styled.div`
  text-align: center;
  margin: 1rem 0 0;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LoginView = styled.div`
  position: relative;
  font-family: Nunito;
  color: ${(props): string => props.theme.white};
  span {
    font-weight: bold;
    font-size: 20px;
  }
  p {
    font-size: 14px;
  }
`;
const CenterBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PendingButton = styled.div`
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
  padding: 4px 12px;
  margin: 0.5rem 0;
  outline: none;
  width: 190px;
  background-color: ${({ theme }): string => theme.white};
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: ${({ theme }): string => theme.primary};
  }
`;

const LoginButton = styled.div`
  cursor: pointer;
  display: flex;
  background-color: ${({ theme }): string => theme.violet};
  border-radius: 25px;
  padding: 4px 12px 4px 4px;
  margin: 0.5rem 0;
  outline: none;
  flex-direction: row;
  align-items: center;
  .badgeIcon {
    background-color: ${({ theme }): string => theme.white};
    width: 25px;
    height: 25px;
    border-radius: 15px;
    display: inline-block;
    text-align: center;
    margin-right: 10px;
  }
`;
const LoginTxt = styled.div`
  color: ${({ theme }): string => theme.white};
  font-weight: bold;
  cursor: pointer;
  outline: none;
`;

const LogoutButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 25px;
  padding: 4px 12px;
  margin: 0.5rem 0;
  outline: none;
  width: 105px;
  background-color: ${({ theme }): string => theme.white};
  .fa {
    background-color: ${({ theme }): string => theme.primary};
    color: ${({ theme }): string => theme.white};
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin: 0 0.2rem;
    margin-left: -10px;
    text-align: center;
    padding: 6px 9px;
  }
`;

const LogoutTxt = styled.span`
  color: ${({ theme }): string => theme.primary};
  padding-left: 5px;
`;
const Hr = styled.div`
  margin: 1rem 0;
  border-bottom: 2px solid gray;
`;
const LeftMenu = styled.div`
  text-align: center;
  border-radius: 30px;
  padding: 0 10px;

  @media (min-width: 768px) {
    text-align: left;
    border-radius: 30px;
    padding: 0 10px;
  }
`;
const MenuItem = styled.div<{ active: boolean }>`
  padding: 1rem 0;
  color: ${({ theme }): string => theme.white};
  outline: none;
  &:hover {
    color: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
  ${({ active, theme }): string =>
    active === true
      ? `
    span {
        display: inline-block;
        width: 100%;
        color: ${theme.primary};
        font-weight: bold;
        position: relative;
    }
    `
      : ''}
`;
const AddMenu = styled.div`
  margin: 1rem 0;
  color: ${({ theme }): string => theme.yellow};
  outline: none;
  text-align: center;
  .addBtn {
    margin: 1rem 0;
  }
`;
const AddMenuItem = styled.div`
  margin: 1rem 0;
  outline: none;
  text-align: center;
  span {
    color: ${({ theme }): string => theme.yellow};
    :hover {
      color: lightblue;
      cursor: pointer;
    }
  }
`;
const EditLabelRow = styled.div`
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

export default SideMenu;

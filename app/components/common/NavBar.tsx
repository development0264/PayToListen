import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import AppStore from '../../../assets/images/appStore.png';
import PlayStore from '../../../assets/images/playStore.png';
import premium_content from '../../../assets/images/premium-content-2.png';
import VectorIcon from '../../../assets/images/vectorIcon.png';
import { actions as ArticleActions } from '../../../redux/reducers/ArticleReducer';
import { RootState } from '../../../redux/reducers/RootReducer';
import {
  ArticleInitialState,
} from '../../../model/SearchModel';

interface NavBarProps {
  logo: string;
  page?: string;
  loginModal: () => void;
  logOut?: () => void;
  logoutUser?: () => void;
  otherNavs: boolean;
  authToken: string;
}

const NavBar: FC<NavBarProps> = ({
  logo,
  loginModal,
  logOut,
  logoutUser,
  otherNavs,
  authToken
}: NavBarProps): JSX.Element => {
  // console.log("authToken", authToken);
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const articleState = useSelector(articleSelector);
  return (
    <Container>
      <Navbar expand="lg" className="fixed-top">
        <Navbar.Brand href="/">
          <Logo src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="mr-1" style={{ alignItems: 'center' }}>
            {
              articleState.currentUser.isLogin && authToken == "" ? null :
                authToken == "" ?
                  <LoginButton
                    onClick={loginModal}
                    onKeyPress={loginModal}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="badgeIcon">
                      <img src={VectorIcon} alt="bookmark" />
                    </span>
                    <LoginTxt>Login</LoginTxt>
                  </LoginButton> :
                  <LogoutButton
                    onClick={logoutUser}
                    onKeyPress={logoutUser}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="fa fa-sign-out" />
                    <LogoutTxt>Logout</LogoutTxt>
                  </LogoutButton>
            }
            {otherNavs ? (
              <>
                <AppLink
                  href="https://play.google.com/store/apps/details?id=com.bkrsllc.eppoevent"
                  rel="noopener noreferrer"
                  target="_blank"
                  role="button"
                >
                  <img src={PlayStore} alt="playStore" />
                </AppLink>
                <AppLink
                  href="https://apps.apple.com/us/app/eppo-event/id1483654084"
                  rel="noopener noreferrer"
                  target="_blank"
                  role="button"
                >
                  <img src={AppStore} alt="appStore" />
                </AppLink>
              </>
            ) : (
                <LogoutButton
                  onClick={logOut}
                  onKeyPress={logOut}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fa fa-sign-out" />
                  <LogoutTxt>Logout</LogoutTxt>
                </LogoutButton>
              )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

const Container = styled.div`
  .fixed-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.6);
  }
  .navbar {
    background-color: rgba(38, 38, 40, 1);
  }
  .navbar-toggler.collapsed {
    background-color: ${({ theme }): string => theme.white};
  }
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
const LoginButton = styled.div`
  z-index: 1;
  cursor: pointer;
  display: flex;
  background-color: ${({ theme }): string => theme.green};
  padding: 10px 20px 10px 20px;
  margin: 0.5rem 0;
  outline: none;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
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
const LogoutTxt = styled.span`
  color: ${({ theme }): string => theme.primary};
  padding-left: 5px;
`;
const Logo = styled.img`
  width: 100px;
`;
const AppLink = styled.a`
  padding: 0 0.5rem;
  text-align: center;
  margin: 0.2rem 0;
  img {
    width: 150px;
  }
`;

export default NavBar;

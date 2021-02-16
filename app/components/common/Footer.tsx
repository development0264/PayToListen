import React, { FC } from 'react';
import styled from 'styled-components';
import Logo from '../../../assets/images/flogo.png';
import SocialMedias from './SocialMedias';

const Footer: FC = (): JSX.Element => {
  return (
    <Container>
      <SocialMedias />
      <FooterContainer>
        <LeftContent>
          <Copy>
            © 2020 All Rights Reserved to
            <Nav
              href="http://bkrsllc.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              BKRS
            </Nav>
          </Copy>
        </LeftContent>
        <LogoImage src={Logo} alt="logo" />
        <RightContent>
          <NavTxt
            href="http://bkrsllc.com/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </NavTxt>
          <NavTxt href="#">Terms & Conditions</NavTxt>
        </RightContent>
      </FooterContainer>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const FooterContainer = styled.div`
  margin: 0;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
`;
const LeftContent = styled.div`
  flex: 1 1;
`;
const LogoImage = styled.img``;

const RightContent = styled.div`
  flex: 1 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;
const Copy = styled.span`
  font-family: Nunito;
  color: ${(props): string => props.theme.gray};
  font-size: 16px;
  line-height: 20px;
`;

const NavTxt = styled.a`
  font-size: 14px;
  font-family: Nunito;
  margin: 0;
  color: ${(props): string => props.theme.gray};
  font-weight: 600;
  letter-spacing: -0.13;
  padding: 0 10px;
  &:hover {
    color: ${(props): string => props.theme.primary};
    text-decoration: underline;
  }
`;
const Nav = styled.a`
  font-weight: bold;
  margin-left: 12px;
  color: ${(props): string => props.theme.primary};
  vertical-align: middle;
  &:hover {
    color: ${(props): string => props.theme.primary};
    text-decoration: underline;
  }
`;

export default Footer;

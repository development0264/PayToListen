import React, { FC } from 'react';
import styled from 'styled-components';
import Logo from '../../../assets/images/logo.png';
import SocialMedias from './SocialMedias';

const NewFooter: FC = (): JSX.Element => {
  return (
    <Container>
      <FooterContainer>
        <LogoWithSocialMedias>
          <AppLogo src={Logo} />
          <SocialMedias />
        </LogoWithSocialMedias>
        <LinksContainer>
          <FirstBlock>
            <NavTxt
              href="http://bkrsllc.com/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </NavTxt>
            <Separator>|</Separator>
            <NavTxt href="#">Terms & Conditions</NavTxt>
          </FirstBlock>
          <SecondBlock>
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
          </SecondBlock>
        </LinksContainer>
      </FooterContainer>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  height: 18rem;
  background-color: ${({ theme }): string => theme.black};
  @media (min-width: 600px) {
    height: 9rem;
  }
`;
const FooterContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  @media (min-width: 600px) {
    width: 95%;
  }
`;
const LogoWithSocialMedias = styled.div`
  padding: 1rem 0;
  height: 10rem;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 600px) {
    height: 5rem;
    flex-direction: row;
  }
`;

const AppLogo = styled.img`
  width: 90px;
`;
const LinksContainer = styled.div`
  height: 7rem;
  width: 100%;
  border-top: 1px solid gray;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start;
    height: 4rem;
  }
`;

const FirstBlock = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 600px) {
    padding: 0.5rem 0;
    justify-content: flex-start;
    align-items: center;
  }
`;
const SecondBlock = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: flex-end;
  @media (min-width: 600px) {
    padding: 0.5rem 0;
  }
`;
const NavTxt = styled.a`
  font-size: 14px;
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
const Separator = styled.span`
  margin: 0 0.5rem;
`;
const Nav = styled.a`
  font-weight: bold;
  margin-left: 12px;
  color: ${(props): string => props.theme.white};
  vertical-align: middle;
  &:hover {
    color: ${(props): string => props.theme.primary};
    text-decoration: underline;
  }
`;
const Copy = styled.span`
  font-family: Nunito;
  color: ${(props): string => props.theme.gray};
  font-size: 16px;
  line-height: 20px;
`;

export default NewFooter;

import React from 'react';
import styled from 'styled-components';
import AppStore from '../../../assets/images/appStore.png';
import PlayStore from '../../../assets/images/playStore.png';

const Link = ({
  url,
  icon,
  alt,
}: {
  url: string;
  icon: string;
  alt: string;
}): JSX.Element => {
  return (
    <AppLink
      href={url}
      rel="noopener noreferrer"
      target={url !== '#' ? '_blank' : '_self'}
      role="button"
    >
      <img src={icon} alt={alt} />
    </AppLink>
  );
};

const AppIcons = ({ playStore, appStore }): JSX.Element => {
  return (
    <Center>
      <Link {...{ url: playStore, icon: PlayStore, alt: 'playStore' }} />
      <Link {...{ url: appStore, icon: AppStore, alt: 'appStore' }} />
    </Center>
  );
};

const AppLink = styled.a`
  padding: 0 0.5rem;
  text-align: center;
  margin: 0.2rem 0;
  img {
    width: 150px;
  }
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default AppIcons;

import React, { FC } from 'react';
import styled from 'styled-components';
import { sMedias } from '../../../redux/Constants';

const SocialMedias: FC = (): JSX.Element => {
  return (
    <Container>
      {sMedias.map((media) => {
        return (
          <Link
            target="_blank"
            href={media.url}
            key={media.id.toString()}
            rel="noopener noreferrer"
          >
            <img src={media.image} alt={media.name} />
          </Link>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Link = styled.a`
  margin: 0 1rem;
  img {
    width: 40px;
    height: 40px;
  }
`;

export default SocialMedias;

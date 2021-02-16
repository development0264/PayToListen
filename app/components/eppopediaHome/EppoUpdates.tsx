/* eslint-disable global-require */
import React, { FC } from 'react';
import styled from 'styled-components';
import UpdateCard from '../common/UpdateCard';

const updates = [
  {
    id: 1,
    image: require('../../../assets/images/update_facebook.png'),
    message:
      'Missing music events in Quarantine? No worries, visit live sessions here.',
    from: 'Facebook',
    date: '28 April 2020',
    logo: require('../../../assets/images/fb.png'),
  },
  {
    id: 2,
    image: require('../../../assets/images/update_hindu.png'),
    message: 'Now, an app that ‘schedules’ your day during kutcheri season',
    from: 'The Hindu',
    date: '28 April 2020',
    logo: require('../../../assets/images/th.png'),
  },
  {
    id: 3,
    image: require('../../../assets/images/update_malar.png'),
    message: '“Eppo Event” - One stop destination for carnatic music lovers.',
    from: 'Dinamalar',
    date: '13 January 2020',
    logo: require('../../../assets/images/dm.png'),
  },
];

interface Props {
  id: string;
}

const Updates: FC<Props> = ({ id }: Props): JSX.Element => {
  return (
    <Container id={id}>
      <Title>Our Updates</Title>
      <RowContent>
        {updates.map((update) => {
          return <UpdateCard key={update.id.toString()} {...{ ...update }} />;
        })}
      </RowContent>
    </Container>
  );
};

const Container = styled.div`
  width: 87%;
  margin: 5rem auto;
  position: relative;
  color: ${({ theme }): string => theme.white};
`;
const Title = styled.h3`
  margin: 2rem 0;
  font-weight: 900;
  font-size: 28px;
`;
const RowContent = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default Updates;

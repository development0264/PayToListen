import React, { FC } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Event } from '../../../model/SearchModel';
import { chooseDummyImage } from './common';

type Props = Event & {
  openEvent: () => void;
};

const PublicEventCard: FC<Props> = ({
  image,
  name,
  startTime,
  venueDetails,
  isPaid,
  openEvent,
}: Props): JSX.Element => {
  const time = moment(startTime).format('Do MMM hh:mm A');
  const { name: venueName } = venueDetails;
  const dummyImage = chooseDummyImage('venue');
  const loadDummyImage = (e: any): any => {
    e.target.src = dummyImage;
  };
  return (
    <Container onClick={openEvent}>
      <Image src={image || dummyImage} onError={loadDummyImage} alt="eventImage" />
      <Footer>
        <EventType {...{ isPaid }} />
        <Details>
          <Title>{name}</Title>
          <SubTitle>{`${time} | ${venueName}`}</SubTitle>
        </Details>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem;
  cursor: pointer;
`;
const Image = styled.img`
  width: 100%;
  height: 65%;
  object-fit: contain;
  background-color: ${({ theme }): string => theme.black};
`;
const Footer = styled.div`
  display: flex;
  height: 35%;
  background-color: ${({ theme }): string => theme.white};
`;
const EventType = styled.div<{ isPaid: boolean }>`
  flex: 1 1 3%;
  background-color: ${({ theme, isPaid }): string =>
    isPaid ? theme.yellow : theme.green};
  margin-right: 5px;
`;
const Details = styled.div`
  display: flex;
  flex: 2 1 97%;
  flex-direction: column;
  justify-content: space-evenly;
`;
const Title = styled.h2`
  font-size: 14px;
  font-weight: bold;
  color: black;
  margin-bottom: 0;
`;
const SubTitle = styled.span`
  color: gray;
  font-size: 12px;
`;

export default PublicEventCard;

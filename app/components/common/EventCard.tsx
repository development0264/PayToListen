import React, { FC } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { Event } from '../../../model/SearchModel';
import { chooseDummyImage } from './common';
import { DummyImage } from '../../../redux/Constants';

type Props = Event & {
  openEvent: () => void;
  collection: 'performers' | 'sabhas' | 'venues';
  authorized: boolean;
  publishEvent?: (id: string) => void;
  isRequestPublish?: boolean;
};

const EventCard: FC<Props> = ({
  id,
  name,
  image,
  venueDetails,
  startTime,
  performers,
  collection,
  openEvent,
  publishEvent,
  isDraft,
  authorized,
  isRequestPublish,
}: Props): JSX.Element => {
  const dummyImage = chooseDummyImage(collection);
  const loadDefaultImage = (e: any): any => {
    e.target.src = dummyImage;
  };
  const publish = (eventId: string): void => {
    if (publishEvent) {
      publishEvent(eventId);
    }
  };
  const loadDummyImage = (e: any): any => {
    e.target.src = chooseDummyImage('venue');
  };
  return (
    <Container
      authorized={authorized}
      onClick={!authorized ? openEvent : undefined}
    >
      <Image src={image || dummyImage} onError={loadDummyImage} alt="event_image" />
      <Details>
        <Title>{name}</Title>
        <Info>
          <i className="fa fa-map-marker" />
          <Text>{venueDetails.name}</Text>
        </Info>
        <Info>
          <i className="fa fa-clock-o" />
          <Text>{moment(startTime).format('DD/MM/YYYY hh:mm A')}</Text>
        </Info>
        <Footer>
          <Accompanists>
            {Object.values(performers).map((performer) => {
              if (performer.type === 'Main') return null;
              return (
                <Artist
                  key={performer.id}
                  src={performer.image || dummyImage}
                  onError={loadDefaultImage}
                  title={performer.name}
                  alt="accompanist"
                />
              );
            })}
          </Accompanists>
          {authorized && isDraft && (
            <Button isDraft={isDraft} onClick={(): void => publish(id)}>
              <i className="fa fa-paper-plane-o" />
              Publish
              {isRequestPublish && (
                <Spinner
                  animation="grow"
                  size="sm"
                  style={{ position: 'absolute' }}
                />
              )}
            </Button>
          )}
          {authorized && (
            <Button onClick={openEvent}>
              <i className="fa fa-pencil" />
              Edit Event
            </Button>
          )}
        </Footer>
      </Details>
    </Container>
  );
};

const Container = styled.div<{ authorized: boolean }>`
  background-color: ${({ authorized }): string =>
    !authorized ? 'white' : 'rgba(59, 67, 242, 0.06)'};
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  width: 90%;
  height: 108px;
  margin: 1rem;
  position: relative;
  @media (min-width: 1270px) {
    width: 375px;
  }
  @media (min-width: 1280px) {
    margin: 0.5rem;
  }
`;
const Image = styled.img`
  margin-right: 10px;
  width: 90px;
  height: 90px;
  border-radius: 5px;
  object-fit: contain;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;
const Title = styled.h2`
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  margin-bottom: 0;
  color: black;
`;
const Info = styled.div`
  display: flex;
  .fa {
    width: 25px;
    text-align: center;
  }
`;
const Text = styled.span`
  color: #585858;
  font-size: 10px;
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;
const Accompanists = styled.div`
  width: 80%;
`;
const Button = styled.div<{ isDraft?: boolean }>`
  width: 77px;
  height: 20px;
  padding: 3px 5px;
  border-radius: 3px;
  color: #ffffff;
  font-size: 10px;
  line-height: 15px;
  background-color: #459eff;
  cursor: pointer;
  .fa {
    margin-right: 5px;
  }
  ${({ isDraft }): string =>
    isDraft
      ? `
      width: 72px;
    position: absolute;
    bottom: 30px;
    right: 5px;
  `
      : ``}
`;
const Artist = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 10px;
`;

export default EventCard;

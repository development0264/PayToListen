import React, { FC } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';
import { Event } from '../../../model/SearchModel';
import NavIcon from '../../../assets/images/navigator.png';
import VideoIcon from '../../../assets/images/videoLogo.png';
import { chooseDummyImage } from './common';

type Props = Event & {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  collection: 'performers' | 'sabhas' | 'venues';
  videoURL?: string;
};

const EventDetailModal: FC<Props> = ({
  showModal,
  setShowModal,
  image,
  name,
  videoURL,
  venueDetails,
  eventType,
  startTime,
  performers,
  collection,
}: Props): JSX.Element => {
  const location = venueDetails?.name || '';
  const coords = venueDetails?.coordinates;
  const { latitude, longitude } = coords;
  const eventTypeName = eventType?.name || '';
  const time = moment(startTime).format('Do MMM hh:mm A');
  const dummyImage = chooseDummyImage(collection);
  const loadImage = (e: any): void => {
    e.src = dummyImage;
  };
  return (
    <Modal
      show={showModal}
      onHide={(): void => setShowModal(false)}
      backdrop="static"
      dialogClassName="modal-40w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Header>
        <Modal.Header closeButton>
          <Container>
            <Image src={image} />
            <Content>
              <Title>{name}</Title>
              <Location>
                <i className="fa fa-map-marker" />
                {location}

                <Nav
                  href={
                    videoURL?.length > 0
                      ? videoURL
                      : `https://www.google.com/maps/search/?api=1&query=${latitude}, ${longitude}`
                  }
                  target="_blank"
                >
                  <NavImage
                    src={videoURL?.length > 0 ? VideoIcon : NavIcon}
                    alt="nav"
                  />
                </Nav>
              </Location>
              <EventInfo>
                <Type>{eventTypeName}</Type>
                <Time>{time}</Time>
              </EventInfo>
              <Info>Note: Please Go to Eppo Event to book tickets</Info>
              {/* <TicketRow>
                <BookTicketButton>BookTicket</BookTicketButton>
                <TicketMsg>5 Tickets Left | Selling Fast</TicketMsg>
              </TicketRow> */}
            </Content>
          </Container>
        </Modal.Header>
      </Header>
      <Modal.Body>
        <BodyTitle>Performers</BodyTitle>
        {Object.values(performers).map((performer) => {
          const { name: artistName, image: artistImage } = performer;
          return (
            <Artist key={performer.id}>
              <ArtistImage
                src={artistImage || dummyImage}
                onError={loadImage}
                alt="artist"
              />
              <ArtistName>{artistName}</ArtistName>
            </Artist>
          );
        })}
      </Modal.Body>
    </Modal>
  );
};
const Header = styled.div`
  .modal-header {
    border-bottom: 1px solid #cccccc;
  }
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  flex: 1 1 100%;
`;
const Image = styled.img`
  width: 127px;
  height: 127px;
  border-radius: 5px;
  margin-right: 10px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 127px;
`;
const Title = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: black;
  margin-bottom: 0.5rem;
`;
const Location = styled.span`
  color: #b8bbc6;
  font-size: 14px;
  margin-bottom: 0.5rem;
  .fa {
    font-size: 18px;
    margin-right: 5px;
  }
`;
const Nav = styled.a`
  margin-left: 5px;
`;
const NavImage = styled.img`
  width: 22px;
  height: 22px;
`;
const EventInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const Type = styled.span`
  background-color: ${({ theme }): string => theme.orange};
  color: ${({ theme }): string => theme.white};
  font-size: 12px;
  padding: 1px 15px;
  margin-right: 15px;
  border-radius: 12px;
`;
const Time = styled.span`
  border-left: 1px solid #585858;
  //   border-right: 1px solid #585858;
  padding: 0 15px;
  font-size: 12px;
`;
// const TicketRow = styled.div`
//   display: flex;
//   align-items: center;
// `;
// const BookTicketButton = styled.div`
//   background-color: ${({ theme }): string => theme.yellow};
//   color: ${({ theme }): string => theme.black};
//   font-size: 12px;
//   padding: 3px 10px;
//   border-radius: 15px;
//   margin-right: 15px;
// `;
// const TicketMsg = styled.span`
//   color: ${({ theme }): string => theme.orange};
//   font-size: 12px;
//   font-weight: 600;
// `;
const BodyTitle = styled.span`
  color: black;
  font-weight: 700;
  font-size: 14px;
`;
const Artist = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;
const ArtistImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 35px;
  margin-right: 10px;
`;
const ArtistName = styled.span`
  font-size: 12px;
  color: black;
  font-weight: 600;
`;
const Info = styled.p`
  font-weight: 600;
  font-size: 12px;
  lint-height: 18px;
`;
export default EventDetailModal;

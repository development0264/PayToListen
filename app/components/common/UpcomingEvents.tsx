import React, { FC, useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { RootState } from '../../../redux/reducers/RootReducer';
import {
  EventReduxState,
  Event,
  CurrentEventProps,
  SearchCollState,
  UpcomingEventsPayload,
} from '../../../model/SearchModel';
import EventCard from './EventCard';
import EventModal from '../event/EventModal';
import { actions as eventActions } from '../../../redux/reducers/EventReducer';
import PublicEventCard from './PublicEventCard';
import EventDetailModal from './EventDetailModal';

interface EventProps {
  activeMenu: string;
  createEvent: () => void;
  collection: 'performers' | 'sabhas' | 'venues';
  authorized: boolean;
  setSpinner: (v: boolean) => void;
  collectionId: string;
}

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
  className: string;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const Loader = (): JSX.Element => {
  return (
    <LoaderComponent key={0}>
      <Spinner animation="border" role="status" className="colSpinner">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </LoaderComponent>
  );
};

const UpcomingEvents: FC<EventProps> = ({
  activeMenu,
  createEvent,
  collection,
  authorized,
  setSpinner,
  collectionId,
}: EventProps): JSX.Element => {
  const dispatch = useDispatch();
  const [currentEvents, setEvent] = useState<Event[]>([]);
  const initialState: CurrentEventProps = {
    id: '',
    name: '',
    startTime: new Date(),
    endTime: new Date(),
    eventType: '',
    venue: '',
    series: '',
    performers: '',
    performerType: '',
    eventImage: '',
    videoURL: '',
    isPaid: false,
    description: '',
  };
  const [currentUserEvent, setCurrentUserEvent] = useState<CurrentEventProps>(
    initialState
  );
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [activeEvent, setActiveEvent] = useState<Event | any>();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [page, setPage] = useState<number>(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const authSelector = (state: RootState): any => state.auth;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const eventSelector = (state: RootState): EventReduxState => state.events;
  const eventState = useSelector(eventSelector);
  const authState = useSelector(authSelector);
  const collectionState = useSelector(collectionSelector);

  const { authToken } = authState;
  const {
    events,
    skills,
    eventType,
    isRequestPublish,
    hasMorePage,
    fetching,
  } = eventState;
  const { article } = collectionState;
  const {
    performer: { result: performerEvents },
    sabha: { result: sabhaEvents },
    venue: { result: venueEvents },
  } = events;
  const loadEvents = (): void => {
    switch (collection) {
      case 'performers':
        setEvent(performerEvents);
        break;
      case 'sabhas':
        setEvent(sabhaEvents);
        break;
      case 'venues':
        setEvent(venueEvents);
        break;
      default:
    }
  };
  useEffect(() => {
    loadEvents();
    setSpinner(false);
  }, [events]);

  const openEvent = (event: Event): void => {
    setActiveEvent(event);
    setShowCreate(true);
    console.log('Modal opening...', event);
  };
  const publishEvent = (id: string): void => {
    dispatch(eventActions.publishEvent(id));
  };

  const loadFunc = (): void => {
    const eventParams: UpcomingEventsPayload = {
      id: collectionId,
      collection,
      page: page + 1,
      pageSize: 20,
      authToken,
    };
    setPage((p) => p + 1);
    switch (collection) {
      case 'performers':
        dispatch(eventActions.fetchEventsByPerformer(eventParams));
        break;
      case 'sabhas':
        dispatch(eventActions.fetchEventsBySabha(eventParams));
        break;
      case 'venues':
        dispatch(eventActions.fetchEventsByVenue(eventParams));
        break;
      default:
    }
  };

  useEffect(() => {
    setEvent([]);
    loadFunc();
  }, []);

  const draftEvents = currentEvents.filter((e) => e.isDraft);
  const pubEvents = currentEvents.filter((e) => !e.isDraft);

  if (authorized) {
    return (
      <Container>
        <Card className="profileCardView">
          <Card.Header as="h5" className="card-item-style">
            <TitleRow>
              <Title>{activeMenu}</Title>
              <RightActions>
                <Button onClick={createEvent}>
                  <i className="fa fa-plus-circle" />
                  <span className="txt">Create Event</span>
                </Button>
              </RightActions>
            </TitleRow>
          </Card.Header>
          <Card.Body className="body">
            <>
              <Paper className={classes.root}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  centered
                >
                  <Tab label="Draft Events" />
                  <Tab label="Published Events" />
                </Tabs>
              </Paper>
              <TabPanel value={value} index={0} className="profileCardBody">
                {draftEvents.length > 0 ? (
                  <ListingContainer>
                    <Events>
                      {draftEvents.map((currentEvent: Event) => {
                        return (
                          <EventCard
                            key={currentEvent.id}
                            collection={collection}
                            authorized={authorized}
                            openEvent={(): void => openEvent(currentEvent)}
                            publishEvent={publishEvent}
                            {...currentEvent}
                          />
                        );
                      })}
                    </Events>

                    {hasMorePage &&
                      currentEvents.length >= 20 &&
                      (fetching ? (
                        <Loader />
                      ) : (
                        <LoadMore onClick={loadFunc}>More</LoadMore>
                      ))}
                  </ListingContainer>
                ) : (
                  <EmptyContent auth>
                    There is no more draft events
                  </EmptyContent>
                )}
              </TabPanel>
              <TabPanel value={value} index={1} className="profileCardBody">
                {pubEvents.length > 0 ? (
                  <ListingContainer>
                    <Events>
                      {pubEvents.map((currentEvent: Event) => {
                        return (
                          <EventCard
                            key={currentEvent.id}
                            {...{
                              ...currentEvent,
                              publishEvent,
                              isRequestPublish,
                              authorized,
                              collection,
                              openEvent: (): void => openEvent(currentEvent),
                            }}
                          />
                        );
                      })}
                      {hasMorePage &&
                        currentEvents.length >= 20 &&
                        (fetching ? (
                          <Loader />
                        ) : (
                          <LoadMore onClick={loadFunc}>More</LoadMore>
                        ))}
                    </Events>
                  </ListingContainer>
                ) : (
                  <EmptyContent auth>There is no more events</EmptyContent>
                )}
              </TabPanel>
            </>
          </Card.Body>
        </Card>

        <EventModal
          {...{
            showCreate,
            setShowCreate,
            isEdit: authorized,
            authorized,
            currentUserEvent,
            setCurrentUserEvent,
            initialState,
            authToken,
            eventType,
            skills,
            article,
            setSpinner,
            collectionFrom: collection,
            editEvent: activeEvent,
            eventCollction: currentEvents,
            listWidth: 90,
          }}
        />
      </Container>
    );
  }
  return (
    <>
      {currentEvents.length > 0 ? (
        <ListingContainer>
          <Events>
            {currentEvents.map((currentEvent: Event) => {
              // Published Views
              return (
                <PublicEventCard
                  key={currentEvent.id}
                  {...{
                    ...currentEvent,
                    openEvent: (): void => openEvent(currentEvent),
                  }}
                />
              );
            })}
          </Events>
          {hasMorePage &&
            currentEvents.length >= 20 &&
            (fetching ? (
              <Loader />
            ) : (
              <LoadMore onClick={loadFunc}>More</LoadMore>
            ))}
        </ListingContainer>
      ) : (
        <EmptyContent>There is no more events</EmptyContent>
      )}
      {showCreate && (
        <EventDetailModal
          {...{
            ...activeEvent,
            collection,
            showModal: showCreate,
            setShowModal: setShowCreate,
          }}
        />
      )}
    </>
  );
};

const Events = styled.div`
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    // justify-content: space-between;
    flex-direction: row;
    align-items: stretch;
  }
`;

const ListingContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  position: relative;
`;

const Container = styled.div`
  margin-bottom: 1rem;
  .profileCardView {
    border: transparent;
    border-radius: 10px;
    overflow: hidden;
    background-color: transparent;
  }
  .card-item-style {
    background-color: ${({ theme }): string => theme.black};
    padding: 16px;
    margin: 0px;
  }
  .body {
    background-color: #ffffff;
  }
  .profileCardBody {
    background-color: #ffffff;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    overflow-y: auto;
    @media (min-width: 1270px) {
      justify-content: space-between;
      flex-direction: row;
      align-items: stretch;
    }
  }
  .profileContent {
    color: #000000;
  }
  .body.card-body {
    padding: 1.25rem 0.2rem;
  }
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }): string => theme.white};
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
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
const EmptyContent = styled.p<{ auth?: boolean }>`
  width: 100%;
  text-align: center;
  position: relative;
  color: ${({ auth }): string => (auth ? 'black' : 'white')};
`;
const LoaderComponent = styled.div`
  width: 100%;
  color: white;
  font-size: 20;
  text-align: center;
`;
const LoadMore = styled.span`
  text-align: center;
  position: absolute;
  align-self: center;
  color: white;
  cursor: pointer;
  left: 50%;
  padding: 5px;
  background-color: ${({ theme }): string => theme.primary};
  border-radius: 5px;
`;
export default UpcomingEvents;

/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

import AppContainer from '../components/common/AppContainer';
import EppopediaNavBar from '../components/eppopediaHome/NavBar';
import Footer from '../components/common/Footer';
import {
  SearchCollState,
  EventReduxState,
  CurrentEventProps,
  ArticleInitialState,
} from '../../model/SearchModel';
import { RootState } from '../../redux/reducers/RootReducer';
import { actions as eventActions } from '../../redux/reducers/EventReducer';
import NotFound from './NotFound';
import EventModal from '../components/event/EventModal';
import NewFooter from '../components/common/NewFooter';

const EventCalendar: FC = (): JSX.Element => {
  const location: {
    pathname: string;
    state: {
      from: 'performers' | 'sabhas' | 'venues';
      item: any;
    };
  } = useLocation();
  const { pathname } = location;
  //   const collectionFrom = location?.state?.from;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const authSelector = (state: RootState): any => state.auth;
  const eventSelector = (state: RootState): EventReduxState => state.events;

  const fcCalendar = useRef<FullCalendar>(null);
  const dispatch = useDispatch();
  const collectionState = useSelector(collectionSelector);
  const authState = useSelector(authSelector);
  const articleState = useSelector(
    (state: { article: ArticleInitialState }) => state.article
  );
  const eventState = useSelector(eventSelector);
  const { currentCollection: collectionFrom } = articleState;

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
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editEvent, setEditEvent] = useState<Event | any>();
  const [showSpinner, setSpinner] = useState(false);
  const [eventCollction, setEventCollection] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const { article } = collectionState;
  const { authToken } = authState;
  const { events, eventType, skills, createdEvent, fetching } = eventState;
  const {
    performer: performerEvents,
    sabha: sabhaEvents,
    venue: venueEvents,
  } = events;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getCollection = (coll: any): any[] => {
    return coll.map((perf) => {
      const { id, name, startTime, endTime } = perf;
      return {
        id,
        title: name,
        start: moment(startTime).format(),
        end: moment(endTime).format(),
        data: perf,
      };
    });
  };

  const createEventCollection = (): void => {
    switch (collectionFrom) {
      case 'performers': {
        const eData = getCollection(performerEvents.result);
        setEventCollection(eData);
        break;
      }
      case 'sabhas': {
        const eData = getCollection(sabhaEvents.result);
        setEventCollection(eData);
        break;
      }
      case 'venues': {
        const eData = getCollection(venueEvents.result);
        setEventCollection(eData);
        break;
      }
      default:
    }
  };

  useEffect(() => {
    if (eventType.length === 0) {
      dispatch(eventActions.fetchEventType());
    }
    if (skills.length === 0) {
      dispatch(eventActions.fetchSkills());
    }
  }, []);

  useEffect(() => {
    createEventCollection();
    if (fetching) {
      setSpinner(true);
    } else {
      setSpinner(false);
    }
  }, [events, createdEvent, fetching]);

  const updateCurrentRange = (): void => {
    setSpinner(true);
    setTimeout(() => {
      if (fcCalendar.current) {
        const { activeStart, activeEnd } = fcCalendar.current?.getApi().view;
        const startDate = moment(activeStart).format('YYYY-MM-DD');
        const endDate = moment(activeEnd).format('YYYY-MM-DD');
        setDateRange({
          startDate,
          endDate,
        });
      }
    }, 500);
  };

  const watchPrevNext = (): void => {
    const prevEle = document.querySelector('.fc-prev-button');
    const nextEle = document.querySelector('.fc-next-button');
    nextEle?.addEventListener('click', updateCurrentRange);
    prevEle?.addEventListener('click', updateCurrentRange);
  };

  const fetchEvents = (): void => {
    const allEventsParam = {
      collection: collectionFrom,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      id: article?.result?.id,
      authToken,
    };
    switch (collectionFrom) {
      case 'performers':
        dispatch(eventActions.fetchEventByPerformerRange(allEventsParam));
        break;
      case 'sabhas':
        dispatch(
          eventActions.fetchEventBySabhaRange({
            ...allEventsParam,
            collection: 'sabhas',
          })
        );
        break;
      case 'venues':
        dispatch(
          eventActions.fetchEventByPerformerRange({
            ...allEventsParam,
            collection: 'venues',
          })
        );
        break;
      default:
    }
  };

  useEffect(() => {
    watchPrevNext();
  }, []);

  useEffect(() => {
    if (dateRange.startDate.length > 0 && dateRange.endDate.length > 0) {
      fetchEvents();
    }
  }, [dateRange]);

  const onSelectDate = (e: any): void => {
    const startStr = e?.startStr;
    const endStr = e?.endStr;
    const viewType = e?.view?.type;
    let sDate = moment(startStr);
    let eDate = moment(endStr);
    if (viewType === 'dayGridMonth') {
      const hrs = moment().hours();
      const mins = moment().minutes();
      sDate = moment(startStr).add({
        hours: hrs,
        minutes: mins + 30,
        seconds: 0,
      });
      eDate = moment(startStr).add({
        hour: hrs + 2,
        minutes: mins + 30,
        seconds: 0,
      });
    }
    const startTime = new Date(sDate.format());
    const endTime = new Date(eDate.format());
    const currentDateTime = moment().valueOf();
    const choosenStartTime = sDate.valueOf();
    if (choosenStartTime > currentDateTime) {
      setCurrentUserEvent({ ...currentUserEvent, startTime, endTime });
      setEdit(false);
      setShowCreate(true);
    } else {
      alert('Past date time is not allowed');
    }
  };

  const onEventClick = (arg): void => {
    setEditEvent(arg.event.extendedProps.data);
    setShowCreate(true);
    setEdit(true);
  };
  const renderEvent = (event): JSX.Element => {
    const isPaid = event.event?.extendedProps?.data?.isPaid;
    const classStr = isPaid ? 'paidEvent' : 'freeEvent';
    return (
      <div className={classStr}>
        &nbsp;
        <b style={{ color: '#ffffff' }}>{event.timeText}</b>
        &nbsp;
        <span>{event.event.title}</span>
      </div>
    );
  };

  const calendarDidMount = (arg: any): void => {
    const { activeStart, activeEnd } = arg.view;
    setDateRange({
      startDate: moment(activeStart).format('YYYY-MM-DD'),
      endDate: moment(activeEnd).format('YYYY-MM-DD'),
    });
  };

  if (!collectionFrom) {
    return <NotFound />;
  }

  return (
    <div>
      <AppContainer />
      {/* <EppopediaNavBar /> */}
      <CalendarContainer>
        {showSpinner && (
          <SpinnerContainer>
            <Spinner animation="border" role="status" className="spin">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </SpinnerContainer>
        )}
        <Container>
          <TitleContainer>
            <h2>{article?.result?.name}</h2>
          </TitleContainer>
          <FullCalendar
            // height={window.outerHeight * 0.95}
            ref={fcCalendar}
            selectable
            customButtons={{
              newEvent: {
                text: 'Create',
                icon: 'fa-plus-circle',
              },
            }}
            headerToolbar={{
              left: 'timeGridWeek,dayGridMonth',
              center: 'prev,title,next',
              right: '',
            }}
            themeSystem="bootstrap"
            plugins={[
              dayGridPlugin,
              bootstrapPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            eventAdd={(arg): void => {
              //   console.log('event add..', arg);
            }}
            // dateClick={onSelectDate}
            events={eventCollction}
            eventClick={onEventClick}
            select={onSelectDate}
            eventContent={renderEvent}
            eventBackgroundColor="rgba(208, 203, 125, 0.2)"
            eventBorderColor="rgb(208, 203, 125)"
            viewDidMount={calendarDidMount}
          />
        </Container>
        <EventModal
          {...{
            showCreate,
            setShowCreate,
            isEdit,
            authorized: true,
            currentUserEvent,
            authToken,
            setCurrentUserEvent,
            eventType,
            skills,
            article,
            initialState,
            collectionFrom,
            editEvent,
            eventCollction,
            setSpinner,
          }}
        />
        <NewFooter />
      </CalendarContainer>
    </div>
  );
};

const Container = styled.div`
  width: 87%;
  margin: 0 auto;
`;
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
  min-height: 100vh;
  margin-top: 7rem;
  color: ${({ theme }): string => theme.white};
  .fc.fc-media-screen.fc-direction-ltr.fc-theme-bootstrap {
    height: 100%;
  }
  @media (max-width: 768px) {
    min-height: 50vh;
    .fc.fc-media-screen.fc-direction-ltr.fc-theme-bootstrap {
      height: 500px;
    }
  }
  .fc {
    margin: 1rem 0;
  }
  .fc-view-harness {
    background-color: ${({ theme }): string => theme.black};
  }
  .fc-toolbar-chunk:nth-child(1) {
    z-index: 99;
  }
  .fc-toolbar-chunk:nth-child(2) {
    width: 87%;
    text-align: center;
    position: absolute;
  }
  .fc-toolbar-chunk div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
  }
  .fc-prev-button.btn-primary,
  .fc-next-button.btn-primary {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .fc-prev-button.btn-primary:not(:disabled):not(.disabled):active,
  .fc-next-button.btn-primary:not(:disabled):not(.disabled):active {
    color: ${({ theme }): string => theme.yellow};
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .fc-timeGridWeek-button.btn.btn-primary,
  .fc-dayGridMonth-button.btn.btn-primary {
    background-color: transparent;
    border-color: #efefef;
    color: #a8b2b9;
  }

  .fc-timeGridWeek-button.btn.btn-primary:hover,
  .fc-dayGridMonth-button.btn.btn-primary:hover {
    box-shadow: 1px 2px 3px #efefef;
  }
  .btn-primary:not(:disabled):not(.disabled):active,
  .btn-primary:not(:disabled):not(.disabled).active {
    background-color: ${({ theme }): string => theme.black};
    border-color: #efefef;
    color: ${({ theme }): string => theme.white};
  }
  .btn-primary:not(:disabled):not(.disabled).active:focus,
  .btn-primary:focus {
    box-shadow: none;
  }
  .fc-daygrid-dot-event {
    overflow: hidden;
  }
  .react-datetime-picker {
    width: 100%;
  }
  .freeEvent {
    background-color: rgba(88, 203, 125, 0.2);
    color: ${({ theme }): string => theme.darkGreen};
    border-left: 3px solid ${({ theme }): string => theme.darkGreen};
    width: 100%;
    word-break: break-all;
  }
  .paidEvent {
    background-color: rgba(254, 184, 0, 0.2);
    color: ${({ theme }): string => theme.yellow};
    border-left: 3px solid ${({ theme }): string => theme.yellow};
  }
  .fc-daygrid-day:hover,
  .fc-daygrid-event-harness:hover {
    cursor: pointer;
  }
`;
const SpinnerContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9999;
  .spin {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 60px;
    width: 60px;
    margin: 0px auto;
    z-index: 99999;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    flex: 1 1;
    text-align: center;
  }
`;
const Empty = styled.div`
  display: flex;
  flex: 1 1;
`;

export default EventCalendar;

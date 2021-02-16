/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, useRef, FC } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import _ from 'lodash';
import styled from 'styled-components';
import DropDownList from '../common/DropDownList';
import PerformerDND from './PerformerDND';
import { RootState } from '../../../redux/reducers/RootReducer';
import { actions as eventActions } from '../../../redux/reducers/EventReducer';
import {
  ArticleInitialState,
  PerformerDetail,
  EventType,
  Sabha,
  VenueDetail,
  CurrentEventProps,
  SkillProp,
  NewEventObj,
  EditEventObj,
  EditEventParams,
  NewEventParams,
} from '../../../model/SearchModel';
import {
  chooseDummyImage,
  isValidHttpUrl,
  uploadToCloud,
} from '../common/common';

import { actions as articleActions } from '../../../redux/reducers/ArticleReducer';
import NewPerformerModal from './NewPerformerModal';
import NewSeriesModal from './NewSeriesModal';
import NewVenueModal from './NewVenueModal';
import { SelectedPerformer } from '../../../model/contentModel';

interface Selected {
  performer: PerformerDetail;
  skill: string;
  type: string;
}

interface EventModalProps {
  showCreate: boolean;
  setShowCreate: (value: boolean) => void;
  isEdit: boolean;
  authorized: boolean;
  currentUserEvent: CurrentEventProps;
  setCurrentUserEvent: (value: CurrentEventProps) => void;
  authToken: string;
  eventType: EventType[];
  skills: SkillProp[];
  article: any;
  initialState: CurrentEventProps;
  collectionFrom: 'performers' | 'sabhas' | 'venues';
  editEvent: Event | any;
  eventCollction: any[];
  setSpinner: (value: boolean) => void;
  listWidth?: number;
}

const EventModal: FC<EventModalProps> = ({
  showCreate,
  setShowCreate,
  isEdit,
  authorized,
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
  listWidth = 80,
}: EventModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const imageUploader = useRef<HTMLInputElement>(null);
  const [performers, setPerformers] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [selectedSkill, setSkill] = useState<string>('');
  const [selectedPerfCount, setSelectedPerfCount] = useState<number>(0);
  const [isPerformerSelected, setIsPerformerSelected] = useState<boolean>(
    false
  );
  const [showNewPerformerModal, setTogglePerformerModal] = useState<boolean>(
    false
  );
  const [showNewSeriesModal, setToggleSeriesModal] = useState<boolean>(false);
  const [showNewVenueModal, setToggleVenueModal] = useState<boolean>(false);
  const [showPerformerSpinner, setPSpinner] = useState<boolean>(false);
  const [showSeriesSpinner, setSSpinner] = useState<boolean>(false);
  const [showVenueSpinner, setVSpinner] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<PerformerDetail>();
  const [selectedSeries, setSelectedSeries] = useState<Sabha>();
  const [selectedVenue, setSelectedVenue] = useState<VenueDetail>();
  const [selectedPerformers, setSelectedPerformers] = useState<
    SelectedPerformer[]
  >([]);
  const [isValidSDate, setValidSDate] = useState<boolean>(true);
  const [isValidEDate, setValidEDate] = useState<boolean>(true);
  const [isValidDates, setValidDates] = useState<boolean>(true);
  const [isValidVenue, setValidVenue] = useState<boolean>(true);
  const [selectedEType, setEventType] = useState<EventType>();
  const [useLink, setUseLink] = useState<boolean>(false);

  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const articleState = useSelector(articleSelector);
  const {
    performerSearch,
    currentUser,
    seriesSearch,
    venueSearch,
  } = articleState;

  const dummyImage: string = chooseDummyImage(collectionFrom);

  useEffect(() => {
    setPerformers(performerSearch);
    if (performerSearch.length > 0) {
      setPSpinner(false);
    }
  }, [performerSearch]);

  useEffect(() => {
    setSeries(seriesSearch);
    if (seriesSearch.length > 0) {
      setSSpinner(false);
    }
  }, [seriesSearch]);

  useEffect(() => {
    setVenues(venueSearch);
    if (venueSearch.length > 0) {
      setVSpinner(false);
    }
  }, [venueSearch]);

  const loadDummyImage = (e: any): any => {
    e.target.src = dummyImage;
  };

  const onChangeField = (
    value: string | boolean,
    field: string,
    fetch = true
  ): void => {
    const update = { ...currentUserEvent, [field]: value };
    const params = {
      collection: 'performers',
      key: value,
      page: 1,
      pageSize: 10,
      authToken,
      order: 'asc',
      view: false,
    };
    setCurrentUserEvent(update);
    if (fetch) {
      if (field === 'performers') {
        dispatch(articleActions.fetchPerformers(params));
        setSkill('');
      } else if (field === 'venue') {
        dispatch(
          articleActions.fetchVenues({ ...params, collection: 'venues' })
        );
      } else if (field === 'series') {
        dispatch(
          articleActions.fetchSeries({ ...params, collection: 'sabhas' })
        );
      }
    }
    if (field === 'eventType') {
      const eventTypeObject = eventType.find((et) => et.title === value);
      if (eventTypeObject) {
        setEventType(eventTypeObject);
      }
    }
    if (field === 'skill' && typeof value === 'string') {
      setSkill(value);
    }
  };

  const removePerformer = (id: string): void => {
    const selectedIndex = selectedPerformers?.findIndex(
      (perf) => perf.performer.id === id
    );
    selectedPerformers.splice(selectedIndex, 1);
    setSelectedPerfCount((c) => c - 1);
  };

  const addPerformer = (): void => {
    setSelectedPerformers((perf) => {
      if (selectedItem) {
        const item = {
          performer: selectedItem,
          skill: selectedSkill,
          type: currentUserEvent.performerType,
        };
        if (currentUserEvent.performerType === 'Main') {
          setCurrentUserEvent({ ...currentUserEvent, name: selectedItem.name });
        }
        const inPerf = selectedPerformers?.findIndex((artist) => {
          return artist.performer.id === selectedItem.id;
        });
        const isNotMainPerf = selectedPerformers?.findIndex((artist) => {
          return artist.type === 'Main';
        });
        if (inPerf === -1) {
          if (
            isNotMainPerf === -1 ||
            currentUserEvent.performerType === 'Accompanist'
          ) {
            perf.push(item);
          } else {
            alert('Already main performer added');
          }
        } else {
          selectedPerformers.splice(inPerf, 1, item);
        }
      }
      return perf;
    });
    setCurrentUserEvent({
      ...currentUserEvent,
      performers: '',
      performerType: '',
    });
    setSkill('');
    setSelectedPerfCount((c) => c + 1);
    setSelectedItem(undefined);
  };

  const selectPerformer = (id: string): void => {
    const obj = selectedPerformers.find((ps) => ps.performer.id === id);
    setIsPerformerSelected(true);
    if (obj) {
      setSelectedItem(obj.performer);
      setSkill(obj.skill);
      setCurrentUserEvent({
        ...currentUserEvent,
        performers: obj.performer.name,
        performerType: obj.type,
      });
    }
  };

  const sortedEventType = eventType.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  const clearState = (): void => {
    setCurrentUserEvent(initialState);
    setSelectedItem(undefined);
    setSkill('');
    setSelectedSeries(undefined);
    setSelectedVenue(undefined);
    setEventType(undefined);
    setSelectedPerfCount(0);
    setSelectedPerformers([]);
    setValidSDate(true);
    setValidEDate(true);
    setValidVenue(true);
    setValidDates(true);
  };

  const setInitialValues = (): void => {
    const mainColl = article?.result;
    const initObj = {
      startTime: currentUserEvent.startTime,
      endTime: currentUserEvent.endTime,
      eventImage: article?.result?.image || dummyImage,
    };
    switch (collectionFrom) {
      case 'performers': {
        const firstArtist: SelectedPerformer[] = [
          { performer: mainColl, skill: mainColl?.skill[0], type: 'Main' },
        ];
        setSelectedPerformers(firstArtist);
        // setEventCount(0);
        setCurrentUserEvent({
          ...initialState,
          ...initObj,
          name: article?.result?.name,
        });
        break;
      }
      case 'sabhas':
        setCurrentUserEvent({
          ...initialState,
          ...initObj,
          series: mainColl?.name,
        });
        setSelectedSeries(mainColl);
        break;
      case 'venues':
        setCurrentUserEvent({
          ...initialState,
          ...initObj,
          venue: mainColl?.name,
        });
        setSelectedVenue(mainColl);
        break;
      default:
    }
  };

  const setEditModal = (): void => {
    if (editEvent) {
      const {
        name,
        series: seriesCol,
        venueDetails: venue,
        startTime,
        endTime,
        isPaid,
        image,
        eventType: eType,
        performers: performersObj,
        id,
        videoURL,
        description,
      } = editEvent;
      const performerValues = performersObj ? Object.values(performersObj) : [];
      const selectedPerfs = performerValues.map((perf: any) => ({
        performer: perf,
        type: perf?.type,
        skill: perf?.skill[0] || '',
      }));
      setSelectedPerformers(selectedPerfs);
      setSelectedPerfCount(selectedPerfs.length);
      setSelectedVenue(venue);
      setSelectedSeries(seriesCol);
      setEventType(eType);
      const currentEvent = {
        ...currentUserEvent,
        id,
        name,
        description,
        series: seriesCol?.name || '',
        venue: venue?.name || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isPaid: isPaid || false,
        eventImage: image || dummyImage,
        eventType: eType?.name || eType?.title || '',
        videoURL,
      };
      setCurrentUserEvent(currentEvent);
    }
  };

  useEffect(() => {
    clearState();
    if (isEdit && showCreate) {
      setEditModal();
    } else {
      setInitialValues();
    }
  }, [showCreate, article, isEdit]);

  const readFile = (e: any): void => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev: any): void => {
        setCurrentUserEvent({
          ...currentUserEvent,
          eventImage: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const inRange = (x: number, min: number, max: number): boolean =>
    (x - min) * (x - max) <= 0;

  const validateTime = (
    starttime: number,
    endtime: number,
    eventsColl: any[]
  ): boolean => {
    if (eventsColl.length === 0) {
      return true;
    }
    const isPresent = eventsColl.find((event: any) => {
      const startms = moment(event?.start).valueOf();
      const endms = moment(event?.end).valueOf();
      if (
        inRange(starttime, startms, endms) ||
        inRange(endtime, startms, endms)
      ) {
        if (isEdit && currentUserEvent?.id === event?.id) {
          return false;
        }
        return true;
      }
      return false;
    });
    // console.log('Is  present...', isPresent);
    if (isPresent === undefined) {
      return true;
    }
    return false;
  };

  const createOrUpdateEvent = (): void => {
    const performerIds = selectedPerformers.map((perf) => perf.performer.id);
    const performersColl = selectedPerformers.reduce((acc: any, cur, i) => {
      if (cur?.performer?.views) delete cur?.performer?.views;
      acc[cur.performer.id] = {
        ...cur.performer,
        type: cur?.type,
        skill: [cur?.skill],
        sortIndex: i + 1,
      };
      return acc;
    }, {});
    const lat = selectedVenue?.coordinates?.latitude;
    const long = selectedVenue?.coordinates?.longitude;
    const endTime = moment(currentUserEvent.endTime).valueOf();
    const startTime = moment(currentUserEvent.startTime).valueOf();

    const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
    const longitude = typeof long === 'string' ? parseFloat(long) : long;
    const eventVenue = {};
    const eventEventType = {};
    const eventSeries = {};
    if (selectedSeries) {
      const { id, image, name } = selectedSeries;
      Object.assign(eventSeries, { id, image, name });
    }
    if (selectedVenue) {
      const { city, id, name, image } = selectedVenue;
      Object.assign(eventVenue, { city, id, name, image });
    }
    if (selectedEType) {
      if (selectedEType?.title) {
        const { id, name, image } = {
          ...selectedEType,
          name: selectedEType?.title,
        };
        Object.assign(eventEventType, { id, name, image });
      } else {
        Object.assign(eventEventType, selectedEType);
      }
    }
    const eventParams: NewEventObj = {
      latitude: latitude || 0,
      longitude: longitude || 0,
      description: currentUserEvent.description,
      endTime,
      eventType: eventEventType,
      image: currentUserEvent.eventImage || '',
      name: currentUserEvent.name || '',
      performerIds,
      performers: performersColl,
      series: eventSeries,
      startTime,
      venue: eventVenue,
      isPaid: currentUserEvent.isPaid || false,
      videoURL: currentUserEvent.videoURL || '',
      isDraft: true,
    };
    const payload: NewEventParams = {
      eventParams,
      collectionFrom,
      authToken,
    };

    const editEventParams: EditEventObj = {
      ...eventParams,
      id: currentUserEvent.id,
      modifiedUser: currentUser.email || 'test@mail.com',
    };
    const editPayload: EditEventParams = {
      editEventParams,
      collectionFrom,
      authToken,
    };

    // console.log('params... ..s', payload);
    const isValidStartDate = typeof startTime === 'number';
    const isValidEndDate = typeof endTime === 'number';
    const isFutureStartTime = !isEdit ? startTime > moment().valueOf() : true; // checking create event only in future
    const isStartandEnd9mins = endTime - startTime > 9 * 1000 * 60;
    const isValidDate = isStartandEnd9mins && isFutureStartTime; // 9 Minutes difference and future time only
    const isValidVenueStr = selectedVenue !== undefined;
    if (isValidStartDate) {
      setValidSDate(true);
    } else {
      setValidSDate(false);
    }
    if (isValidDate) {
      setValidDates(true);
    } else {
      setValidDates(false);
    }
    if (isValidEndDate) {
      setValidEDate(true);
    } else {
      setValidEDate(false);
    }
    if (isValidVenueStr) {
      setValidVenue(true);
    } else {
      setValidVenue(false);
    }
    const isValidDateTime = validateTime(startTime, endTime, eventCollction);
    if (!isValidDateTime) {
      alert('Event already in this time range');
    }
    if (
      isValidStartDate &&
      isValidEndDate &&
      isValidVenueStr &&
      isValidDate &&
      isValidDateTime
    ) {
      if (
        !currentUserEvent?.eventImage?.includes('cloudinary') &&
        isValidHttpUrl(currentUserEvent.eventImage)
      ) {
        uploadToCloud(currentUserEvent.eventImage, 'Event', ({ secureUrl }) => {
          if (isEdit) {
            dispatch(
              eventActions.updateEvent({
                ...editPayload,
                editEventParams: { ...editEventParams, image: secureUrl },
              })
            );
          } else {
            dispatch(
              eventActions.createNewEvent({
                ...payload,
                eventParams: { ...eventParams, image: secureUrl },
              })
            );
          }
        });
      } else if (isEdit) {
        dispatch(eventActions.updateEvent(editPayload));
      } else {
        dispatch(eventActions.createNewEvent(payload));
      }
      setShowCreate(false);
      setSpinner(true);
    }
  };

  const addNewPerformer = (params: any): void => {
    // console.log('AddPerfomer', params);
    if (params?.image?.length > 0) {
      uploadToCloud(params.image, 'Performers', ({ secureUrl }) => {
        dispatch(
          eventActions.addPerformer({
            collection: 'Performer',
            fields: { ...params, image: secureUrl || '' },
          })
        );
      });
    } else {
      dispatch(
        eventActions.addPerformer({
          collection: 'Performer',
          fields: params,
        })
      );
    }
    setTogglePerformerModal(false);
    setPSpinner(true);
  };
  const addNewSeries = (params: any): void => {
    // console.log('AddSeries', params);
    if (params?.image?.length > 0) {
      uploadToCloud(params.image, 'Series', ({ secureUrl }) => {
        dispatch(
          eventActions.addSeries({
            collection: 'Series',
            fields: { ...params, image: secureUrl || '' },
          })
        );
      });
    } else {
      dispatch(
        eventActions.addSeries({
          collection: 'Series',
          fields: params,
        })
      );
    }
    setToggleSeriesModal(false);
    setSSpinner(true);
  };
  const addNewVenue = (params: any): void => {
    // console.log('AddVenue', params);
    const { coordinates } = params;
    const [lat, long] = coordinates.split(', ');
    const newCoord = { latitude: parseFloat(lat), longitude: parseFloat(long) };
    if (params.image.length > 0) {
      uploadToCloud(params.image, 'Venue', ({ secureUrl }) => {
        dispatch(
          eventActions.addVenue({
            collection: 'Venue',
            fields: {
              ...params,
              coordinates: newCoord,
              image: secureUrl || '',
            },
          })
        );
      });
    } else {
      dispatch(
        eventActions.addVenue({
          collection: 'Venue',
          fields: { ...params, coordinates: newCoord },
        })
      );
    }
    setToggleVenueModal(false);
    setVSpinner(true);
  };

  const openNewPerformers = (): void => {
    setTogglePerformerModal(true);
  };
  const openNewSeries = (): void => {
    setToggleSeriesModal(true);
  };
  const openNewVenues = (): void => {
    setToggleVenueModal(true);
  };

  const changeImage = (): void => {
    if (imageUploader !== null) {
      imageUploader?.current?.click();
    }
  };

  const isFutureTime =
    moment(currentUserEvent.startTime).valueOf() > moment().valueOf();

  const disableDateTime = isEdit && !isFutureTime;

  const formatedSkill = _.chain(skills)
    .map((value) => _.capitalize(value.name))
    .sort()
    .value();

  const toggleLink = (): void => {
    setUseLink((link) => !link);
  };

  const removeLink = (): void => {
    setCurrentUserEvent({ ...currentUserEvent, eventImage: '' });
  };

  return (
    <Container>
      <Modal
        show={showCreate}
        onHide={(): void => setShowCreate(false)}
        backdrop="static"
        dialogClassName="modal-70w"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-center w-100"
          >
            {authorized ? (
              <h3>{`${isEdit ? 'Update' : 'Create'}`} Event</h3>
            ) : (
              <h3>{currentUserEvent.name}</h3>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pendingBody">
          <Label>Event Image</Label>
          <ImageRow>
            <EventImage
              id="eventImage"
              src={currentUserEvent.eventImage}
              alt="eventImage"
              onError={loadDummyImage}
            />
            <TextColumn>
              <UploadTxt onClick={changeImage}>Change Image</UploadTxt>
              <span>or</span>
              <UploadTxt onClick={toggleLink}>Upload Link</UploadTxt>
              <FileUpload
                type="file"
                ref={imageUploader}
                accept="image/png,image/jpg,image/jpeg"
                onChange={readFile}
              />
            </TextColumn>
          </ImageRow>

          {useLink && (
            <ImageLink>
              <Form.Control
                placeholder="Event Image"
                className="formInput w-100"
                value={currentUserEvent.eventImage}
                onChange={({ target: { value } }): void =>
                  onChangeField(value, 'eventImage')
                }
              />
              {currentUserEvent.eventImage.length > 0 && (
                <Remove onClick={removeLink}>x</Remove>
              )}
            </ImageLink>
          )}
          <FieldRow>
            <DateBlock style={{ marginRight: '0.5rem' }}>
              <Label>
                Start Date & Time&nbsp;
                <span className="text-danger">*</span>
              </Label>
              <DateTimePicker
                disabled={disableDateTime}
                format="dd/MM/yyyy hh:mm a"
                onChange={(value): void => onChangeField(value, 'startTime')}
                value={currentUserEvent.startTime}
              />
              {!isValidSDate && (
                <Form.Text className="text-danger">Required</Form.Text>
              )}
            </DateBlock>
            <DateBlock>
              <Label>
                End Date & Time &nbsp;
                <span className="text-danger">*</span>
              </Label>
              <DateTimePicker
                disabled={disableDateTime}
                format="dd/MM/yyyy hh:mm a"
                onChange={(value): void => onChangeField(value, 'endTime')}
                value={currentUserEvent.endTime}
              />
              {!isValidEDate && (
                <Form.Text className="text-danger">Required</Form.Text>
              )}
            </DateBlock>
          </FieldRow>
          {!isValidDates && (
            <Form.Text className="text-danger">
              Please select valid dates
            </Form.Text>
          )}
          <FieldRow>
            <DropDownList
              label="Performer(s)"
              field="performers"
              result={performers}
              onChangeField={onChangeField}
              inputValue={currentUserEvent.performers}
              setSelectedItem={setSelectedItem}
              openNewPerformers={openNewPerformers}
              showSpinner={showPerformerSpinner}
              isRequired={false}
              setSkill={setSkill}
              listWidth={listWidth}
              setIsPerformerSelected={setIsPerformerSelected}
            />
          </FieldRow>
          <FieldRow>
            <Column style={{ marginRight: 10 }}>
              <Label>Skills</Label>
              <Form.Control
                as="select"
                className="formInput"
                value={selectedSkill}
                onChange={({ target: { value } }): void =>
                  onChangeField(value, 'skill')
                }
              >
                <option>-Select-</option>
                {skills?.length > 0 &&
                  formatedSkill.map((skill: string) => {
                    return <option key={skill}>{skill}</option>;
                  })}
              </Form.Control>
            </Column>
            <Column>
              <FieldRow>
                <PerfomerColumn>
                  <Label>Performer Type</Label>
                  <Form.Control
                    as="select"
                    className="formInput"
                    value={currentUserEvent.performerType}
                    onChange={({ target: { value } }): void =>
                      onChangeField(value, 'performerType')
                    }
                  >
                    <option>-Select-</option>
                    <option value="Accompanist">Accompanist</option>
                    <option value="Main">Main</option>
                  </Form.Control>
                </PerfomerColumn>
                <ButtonColum>
                  {currentUserEvent?.performers?.length !== 0 &&
                    currentUserEvent?.performerType?.length !== 0 && (
                      <AddPerformerButton
                        role="button"
                        tabIndex={0}
                        onKeyDown={addPerformer}
                        onClick={addPerformer}
                      >
                        <i
                          className={`fa ${
                            isPerformerSelected
                              ? 'fa-check-circle'
                              : 'fa-plus-circle'
                          }`}
                        />
                      </AddPerformerButton>
                    )}
                </ButtonColum>
              </FieldRow>
            </Column>
          </FieldRow>
          <PerformerDND
            {...{
              selectedPerformers,
              setSelectedPerformers,
              selectPerformer,
              removePerformer,
              DummyImage: dummyImage,
              currentArtist: article?.result,
            }}
          />
          <FieldItem>
            <Label>Event Name</Label>
            <Form.Control
              className="formInput w-100"
              value={currentUserEvent.name}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'name')
              }
            />
          </FieldItem>
          <FieldItem>
            <Label>Event Type</Label>
            <Form.Control
              as="select"
              className="formInput"
              value={currentUserEvent.eventType}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'eventType')
              }
            >
              <option value="">-Select-</option>
              {sortedEventType.map((et) => {
                return (
                  <option value={et.title} key={et.title}>
                    {et.title}
                  </option>
                );
              })}
            </Form.Control>
          </FieldItem>
          <FieldItem>
            <DropDownList
              label="Venue"
              field="venue"
              result={venues}
              onChangeField={onChangeField}
              inputValue={currentUserEvent.venue}
              openNewVenues={openNewVenues}
              selectedVenue={setSelectedVenue}
              showSpinner={showVenueSpinner}
              listWidth={listWidth}
              isRequired
            />
            {!isValidVenue && (
              <Form.Text className="text-danger">Required</Form.Text>
            )}
          </FieldItem>
          <FieldItem>
            <DropDownList
              label="Series"
              field="series"
              result={series}
              onChangeField={onChangeField}
              inputValue={currentUserEvent.series}
              openNewSeries={openNewSeries}
              showSpinner={showSeriesSpinner}
              selectedSeries={setSelectedSeries}
              isRequired={false}
              listWidth={listWidth}
            />
          </FieldItem>
          <FieldItem>
            <Label>Video URL</Label>
            <Form.Control
              className="formInput w-100"
              value={currentUserEvent.videoURL}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'videoURL')
              }
            />
          </FieldItem>
          <FieldItem>
            <Label>Description</Label>
            <Form.Control
              className="formInput w-100"
              as="textarea"
              rows={3}
              value={currentUserEvent.description}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'description')
              }
            />
          </FieldItem>
          <FieldItem>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                checked={currentUserEvent.isPaid}
                onChange={({ target: { checked } }): void =>
                  onChangeField(checked, 'isPaid')
                }
                label="Paid"
              />
            </Form.Group>
          </FieldItem>
        </Modal.Body>
        {authorized && (
          <Modal.Footer className="mdFooter">
            <Footer>
              <Button onClick={createOrUpdateEvent} variant="warning">
                {`${isEdit ? 'Update' : 'Create'}`}
              </Button>
            </Footer>
          </Modal.Footer>
        )}
      </Modal>
      <NewPerformerModal
        visible={showNewPerformerModal}
        toggleVisible={setTogglePerformerModal}
        addPerformer={addNewPerformer}
        skills={skills}
        inputValue={currentUserEvent.performers}
      />
      <NewSeriesModal
        visible={showNewSeriesModal}
        toggleVisible={setToggleSeriesModal}
        addSeries={addNewSeries}
        inputValue={currentUserEvent.series}
      />
      <NewVenueModal
        visible={showNewVenueModal}
        toggleVisible={setToggleVenueModal}
        addVenue={addNewVenue}
        inputValue={currentUserEvent.venue}
      />
    </Container>
  );
};

const Container = styled.div``;
const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
`;
const ImageRow = styled.div`
  display: flex;
`;
const TextColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 250px;
  margin-left: 5px;
`;
const Separator = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 5%;
`;
const ImageLink = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;
const EventImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const FileUpload = styled.input`
  display: none;
`;
const UploadTxt = styled.small`
  color: ${({ theme }): string => theme.darkGreen};
  cursor: pointer;
  display: inline-block;
`;
const FieldRow = styled.div`
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1;
`;
const DateBlock = styled.div`
  flex: 1 1;
`;
const Column = styled.div`
  flex: 1 1;
`;
const PerfomerColumn = styled.div`
  flex: 10 1;
  margin-right: 10px;
`;
const ButtonColum = styled.div`
  flex: 1 1;
  justify-content: center;
  align-items: cetner;
  display: flex;
  margin-top: 28px;
`;
const AddPerformerButton = styled.span`
  .fa {
    font-size: 25px;
    color: #29cc5e;
    cursor: pointer;
  }
`;
const FieldItem = styled.div`
  margin: 0.5rem 0;
`;
const Footer = styled.div`
  button {
    font-weight: bold;
    padding: 0.375rem 1.5rem;
  }
`;

const Remove = styled.span`
  cursor: pointer;
  position: absolute;
  right: 35px;
  width: 15px;
  text-align: center;
  background-color: white;
  color: ${({ theme }): string => theme.primary};
`;

export default EventModal;

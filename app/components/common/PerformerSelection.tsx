import React, { useState, useEffect, FC } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import DropDownList from './DropDownList';
import PerformerDND from '../event/PerformerDND';
import NewPerformerModal from '../event/NewPerformerModal';
import { RootState } from '../../../redux/reducers/RootReducer';
import {
  ArticleInitialState,
  EventReduxState,
  SearchCollState,
  PerformerDetail,
} from '../../../model/SearchModel';
import { actions as articleActions } from '../../../redux/reducers/ArticleReducer';
import { uploadToCloud } from './common';
import { actions as eventActions } from '../../../redux/reducers/EventReducer';
import { PerformerData, SelectedPerformer } from '../../../model/contentModel';

interface PerformerSelectionProps {
  currentPerformerData: PerformerData;
  setCurrentPerformerData: (value: PerformerData) => void;
  selectedPerformers: SelectedPerformer[];
  setSelectedPerformers: any;
  isEdit?: boolean;
  dummyImage?: string;
}

const PerformerSelection: FC<PerformerSelectionProps> = ({
  currentPerformerData,
  setCurrentPerformerData,
  selectedPerformers,
  setSelectedPerformers,
  isEdit,
  dummyImage,
}: PerformerSelectionProps): JSX.Element => {
  const dispatch = useDispatch();
  const [performers, setPerformers] = useState<any[]>([]);
  const [selectedSkill, setSkill] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PerformerDetail>();
  const [isPerformerSelected, setIsPerformerSelected] = useState<boolean>(
    false
  );
  const [showNewPerformerModal, setTogglePerformerModal] = useState(false);
  //   const initialState = {
  //     performers: '',
  //     performerType: '',
  //   };
  const [showPerformerSpinner, setPSpinner] = useState(false);

  const authSelector = (state: RootState) => state.auth;
  const eventSelector = (state: RootState): EventReduxState => state.events;
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const authState = useSelector(authSelector);
  const eventState = useSelector(eventSelector);
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const collectionState = useSelector(collectionSelector);
  const articleState = useSelector(articleSelector);
  const { authToken } = authState;
  const { skills } = eventState;
  const { performerSearch, currentCollection } = articleState;
  const { article } = collectionState;

  useEffect(() => {
    if (!isEdit && currentCollection === 'performers') {
      const mainColl = article?.result;
      const firstArtist = [
        { performer: mainColl, skill: mainColl?.skill[0], type: 'Main' },
      ];
      setSelectedPerformers(firstArtist);
    }
  }, []);

  useEffect(() => {
    setPerformers(performerSearch);
    if (performerSearch.length > 0) {
      setPSpinner(false);
    }
  }, [performerSearch]);

  const onChangeField = (value: string, field: string, fetch = true): void => {
    const update = { ...currentPerformerData, [field]: value };
    const params = {
      collection: 'performers',
      key: value,
      page: 1,
      pageSize: 10,
      authToken,
      order: 'asc',
      view: false,
    };
    setCurrentPerformerData(update);
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
    if (field === 'skill') {
      setSkill(value);
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

  const removePerformer = (id: string): void => {
    const selectedIndex = selectedPerformers?.findIndex(
      (perf) => perf.performer.id === id
    );
    selectedPerformers.splice(selectedIndex, 1);
  };

  const addPerformer = (): void => {
    setSelectedPerformers((perf: SelectedPerformer[]): any => {
      if (selectedItem) {
        const item = {
          performer: selectedItem,
          skill: selectedSkill,
          type: currentPerformerData.performerType,
        };
        const inPerf = selectedPerformers?.findIndex((artist) => {
          return artist.performer.id === selectedItem.id;
        });
        if (inPerf === -1) {
          perf.push(item);
        } else {
          selectedPerformers.splice(inPerf, 1, item);
        }
      }
      return perf;
    });
    setCurrentPerformerData({
      ...currentPerformerData,
      performers: '',
      performerType: '',
    });
    setSkill('');
    // setSelectedPerfCount((c) => c + 1);
    setSelectedItem(undefined);
  };

  const selectPerformer = (id: string): void => {
    const obj = selectedPerformers.find((ps) => ps.performer.id === id);
    setIsPerformerSelected(true);
    if (obj) {
      setSelectedItem(obj.performer);
      setSkill(obj.skill);
      setCurrentPerformerData({
        ...currentPerformerData,
        performers: obj.performer.name,
        performerType: obj.type,
      });
    }
  };

  const openNewPerformers = (): void => {
    setTogglePerformerModal(true);
  };

  const formatedSkill = _.chain(skills)
    .map((value) => _.capitalize(value.name))
    .sort()
    .value();

  return (
    <>
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
      <FieldRow>
        <DropDownList
          label="Performer(s)"
          field="performers"
          result={performers}
          onChangeField={onChangeField}
          inputValue={currentPerformerData.performers}
          setSelectedItem={setSelectedItem}
          openNewPerformers={openNewPerformers}
          showSpinner={showPerformerSpinner}
          isRequired={false}
          setSkill={setSkill}
          listWidth={87}
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
              formatedSkill.map((skill) => {
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
                value={currentPerformerData.performerType}
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
              {currentPerformerData?.performers?.length !== 0 &&
                currentPerformerData?.performerType?.length !== 0 && (
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
      <NewPerformerModal
        visible={showNewPerformerModal}
        toggleVisible={setTogglePerformerModal}
        addPerformer={addNewPerformer}
        skills={skills}
        inputValue={currentPerformerData.performers}
      />
    </>
  );
};

const FieldRow = styled.div`
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1;
`;
const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
`;
const Column = styled.div`
  flex: 1 1;
`;
const AddPerformerButton = styled.span`
  .fa {
    font-size: 25px;
    color: #29cc5e;
    cursor: pointer;
  }
`;
const ButtonColum = styled.div`
  flex: 1 1;
  justify-content: center;
  align-items: cetner;
  display: flex;
  margin-top: 28px;
`;
const PerfomerColumn = styled.div`
  flex: 10 1;
  margin-right: 10px;
`;

export default PerformerSelection;

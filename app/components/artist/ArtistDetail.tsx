/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Image, Row, Modal, Col, Form } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styled from 'styled-components';
import TreeView from '../common/TreeView';

import PerformerCard from './PerformerCard';
import SabhaCard from './SabhaCard';
import VenueCard from './VenueCard';
import { RootState } from '../../../redux/reducers/RootReducer';
import { actions } from '../../../redux/reducers/ArticleReducer';
import { actions as eventActions } from '../../../redux/reducers/EventReducer';
import {
  SetContentParams,
  ArticleInitialState,
  UpdateSkillParams,
  GuruLineageParams,
  PerformerDetail,
  EventReduxState,
} from '../../../model/SearchModel';
import { checkAuthorizedProfile } from '../../../utils/services';
import ProfileContainer from '../common/ProfileContainer';
import SocialMediaContainer from '../common/SocialMediaContainer';
import { socialMediaImages } from '../../../redux/Constants';
import NewPerformerModal from '../event/NewPerformerModal';
import { uploadToCloud, toTitleCase } from '../common/common';
import SideMenu from './SideMenu';
import DropDownList from '../common/DropDownList';
import UpcomingEvents from '../common/UpcomingEvents';
import UploadedAlbums from '../common/UploadedAlbums';
import PastEvents from '../common/PastEvents';

interface Props {
  detail: any;
  from?: 'performers' | 'sabhas' | 'venues';
  loginModal: () => void;
  collectionId: string;
  logout: () => void;
  authToken: string;
  authorized: boolean;
  setSpinner: (v: boolean) => void;
}

interface SocialMediaProps {
  id: number;
  name: string;
  url: string;
}

const ArtistDetail: FC<Props> = ({
  detail,
  from,
  loginModal,
  collectionId,
  logout,
  authorized,
  authToken,
  setSpinner,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [editable, setEditable] = useState<boolean>(false);
  const [profileWithMenu, setProfileWithMenu] = useState<any[]>([]);
  const [content, setContent] = useState<string>('');
  const [currentMenuIndex, setMenuIndex] = useState<number>(0);
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [section, setSection] = useState<string>('section1');
  const [sections, setSections] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<any>();
  const [socialMedia, setSocialMedia] = useState<SocialMediaProps[]>();
  const [isValidLabel, setValidLabel] = useState<boolean>(true);
  const [isValidSkill, setValidSkill] = useState<boolean>(true);
  const [isSkillEditable, setEditSkill] = useState(false);
  const initialGuruLineage: { guru: any[]; shishya: any[] } = {
    guru: [],
    shishya: [],
  };

  //   Guru lineage states
  const [performers, setPerformers] = useState<any[]>([]);
  const [currentGuru, setCurrentGuru] = useState<string>('');
  const [togglePerformerModal, setTogglePerformerModal] = useState<boolean>(
    false
  );
  const [showPerformerSpinner, setPSpinner] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PerformerDetail>();
  const [isPerformerSelected, setIsPerformerSelected] = useState<boolean>(
    false
  );
  const [selectedSkill, setSkill] = useState<string>('');
  const [performerSkills, setPerformerSkills] = useState<any[]>([]);
  const [showGuruModal, setShowGuruModal] = useState<boolean>(false);
  const [skillModal, setSkillModal] = useState(false);
  const [showAlbumDetail, setAlbumDetail] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);

  const initialMedias = {
    facebook: {
      id: 1,
      mediaId: '',
      url: 'https://www.facebook.com/',
    },
    instagram: {
      id: 2,
      mediaId: '',
      url: 'https://www.instagram.com/',
    },
    twitter: {
      id: 3,
      mediaId: '',
      url: 'https://www.twitter.com/',
    },
    youtube: {
      id: 4,
      url: 'https://www.youtube.com/watch?v=',
      mediaId: '',
    },
  };
  const [socialMediaLinks, setSocialMediaLinks] = useState(initialMedias);
  const [guruLineages, setGuruLineage] = useState(initialGuruLineage);
  const [showGuruEntry, setShowGuruEntry] = useState<boolean>(false);
  const [toggleEditGuru, setToggleEditGuru] = useState<boolean>(false);
  const [editGuruIndex, setEditGuruIndex] = useState<any>();
  const [isValidEntry, setValidEntry] = useState(true);

  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const eventSelector = (state: RootState): EventReduxState => state.events;
  const articleState: ArticleInitialState = useSelector(articleSelector);
  const eventState = useSelector(eventSelector);
  const {
    performerProfile,
    sabhaProfile,
    venueProfile,
    pendingProfile,
    currentGuruShishyas,
    performerSearch,
  } = articleState;

  const { skills } = eventState;
  useEffect(() => {
    setGuruLineage(currentGuruShishyas);
    setSpinner(false);
  }, [currentGuruShishyas]);

  useEffect(() => {
    if (skills.length === 0) {
      dispatch(eventActions.fetchSkills());
    }
    dispatch(actions.clearProfile);
    setProfileWithMenu([]);
  }, []);

  useEffect(() => {
    setContent('');
    setSocialMedia([]);
    setSocialMediaLinks(initialMedias);
  }, [collectionId]);

  const checkIsAuthorized = async (): Promise<void> => {
    const resp = await checkAuthorizedProfile({
      collection: from,
      id: collectionId,
    });
    const hasInCollection = resp?.find((data: any) =>
      data.email?.includes(pendingProfile?.data?.email)
    );
    if (hasInCollection && from) {
      dispatch(actions.clearPendingProfile());
      dispatch(
        actions.userLoginRequest({
          id: collectionId,
          email: pendingProfile?.data?.email || 'user@mail.com',
          collection: from,
          isAdmin: false,
        })
      );
    }
  };

  useEffect(() => {
    if (
      collectionId !== '' &&
      pendingProfile !== null &&
      pendingProfile?.data?.userId === collectionId
    ) {
      checkIsAuthorized();
    }
  }, []);

  useEffect(() => {
    setPerformers(performerSearch);
    if (performerSearch.length > 0) {
      setPSpinner(false);
    }
  }, [performerSearch]);

  const updateSocialMediaLinks = (): void => {
    const sMediaLinks = JSON.stringify(socialMediaLinks);
    const mediaLinks = JSON.parse(sMediaLinks);
    socialMedia?.forEach((media) => {
      const key = media?.name?.toLowerCase();
      let urlId = media?.url.includes('http')
        ? media?.url.substr(media?.url.lastIndexOf('/') + 1)
        : media?.url;
      urlId = urlId.includes('=')
        ? urlId.substr(urlId.lastIndexOf('=') + 1)
        : urlId;
      mediaLinks[key].mediaId = urlId;
    });
    setSocialMediaLinks(mediaLinks);
  };

  useEffect(() => {
    updateSocialMediaLinks();
  }, [socialMedia]);

  const setActive = (label: string, index: number): any => {
    setActiveMenu(label);
    setAlbumDetail(false);
    setEditable(false);
    const selectedSection = sections[index];
    setSection(selectedSection);
    const obj = profileWithMenu.find((pro) => pro.label === label);
    // if (label === 'Guru Lineage') {
    //   setSpinner(true);
    //   dispatch(actions.fetchGuruShishyas({ id: collectionId }));
    // }
    if (obj !== undefined) {
      switch (obj.label) {
        case 'Social media':
          setSocialMedia(obj.links);
          break;
        case 'Upcoming events':
          setContent('');
          break;
        default:
          setContent(obj.content);
          setMenuIndex(index);
          setSocialMedia([]);
          setGuruLineage(initialGuruLineage);
      }
    }
  };

  const handleEditorChange = (data: string): void => {
    setContent(data);
  };

  const editContent = (): void => {
    setEditable(true);
  };

  const doneEditGuruLineage = (): void => {
    setEditable(false);
  };

  const doneEdit = (): void => {
    const profileParams: SetContentParams = {
      section,
      content,
      from,
      id: collectionId,
      label: activeMenu,
    };
    dispatch(actions.setContent(profileParams));
    setSpinner(true);
    setEditable(false);
  };
  const menuEntries = (): void => {
    let collection: any = performerProfile;
    switch (from) {
      case 'performers':
        collection = performerProfile;
        break;
      case 'sabhas':
        collection = sabhaProfile;
        break;
      case 'venues':
        collection = venueProfile;
        break;
      default:
        collection = performerProfile;
    }
    const ordered: { [key: string]: any } = {};
    if (collection?.id) {
      //   console.log('current collection..', collection);
      setCurrentProfile(collection);
      Object.keys(collection)
        .sort()
        .forEach((key) => {
          ordered[key] = collection[key];
        });
      const values: any[] = Object.values(ordered);
      const keys: string[] = Object.keys(ordered);
      const finalKeys = keys
        .map((val) => (/section\d/.test(val) ? val : ''))
        .filter((v) => v !== '');
      const finalValues = values
        .map((val) => (val?.label ? val : ''))
        .filter((v) => v !== '');
      setProfileWithMenu(finalValues);
      const menuItem = finalValues.find(
        (finalValue) => finalValue.label === activeMenu
      );
      let lastSection =
        activeMenu !== '' ? menuItem || finalValues[0] : finalValues[0];
      if (lastSection) {
        switch (activeMenu) {
          case 'Guru Lineage':
            lastSection = finalValues[1] || '';
            //   setGuruLineage(initialGuruLineage);
            //   dispatch(actions.fetchGuruShishyas({ id: collectionId }));
            break;
          case 'Social media':
            setSocialMedia(lastSection.links);
            break;
          default:
            setContent(lastSection?.content);
        }
        setActiveMenu(lastSection?.label);
        setSection(section);
        setSections(finalKeys);
      }
    }
  };

  useEffect(() => {
    menuEntries();
    setSpinner(false);
  }, [performerProfile, sabhaProfile, venueProfile]);

  const onChangeLabel = (e: any): void => {
    const {
      target: { value },
    } = e;
    setNewLabel(value);
  };

  const addLabel = (): void => {
    const lastSectionNo: number =
      sections?.length === 0
        ? 1
        : parseInt(sections[sections?.length - 1].split('section')[1], 10);
    const sectionLabel = `section${lastSectionNo + 1}`;
    const addMenuParams: SetContentParams = {
      section: sectionLabel,
      content: `<p>${newLabel}</p>`,
      from,
      id: collectionId,
      label: newLabel,
    };
    if (newLabel.length > 0) {
      setValidLabel(true);
      dispatch(actions.addMenu(addMenuParams));
      setSpinner(true);
    } else {
      setValidLabel(false);
    }
  };

  const confirmRemoveSection = (): void => {
    const removeParams = {
      profileId: currentProfile?.id,
      fieldId: collectionId,
      collection: from,
      section: sections[currentMenuIndex],
    };
    dispatch(actions.removeProfileSection(removeParams));
    setSpinner(true);
  };

  const customAlert = ({ title, message, proceedAction }): void => {
    confirmAlert({
      customUI: ({ onClose }: { onClose: () => void }): JSX.Element => {
        const style = {
          background: '#3B43F2',
          color: 'white',
          padding: '4px 12px',
        };
        return (
          <div className="custom-ui">
            <h2>{title}</h2>
            <p>{message}</p>
            <ActionButtons>
              <Button
                style={style}
                onClick={(): void => {
                  proceedAction();
                  onClose();
                }}
              >
                Yes
              </Button>
              <Button onClick={onClose} style={style}>
                No
              </Button>
            </ActionButtons>
          </div>
        );
      },
    });
  };

  const removeSection = (): void => {
    customAlert({
      title: 'Confirm to Remove',
      message: `Are you sure to remove "${activeMenu}" ?`,
      proceedAction: confirmRemoveSection,
    });
  };

  useEffect(() => {
    if (skillModal) {
      setValidSkill(true);
    }
  }, [skillModal]);

  const addSkill = (skill: string): void => {
    if (skill.length > 0) {
      setValidSkill(true);
      const addSkillParam: UpdateSkillParams = {
        id: collectionId,
        isNew: true,
        skill,
      };
      dispatch(actions.updateSkills(addSkillParam));
      setEditSkill(false);
      setSkillModal(false);
    } else {
      setValidSkill(false);
      setSkillModal(true);
    }
  };

  const toggleSkill = (): void => {
    setEditSkill(!isSkillEditable);
  };

  const removeSkill = (skill: string): void => {
    customAlert({
      title: 'Confirm to Remove',
      message: `Are you sure to remove "${skill}" ?`,
      proceedAction: (): void => {
        const addSkillParam: UpdateSkillParams = {
          id: collectionId,
          isNew: false,
          skill,
        };
        dispatch(actions.updateSkills(addSkillParam));
      },
    });
  };

  const isPendingProfile: boolean =
    pendingProfile !== null && pendingProfile?.data?.userId === collectionId;

  const mediaUrl = (name: string): any => {
    return socialMediaImages.find((sm) => sm.name === name)?.image || '';
  };

  const saveMediaIds = (): void => {
    const linkData = socialMedia?.map((media) => {
      const mediaObj = socialMediaLinks[media?.name?.toLowerCase()];
      const mediaURL = `${mediaObj.url}${mediaObj.mediaId}`;
      return { ...media, url: mediaURL };
    });
    const mediaParams = {
      section,
      from,
      id: collectionId,
      linkData,
    };
    dispatch(actions.updateSocialMedia(mediaParams));
    setSpinner(true);
  };

  const clearGuruFields = (): void => {
    setEditGuruIndex(undefined);
    setPerformers([]);
    setSelectedItem(undefined);
    setCurrentGuru('');
    setIsPerformerSelected(false);
    setPerformerSkills([]);
    setToggleEditGuru(false);
    setValidEntry(true);
  };

  const addGuruName = (): void => {
    const params: GuruLineageParams = {
      shishya: collectionId,
      guru: selectedItem?.id,
      skill: [selectedSkill],
      isVerified: false,
    };
    const isValid = currentGuru?.length > 0;
    if (isValid && selectedItem?.id) {
      setShowGuruEntry(false);
      setToggleEditGuru(false);
      setSpinner(true);
      if (toggleEditGuru) {
        dispatch(
          actions.updateMyGuru({
            params,
            id: guruLineages?.guru[editGuruIndex]?.id,
          })
        );
        clearGuruFields();
      } else {
        dispatch(actions.addGuruLineage(params));
      }
      setShowGuruModal(false);
    } else {
      setValidEntry(false);
    }
  };

  const onChangeField = (value: string, field: string, fetch = true): void => {
    switch (field) {
      case 'guru':
        setCurrentGuru(value);
        break;
      case 'skill':
        setSkill(value);
        break;
      default:
    }
    const params = {
      collection: 'performers',
      key: value,
      page: 1,
      pageSize: 10,
      authToken,
      order: 'asc',
      view: false,
    };

    if (fetch) {
      dispatch(actions.fetchPerformers(params));
      setSkill('');
    }
  };

  const openNewPerformers = (): void => {
    setTogglePerformerModal(true);
  };

  const editGuru = (i: number): void => {
    setToggleEditGuru(true);
    setShowGuruModal(true);
    setEditGuruIndex(i);
    const editingPerformer = guruLineages.guru[i]?.guruDetails;
    setPerformers([editingPerformer]);
    setSelectedItem(editingPerformer);
    setCurrentGuru(editingPerformer?.name);
    setIsPerformerSelected(true);
    setPerformerSkills(editingPerformer?.skill);
  };

  useEffect(() => {
    if (!showGuruModal) {
      clearGuruFields();
    }
  }, [showGuruModal]);

  const deleteGuru = (guruObj: {
    guruDetails: { id: string; name: string };
    id: string;
  }): void => {
    confirmAlert({
      title: 'Confirm to Remove',
      message: `Are you sure to remove "${guruObj.guruDetails.name}".`,
      buttons: [
        {
          label: 'Yes',
          onClick: (): void => {
            dispatch(actions.deleteMyGuru(guruObj));
            setSpinner(true);
          },
        },
        {
          label: 'No',
          onClick: (): void => console.log('Click No'),
        },
      ],
    });
  };

  const approveShisya = (params: { id: string; approve: boolean }): void => {
    dispatch(actions.updateShisyaApproval(params));
  };
  const removeApproval = (params: { id: string; approve: boolean }): void => {
    dispatch(actions.updateShisyaApproval(params));
  };

  const addNewPerformer = (params: any): void => {
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

  const createEvent = (): void => {
    history.push({
      pathname: `/createEvent`,
      state: { from },
    });
  };

  const createAlbum = (): void => {
    setShowAlbumModal(true);
  };

  const renderEditableContent = (): JSX.Element => {
    switch (activeMenu) {
      case 'Past events': {
        return (
          <PastEvents
            {...{
              activeMenu,
              createEvent,
              authorized,
              setSpinner,
              collectionId,
              collection: from,
            }}
          />
        );
      }
      case 'Upcoming events': {
        return (
          <UpcomingEvents
            {...{
              activeMenu,
              createEvent,
              authorized,
              setSpinner,
              collectionId,
              collection: from,
            }}
          />
        );
      }
      case 'Uploaded albums': {
        return (
          <UploadedAlbums
            {...{
              activeMenu,
              createAlbum,
              authorized,
              setSpinner,
              collectionId,
              setAlbumDetail,
              showAlbumDetail,
              showAlbumModal,
              setShowAlbumModal,
              collection: from,
            }}
          />
        );
      }
      case 'Guru Lineages': {
        // revert back set 'Guru Lineage'
        return (
          <>
            <TreeView
              {...{
                guruLineages,
                setShowGuruModal,
                editGuru,
                deleteGuru,
                approveShisya,
                removeApproval,
                edit: true,
              }}
            />
            <Modal
              show={showGuruModal}
              onHide={(): void => setShowGuruModal(false)}
              backdrop="static"
              dialogClassName="modal-40w"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter align-center">
                  Add Guru
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="lgBody">
                <Row>
                  <Col xs={12}>
                    <Row>
                      <Col>
                        <DropDownList
                          label="Performer"
                          field="guru"
                          result={performers}
                          onChangeField={onChangeField}
                          inputValue={currentGuru}
                          setSelectedItem={setSelectedItem}
                          openNewPerformers={openNewPerformers}
                          showSpinner={showPerformerSpinner}
                          isRequired={false}
                          setSkill={setSkill}
                          setIsPerformerSelected={setIsPerformerSelected}
                          setPerformerSkills={setPerformerSkills}
                        />
                      </Col>
                      <Col className="position-relative">
                        <Form.Label className="labelSt">Skills</Form.Label>
                        <Form.Control
                          as="select"
                          className="formInput"
                          value={selectedSkill}
                          onChange={({ target: { value } }): void =>
                            onChangeField(value, 'skill', false)
                          }
                        >
                          <option>-Select-</option>
                          {performerSkills?.map((skill) => {
                            const mySkill = toTitleCase(skill);
                            return <option key={skill}>{mySkill}</option>;
                          })}
                        </Form.Control>
                      </Col>
                    </Row>
                    {!isValidEntry && (
                      <Form.Text className="text-danger">Required</Form.Text>
                    )}
                  </Col>
                </Row>

                <Button onClick={addGuruName}>
                  <i className="fa fa-plus-circle" />
                  <span className="txt">
                    {editGuruIndex !== undefined ? 'Update' : 'Add'}
                  </span>
                </Button>
              </Modal.Body>
            </Modal>
          </>
        );
      }
      case 'Social media':
        return (
          <SocialMediaContainer
            {...{
              label: activeMenu,
              removeSection,
              setSocialMediaLinks,
              socialMediaLinks,
              saveMediaIds,
            }}
          />
        );
      default:
        return (
          <ProfileContainer
            {...{
              activeMenu,
              editable,
              doneEdit,
              handleEditorChange,
              editContent,
              content,
              removeSection,
            }}
          />
        );
    }
  };

  const renderContent = (): JSX.Element => {
    switch (activeMenu) {
      case 'Past events': {
        return (
          <PastEvents
            {...{
              activeMenu,
              createEvent,
              authorized,
              setSpinner,
              collectionId,
              collection: from,
            }}
          />
        );
      }
      case 'Upcoming events': {
        return (
          <UpcomingEvents
            {...{
              activeMenu,
              createEvent,
              authorized,
              setSpinner,
              collectionId,
              collection: from,
            }}
          />
        );
      }
      case 'Uploaded albums': {
        return (
          <UploadedAlbums
            {...{
              activeMenu,
              createAlbum,
              authorized,
              setSpinner,
              collectionId,
              setAlbumDetail,
              showAlbumDetail,
              collection: from,
            }}
          />
        );
      }
      case 'Guru Lineages': {
        // revert back set 'Guru Lineage'
        return <TreeView {...{ guruLineages, edit: false }} />;
      }
      case 'Social media': {
        return (
          <>
            {socialMedia &&
              socialMedia.map((medias) => {
                let urlId = medias?.url.includes('http')
                  ? medias?.url.substr(medias?.url.lastIndexOf('/') + 1)
                  : medias?.url;
                urlId = urlId.includes('=')
                  ? urlId.substr(urlId.lastIndexOf('=') + 1)
                  : urlId;
                return (
                  urlId?.length > 0 && (
                    <MediaContainer key={medias.id}>
                      <MediaView>
                        <Image src={mediaUrl(medias.name)} alt="social" />
                      </MediaView>
                      <MediaLink
                        target="_blank"
                        href={medias.url}
                        rel="noopener noreferrer"
                      >
                        {medias.url}
                      </MediaLink>
                    </MediaContainer>
                  )
                );
              })}
          </>
        );
      }
      default:
        return <RenderContent dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  return (
    <Container>
      <RowContainer>
        <SideMenu
          {...{
            authorized,
            isPendingProfile,
            detail,
            loginModal,
            logout,
            profileWithMenu,
            activeMenu,
            setActive,
            onChangeLabel,
            newLabel,
            isValidLabel,
            addLabel,
            setNewLabel,
          }}
        />
        <Main>
          {from === 'performers' && (
            <PerformerCard
              {...{
                detail,
                authorized,
                addSkill,
                removeSkill,
                isValidSkill,
                isSkillEditable,
                toggleSkill,
                activeMenu,
                setActive,
                skillModal,
                setSkillModal,
              }}
            />
          )}
          {from === 'sabhas' && (
            <SabhaCard {...{ detail, authorized, activeMenu, setActive }} />
          )}
          {from === 'venues' && (
            <VenueCard {...{ detail, authorized, setActive, activeMenu }} />
          )}
          {authorized ? renderEditableContent() : renderContent()}
        </Main>
      </RowContainer>
      <NewPerformerModal
        visible={togglePerformerModal}
        toggleVisible={setTogglePerformerModal}
        addPerformer={addNewPerformer}
        skills={skills}
        inputValue={currentGuru}
      />
    </Container>
  );
};

ArtistDetail.defaultProps = {
  from: 'performers',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-self: stretch;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: auto;
  width: 88%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 5 1 60%;
`;
const MediaContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;
const MediaView = styled.div`
  margin: 1rem 0 !important;
  img {
    width: 30px;
    height: 30px;
  }
`;
const MediaLink = styled.a`
  margin: 0.5rem;
  color: ${(props): string => props.theme.primary};
`;
const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${(props): string => props.theme.violet};
  border-radius: 25px;
  padding: 5px 12px 4px 4px;
  outline: none;
  margin: 1rem 0;
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
const RenderContent = styled.div`
  position: relative;
  color: ${({ theme }): string => theme.white};
  margin-top: 1rem;
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export default ArtistDetail;

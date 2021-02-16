import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { usePendingProfiles } from '../../hooks/usePendingProfiles';
import AppContainer from '../components/common/AppContainer';
import EppopediaNavBar from '../components/eppopediaHome/NavBar';
import NotFound from './NotFound';
import Profiles from '../components/artist/Profiles';
import { Tab, Tabs } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';

const PendingProfiles = () => {
  const location = useLocation();
  const isAuth = (location?.state as any)?.authorized;
  const [currentKey, setCurrentKey] = useState<string>('Performers');
  const {
    performers,
    sabhas,
    venues,
    updateAuth,
    updateAuthorization,
  } = usePendingProfiles({ isAuth });
  console.log('Location..', sabhas, updateAuth);
  if (!isAuth) {
    return <NotFound />;
  }

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
  return (
    <Container>
      <AppContainer />
      <EppopediaNavBar />
      <Main>
        <Tabs
          id="controlled-tab-example"
          activeKey={currentKey}
          onSelect={(k) => setCurrentKey(k)}
        >
          <Tab eventKey="Performers" title="Performers">
            <Profiles
              {...{
                collection: performers,
                collectionKey: 'Performer',
                field: 'performerId',
                customAlert,
                updateAuthorization,
              }}
            />
          </Tab>
          <Tab eventKey="Sabhas" title="Sabhas">
            <Profiles
              {...{
                collection: sabhas,
                collectionKey: 'Series',
                field: 'sabhaId',
                customAlert,
                updateAuthorization,
              }}
            />
          </Tab>
          <Tab eventKey="Venues" title="Venues">
            <Profiles
              {...{
                collection: venues,
                collectionKey: 'Venue',
                field: 'venueId',
                customAlert,
                updateAuthorization,
              }}
            />
          </Tab>
        </Tabs>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  flex: 1,
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Main = styled.div`
  margin-top: 7rem;
  position: relative;
  padding: 0 3rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-evenly;
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

export default PendingProfiles;

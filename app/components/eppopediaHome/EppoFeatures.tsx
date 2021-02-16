import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';
import DashboardImage from '../../../assets/images/dailyDashboard.png';
import DayPlannerImage from '../../../assets/images/dayPlanner.png';
import ArtistImage from '../../../assets/images/artistSearch.png';
import VenueImage from '../../../assets/images/eppoVenue.png';
import AppIcons from '../common/AppIcons';

const eppoFeatures = [
  {
    id: 1,
    row: [
      {
        id: 1,
        title: 'Daily Dashboard',
        description:
          'A brand new feeling of discovery music on your smartphone.',
        bgImage: DashboardImage,
      },
      {
        id: 2,
        title: 'Day Planner',
        description:
          'A brand new feeling of discovery music on your smartphone.',
        bgImage: DayPlannerImage,
      },
    ],
  },
  {
    id: 2,
    row: [
      {
        id: 1,
        title: 'Artist Search',
        description:
          'A brand new feeling of discovery music on your smartphone.',
        bgImage: ArtistImage,
      },
      {
        id: 2,
        title: 'Venue Search',
        description:
          'A brand new feeling of discovery music on your smartphone.',
        bgImage: VenueImage,
      },
    ],
  },
];

const EppoFeatures: FC = (): JSX.Element => {
  const featureContainer = useRef<HTMLDivElement>(null);
  const changeBgImage = (img: string): void => {
    const element = featureContainer.current;
    const elementStyle = element?.style;
    Object.assign(elementStyle, { backgroundImage: `url(${img})` });
  };
  return (
    <FeatureRow>
      <Container ref={featureContainer}>
        {eppoFeatures.map((eppoFeature) => {
          return (
            <Row key={eppoFeature.id.toString()}>
              {eppoFeature.row.map((ef) => {
                return (
                  <Column
                    className="column"
                    key={ef.id.toString()}
                    onMouseEnter={(): void => changeBgImage(ef.bgImage)}
                  >
                    <Title>{ef.title}</Title>
                    <Description>{ef.description}</Description>
                  </Column>
                );
              })}
            </Row>
          );
        })}
        <AppIcons
          playStore="https://play.google.com/store/apps/details?id=com.bkrsllc.eppoevent"
          appStore="https://apps.apple.com/us/app/eppo-event/id1483654084"
        />
      </Container>
      <Container ref={featureContainer}>
        {eppoFeatures.map((eppoFeature) => {
          return (
            <Row key={eppoFeature.id.toString()}>
              {eppoFeature.row.map((ef) => {
                return (
                  <Column
                    className="column"
                    key={ef.id.toString()}
                    onMouseEnter={(): void => changeBgImage(ef.bgImage)}
                  >
                    <Title>{ef.title}</Title>
                    <Description>{ef.description}</Description>
                  </Column>
                );
              })}
            </Row>
          );
        })}
        <AppIcons
          playStore="https://play.google.com/store/apps/details?id=com.bkrsllc.eppomusic"
          appStore="#"
        />
      </Container>
    </FeatureRow>
  );
};

const FeatureRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const Container = styled.div`
  background-image: url(${DashboardImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 150px;
  position: relative;
  width: 50%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
  @media screen and (min-width: 320px) {
    background-size: 180px;
  }
  @media screen and (min-width: 480px) {
    background-size: 220px;
  }
  @media screen and (min-width: 768px) {
    background-size: 270px;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 225px;
  & > .column:first-child {
    text-align: right;
    align-items: flex-end;
  }
  & > .column:last-child {
    text-align: left;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  cursor: pointer;
  @media screen and (min-width: 480px) {
    width: 36%;
  }
  @media screen and (min-width: 768px) {
    height: 80%;
    width: 25%;
  }
  @media screen and (min-width: 900px) {
    height: 70%;
    // width: 35%;
    width: 25%;
  }
  @media screen and (min-width: 1024px) {
    height: 76%;
    width: 28%;
  }
  @media screen and (min-width: 1200px) {
    height: 70%;
    width: 33%;
  }
  @media screen and (min-width: 1500px) {
    height: 50%;
    width: 38%;
  }
`;

const Title = styled.h3`
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -1px;
  color: #ffffff;
  @media screen and (min-width: 480px) {
    font-size: 18px;
    line-height: 20px;
    letter-spacing: -1px;
  }
  @media screen and (min-width: 768px) {
    font-size: 24px;
    line-height: 20px;
    letter-spacing: -1px;
  }
`;
const Description = styled.p`
  color: #98a3b9;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: -0.31px;
  width: 90%;
  @media screen and (min-width: 480px) {
    font-size: 12px;
    line-height: 20px;
    letter-spacing: -0.31px;
    width: 65%;
  }
  @media screen and (min-width: 768px) {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.31px;
    // width: 45%;
    width: 90%;
  }
`;

export default EppoFeatures;

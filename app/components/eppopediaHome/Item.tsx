/* eslint-disable react/jsx-one-expression-per-line */
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  LatLang,
  Performer,
  SearchCollState,
} from '../../../model/SearchModel';
import { chooseDummyImage } from '../common/common';
import { RootState } from '../../../redux/reducers/RootReducer';

interface Props {
  item: {
    id: string;
    image?: string;
    name?: string;
    priceData: any[];
    title?: string;
    address?: string;
    description?: string;
    coordinates?: LatLang;
    performers?: { [key: string]: Performer };
    startTime?: number;
    views?: number;
  };
  to: string;
  req?: string;
  isAuthorized?: boolean;
}

const Item: FC<Props> = ({ item, to, req, isAuthorized }: Props) => {
  const collectionSelector = (state: RootState): SearchCollState =>
    state.collection;
  const collectionState = useSelector(collectionSelector);
  const { id, name, coordinates } = item;
  let pathName = to === 'performers' ? `/${name}` : `/${to}/${name}`;
  const stateObj = { from: to, id, req };
  let { image } = item;
  const fromEvents =
    to === 'eventsbyvenue' ||
    to === 'eventsbysabha' ||
    to === 'eventsbyperformer';
  if (fromEvents) {
    const mainObj =
      item?.performers &&
      Object.values(item?.performers).find((performer) => {
        return performer.type === 'Main';
      });
    image = mainObj?.image;
    const navFrom = `${to.substr(to.lastIndexOf('y') + 1)}s`;
    Object.assign(stateObj, { from: navFrom, item });
    if (isAuthorized) {
      pathName = '/createEvent';
    } else {
      pathName = '';
    }
  }
  let viewsCount: number | string | undefined = item?.views;
  if (viewsCount && viewsCount > 999) {
    viewsCount = `${Math.abs(viewsCount / 1000).toFixed(1)}K`;
  } else if (viewsCount && viewsCount > 999999) {
    viewsCount = `${Math.abs(viewsCount / 1000000).toFixed(1)}M`;
  }

  const isPerformer = to.toLowerCase().includes('performer');
  const isSabha = to.toLowerCase().includes('sabha');
  const isVenue = to.toLowerCase().includes('venue');
  //   const isPremium = to.toLowerCase().includes('album');
  const dummyImage = chooseDummyImage(to);

  const loadDefaultImage = (e: any): any => {
    e.target.src = dummyImage;
  };
  let otherIndex = -1;
  let isCountry = false;

  return (
    <CardContainer>
      {to === 'premium content' &&
        item.priceData !== undefined &&
        item.priceData[0].map((data1, index) => {
          //   console.log('code', data1);
          if (data1.code === 'OT') {
            otherIndex = index;
          }
          if (data1.code === collectionState.location.countryCode) {
            isCountry = true;
            return (
              <Price>
                {data1.currency} {data1.price}{' '}
              </Price>
            );
          }
          if (isCountry === false && otherIndex !== -1) {
            return (
              <Price>
                {item.priceData[0][otherIndex].currency}{' '}
                {item.priceData[0][otherIndex].price}{' '}
              </Price>
            );
          }
        })}

      <ImageContianer {...{ isPerformer, isSabha, isVenue }}>
        {(to === 'venues' || to === 'eventsbyvenue') && (
          <a
            href={`http://maps.google.com/maps?&z=15&mrt=yp&t=k&q=${coordinates?.latitude}+${coordinates?.longitude}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa fa-map" />
          </a>
        )}
        {to === 'premium content' ? (
          <a
            href={process?.env?.REACT_APP_PREMIUM_SERVER}
            rel="noopener noreferrer"
            target="_self"
          >
            <Image
              src={image || dummyImage}
              alt="img"
              onError={loadDefaultImage}
            />
          </a>
        ) : (
            <Link to={{ pathname: pathName, state: stateObj }}>
              <Image
                src={image || dummyImage}
                alt="img"
                onError={loadDefaultImage}
              />
            </Link>
          )}
      </ImageContianer>
      <FooterCard>
        <TitleRow {...{ isVenue }}>
          {to === 'premium content' ? (
            <Title>{item.title}</Title>
          ) : (
              <Title {...{ isVenue }}>{name}</Title>
            )}
          {to !== 'premium content' ? (
            <Badge>
              <i className="fa fa-eye" /> {viewsCount}
            </Badge>
          ) : (
              ''
            )}
        </TitleRow>
        {to === 'venues' && <SubTitle>{item.address}</SubTitle>}
        {fromEvents && (
          <SubTitle>
            {item?.startTime &&
              moment(item?.startTime).format('Do MMM, hh:mm a')}
          </SubTitle>
        )}
      </FooterCard>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
  margin: 1rem 0;
`;
const ImageContianer = styled.div<{
  isPerformer: boolean;
  isSabha: boolean;
  isVenue: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  height: 130px;
  width: 130px;
  border-radius: 130px;
  background-color: ${(props): string => props.theme.black};
  box-shadow: 1px 1px 3px ${(props): string => props.theme.black};
  ${({ isPerformer }): string =>
    isPerformer
      ? `
      border-radius: 10px;
  `
      : `

  `}
  ${({ isVenue }): string =>
    isVenue
      ? `
  width: 100%;
  height: 120px;
  border-radius: 0;
  `
      : `
    `}
  .fa {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: ${({ theme }): string => theme.primary};
    padding: 5px;
    color: ${({ theme }): string => theme.white};
    border-radius: 20px;
  }
`;
const Image = styled.img`
  border-radius: 0.2rem;
  object-fit: cover;
  width: 100%;
`;
const FooterCard = styled.div`
  width: 100%;
  padding: 1rem 0 0;
  line-height: 1.2;
  position: relative;
  bottom: 0;
  text-align: center;
`;
const Title = styled.span<{ isVenue?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  line-height: 27px;
  text-overflow: ellipsis;
  color: ${(props): string => props.theme.white};
  ${({ isVenue }): string =>
    isVenue
      ? `
    text-align: left;
  `
      : ``}
`;
const Badge = styled.span`
  display: inline-block;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 12px;
  background-color: ${(props): string => props.theme.secondary};
  padding: 0.33em 0.6em;
  border-radius: 20px;
  color: ${(props): string => props.theme.white};
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  .fa {
    font-size: 15px;
    color: ${(props): string => props.theme.white};
    margin-right: 2px;
  }
`;
const SubTitle = styled.span`
  margin-top: 5px;
  display: -webkit-box;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: ${(props): string => props.theme.white};
`;
const TitleRow = styled.div<{ isVenue }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ isVenue }): string =>
    isVenue
      ? `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `
      : ``}
`;
const Price = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  background: #ffffff;
  display: inline-block;
  width: auto !important;
  font-size: 14px !important;
  color: #000 !important;
  padding: 1px 7px;
  border-radius: 5px;
`;

export default Item;

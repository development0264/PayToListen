import React, { FC } from 'react';
import styled from 'styled-components';
import ListItems from './ListItems';
import {
  Performer,
  premiumAlbum,
  Sabha,
  VenueDetail,
} from '../../../model/SearchModel';
import TopViewsHeader from './TopViewsHeader';

interface Props {
  isTopCollection: boolean;
  performers: Performer[];
  sabhas: Sabha[];
  albums: premiumAlbum[];
  venues: VenueDetail[];
  id: string;
}

const TopViews: FC<Props> = ({
  isTopCollection,
  performers,
  venues,
  sabhas,
  albums,
  id,
}: Props): JSX.Element => {
  if (!isTopCollection) {
    return null;
  }

  // console.log("PREMIUM ALBUMS ===> ", performers, albums);

  const listView = [
    { id: 1, for: 'Premium Content', data: albums },
    { id: 2, for: 'Performers', data: performers },
    { id: 3, for: 'Sabhas', data: sabhas },
    { id: 4, for: 'Venues', data: venues },
  ];
  return (
    <Container>
      {listView.map((list, i) => {
        if (list.data.length === 0) {
          return null;
        }
        return (
          <InnterView key={list.id.toString()} id={`${id}${i + 1}`}>
            <TopViewsHeader listFor={list.for} id={list.id} />
            <ListItems listFor={list.for} showTitle={false} data={list.data} />
          </InnterView>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }): string => theme.black};
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: center;
`;
const InnterView = styled.div`
  width: 85%;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default TopViews;

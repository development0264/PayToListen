import React, { FC } from 'react';
import styled from 'styled-components';
import { VenueDetail } from '../../../model/SearchModel';
import Card from './Card';

interface Props {
  detail: VenueDetail;
  authorized: boolean;
  activeMenu: string;
  setActive: (label: string, index: number) => void;
}

const VenueCard: FC<Props> = ({
  detail,
  authorized,
  setActive,
  activeMenu,
}: Props): JSX.Element => {
  const name = detail?.name;
  const address = detail?.address;
  return (
    <Card
      {...{
        detail,
        authorized,
        setActive,
        activeMenu,
        folderFor: 'Venue',
        collection: 'Venue',
      }}
    >
      <H3>{name}</H3>
      <div>
        <Para>
          <b>Address: </b>
          {address}
        </Para>
      </div>
    </Card>
  );
};

const H3 = styled.h3`
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 0;
  color: ${({ theme }): string => theme.white};
`;
const Para = styled.p`
  font-size: 15px;
  margin-bottom: 0;
  font-weight: 600;
  color: ${({ theme }): string => theme.white};
`;

export default VenueCard;

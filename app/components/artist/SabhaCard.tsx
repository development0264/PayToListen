import React, { FC } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Sabha } from '../../../model/SearchModel';

interface Props {
  detail: Sabha;
  authorized: boolean;
  activeMenu: string;
  setActive: (label: string, index: number) => void;
}

const SabhaCard: FC<Props> = ({
  detail,
  authorized,
  setActive,
  activeMenu,
}: Props): JSX.Element => {
  const name = detail?.name;
  return (
    <Card
      {...{
        detail,
        authorized,
        setActive,
        activeMenu,
        folderFor: 'Series',
        collection: 'Series',
      }}
    >
      <H3>{name}</H3>
    </Card>
  );
};

const H3 = styled.h3`
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 0;
  color: ${({ theme }): string => theme.white};
`;

export default SabhaCard;

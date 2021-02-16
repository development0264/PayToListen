import React, { FC } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  pos: number;
}

const options = ['Perfomers', 'Sabhas', 'Venues'];

const CollectionHeader: FC<Props> = ({ pos }: Props): JSX.Element => {
  const history = useHistory();
  const onSelect = (arg: Option): void => {
    switch (arg.value) {
      case 'Performers':
        history.replace('/performers');
        break;
      case 'Venues':
        history.replace('/venues');
        break;
      case 'Sabhas':
        history.replace('/sabhas');
        break;
      default:
        history.replace('/performers');
    }
  };
  const defaultOption = options[pos || 0];
  return (
    <Container>
      <Dropdown
        options={options}
        onChange={onSelect}
        value={defaultOption}
        placeholder="Select an option"
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .Dropdown-control {
    background-color: ${({ theme }): string => theme.primary};
    box-shadow: 0px 12px 17px rgba(252, 121, 120, 0.4);
    border-radius: 20px;
    color: ${({ theme }): string => theme.white};
    font-weight: 600;
    font-family: Avenir;
  }
  .Dropdown-arrow {
    border-color: ${({ theme }): string => theme.white} transparent transparent;
    border-width: 7px 7px 0;
    top: 17px;
  }
  .is-open .Dropdown-arrow {
    border-color: transparent transparent ${({ theme }): string => theme.white};
    border-width: 0 7px 7px;
  }
`;

export default CollectionHeader;

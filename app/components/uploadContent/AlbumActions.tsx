import React, { FC } from 'react';
import styled from 'styled-components';
import EditIcon from '../../../assets/images/editIcon.png';
import TrashIcon from '../../../assets/images/trashIcon.png';
import MoveFolderIcon from '../../../assets/images/moveFolderIcon.png';

interface Props {
  isEdit: boolean;
  isMove: boolean;
  isTrash: boolean;
}

const AlubmActions: FC<Props> = ({
  isEdit,
  isMove,
  isTrash,
}: Props): JSX.Element => {
  return (
    <Container>
      {isMove && <Icon src={MoveFolderIcon} alt="move" />}
      {isEdit && <Icon src={EditIcon} alt="edit" />}
      {isTrash && <Icon src={TrashIcon} alt="trash" />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: right;
  margin-top: 0;
  margin-bottom: 25px;
`;
const Icon = styled.img`
  width: 22px;
  height: 22px;
  color: #cccccc;
  margin-right: 20px;
`;

export default AlubmActions;

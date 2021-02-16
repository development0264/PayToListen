import React, { FC } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  listFor: string;
  id: number;
}
const TopViewsHeader: FC<Props> = ({ listFor, id }: Props): JSX.Element => {
  const pathname = listFor?.toLowerCase();
  return (
    <Container>
      <Row>
        <Col xs={6} md={6}>
          <Title>
            {id == 1 ? '' : 'Top'}&nbsp;
            {listFor}
          </Title>
          {id == 1 ? '' : <Date>(January 1 2019 - January 1 2020)</Date>}
        </Col>
        {id == 1 ? '' :
          <Col className="rightAlign">
            <Link to={{ pathname: `/${pathname}`, state: { views: true } }}>
              <Txt>See All List</Txt>
            </Link>
          </Col>}&nbsp;
      </Row>
    </Container>
  );
};

const Container = styled.div`
  .rightAlign {
    display: flex;
    justify-content: flex-end;
  }
`;

const Title = styled.h4`
  font-size: 20px;
  color: ${({ theme }): string => theme.white};
  font-weight: 600;
  margin-bottom: 0;
`;
const Date = styled.p`
  color: #98a3b9;
`;
const Txt = styled.span`
  color: ${({ theme }): string => theme.primary};
  text-align: right;
`;

export default TopViewsHeader;

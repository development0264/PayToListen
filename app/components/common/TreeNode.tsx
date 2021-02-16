/* eslint-disable react/jsx-one-expression-per-line */
import React, { FC } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { DummyImage } from './common';

interface Props {
  nodeData: {
    image: string;
    name: string;
    title: string;
    skill: string;
  };
}

const TreeNode: FC<Props> = ({ nodeData }: Props): JSX.Element => {
  return (
    <Row className="justify-content-start ">
      <Card className="nodeView">
        <div className="rowField">
          <Card.Img
            src={nodeData?.image || DummyImage}
            className="text-center ml-2 image-size-style"
          />
          <Col className="text-left" style={{ alignItems: 'center' }}>
            <Card.Text className="card-text-content-style">
              {nodeData?.name}
            </Card.Text>
            <Card.Text
              className="card-subtext-content-style"
              style={{ marginBottom: 10, marginTop: -15 }}
            >
              ({nodeData?.title} - {nodeData?.skill})
            </Card.Text>
          </Col>
        </div>
      </Card>
    </Row>
  );
};

export default TreeNode;

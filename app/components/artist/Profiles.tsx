import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { usePendingProfiles } from '../../../hooks/usePendingProfiles';
import { db } from '../../../utils/firebase';

const Card = ({
  data,
  collectionKey,
  field,
  customAlert,
  updateAuthorization,
}) => {
  const [image, setImage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    db.collection(collectionKey)
      .doc(data[field])
      .get()
      .then((resp) => {
        setImage(resp.data().image);
      });
  }, [data]);

  const proceedAction = () => {
    updateAuthorization(data, collectionKey, field);
  };
  const onChange = (): void => {
    customAlert({
      title: 'Message',
      message: 'Are you sure to approve?',
      proceedAction,
    });
    setIsChecked((d) => !d);
  };
  return (
    <Col xs={12} sm={6} md={3} key={data.id}>
      <Block>
        <ImageContainer>
          <Image src={image} />
        </ImageContainer>
        <Info>{data.name}</Info>
        <Info>{data.email}</Info>
        <Info>{data.phoneNumber}</Info>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            style={{ fontSize: 14 }}
            id={`${data.name}-${data.phoneNumber}`}
            checked={isChecked}
            onChange={onChange}
            readOnly
          />
          <label
            className="custom-control-label"
            htmlFor={`${data.name}-${data.phoneNumber}`}
          >
            Approve Authentiction
          </label>
        </div>
      </Block>
    </Col>
  );
};

const Profiles = ({
  collection,
  collectionKey,
  field,
  customAlert,
  updateAuthorization,
}) => {
  return (
    <Row>
      {collection.map((data) => {
        return (
          <Card
            key={data.id}
            {...{
              data,
              collectionKey,
              field,
              customAlert,
              updateAuthorization,
            }}
          />
        );
      })}
    </Row>
  );
};

const Block = styled.div`
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  margin: 1rem 0;
  height: 12rem;
`;
const ImageContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
`;
const Image = styled.img`
  object-fit: contain;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: black;
`;
const Info = styled.p`
  margin: 0;
  font-family: Nunito;
  font-size: 14px;
`;

export default Profiles;

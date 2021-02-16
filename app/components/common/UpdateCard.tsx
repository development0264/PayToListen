import React, { FC } from 'react';
import styled from 'styled-components';

interface UpdateCardProps {
  image: string;
  message: string;
  logo: string;
  from: string;
  date: string;
}

const UpdateCard: FC<UpdateCardProps> = ({
  image,
  message,
  logo,
  from,
  date,
}: UpdateCardProps): JSX.Element => {
  return (
    <Container>
      <UpdateImage src={image} alt="updateImage" />
      <Message>{message}</Message>
      <AuthorContainer>
        <Image src={logo} alt="logo" />
        <Details>
          <p>{from}</p>
          <p>{date}</p>
        </Details>
      </AuthorContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  @media (min-width: 458px) {
    flex: 0 0 150px;
  }
  @media (min-width: 768px) {
    flex: 0 0 200px;
  }
  @media (min-width: 995px) {
    flex: 0 0 300px;
  }
`;
const UpdateImage = styled.img`
  width: 100%;
  margin: 0 0.5rem;
`;
const Message = styled.p`
  font-family: Livvic;
  font-size: 18px;
  font-weight: 900;
  line-height: 32px;
  margin-top: 2rem;
`;

const Image = styled.img`
  height: 50%;
`;
const AuthorContainer = styled.div`
  display: flex;
`;
const Details = styled.div`
  & > p:last-child {
    color: rgba(255, 255, 255, 0.50133);
  }
  p {
    font-family: 'Courier New', Courier, monospace;
    font-size: 16px;
    margin-bottom: 0;
    margin-left: 1rem;
  }
`;

export default UpdateCard;

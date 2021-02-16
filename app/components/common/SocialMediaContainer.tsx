/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useState, useEffect } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import TrashProfile from '../../../assets/images/trashProfile.png';
import FacebookIcon from '../../../assets/images/facebookIcon.png';
import TwitterIcon from '../../../assets/images/twitterIcon.png';
import InstaIcon from '../../../assets/images/instaIcon.png';
import YoutubeIcon from '../../../assets/images/youtubeIcon.png';
import TickIcon from '../../../assets/images/tickIcon.png';

interface SocialMediaProps {
  label: string;
  removeSection: () => void;
  setSocialMediaLinks: (value: any) => void;
  socialMediaLinks: any;
  saveMediaIds: () => void;
}

const SocialMediaContainer: FC<SocialMediaProps> = ({
  label,
  removeSection,
  setSocialMediaLinks,
  socialMediaLinks,
  saveMediaIds,
}: SocialMediaProps): JSX.Element => {
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    setMediaData([
      {
        id: 1,
        name: 'Facebook',
        for: 'facebook',
        icon: FacebookIcon,
        link: 'https://www.facebook.com/',
        value: socialMediaLinks.facebook.mediaId,
      },
      {
        id: 2,
        name: 'Instagram',
        icon: InstaIcon,
        for: 'instagram',
        link: 'https://www.instagram.com/',
        value: socialMediaLinks.instagram.mediaId,
      },
      {
        id: 3,
        name: 'Twitter',
        icon: TwitterIcon,
        for: 'twitter',
        link: 'https://www.twitter.com/',
        value: socialMediaLinks.twitter.mediaId,
      },
      {
        id: 4,
        name: 'Youtube',
        icon: YoutubeIcon,
        for: 'youtube',
        link: 'https://www.youtube.com/',
        value: socialMediaLinks.youtube.mediaId,
      },
    ]);
  }, [socialMediaLinks]);
  const updateValues = ({ target: { value } }, key: string): void => {
    setSocialMediaLinks((media: any) => ({
      ...media,
      [key]: { ...media[key], mediaId: value },
    }));
  };
  return (
    <Container>
      <Card className="profileCardView">
        <Card.Header as="h5" className="card-item-style">
          <TitleRow>
            <Title>{label}</Title>
            <RightActions>
              <DeleteIcon
                onClick={removeSection}
                src={TrashProfile}
                alt="delete"
              />
            </RightActions>
          </TitleRow>
        </Card.Header>

        <Card.Body className="profileCardBody">
          {mediaData.map((media) => {
            return (
              <MediaRow key={media.id.toString()}>
                <SocialIcon src={media.icon} alt={media.for} />
                <Label htmlFor={media.for}>{media.name}</Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                      {media.link}
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    id={media.for}
                    aria-describedby="basic-addon3"
                    value={media.value}
                    onChange={(e): void => updateValues(e, media.for)}
                  />
                </InputGroup>
              </MediaRow>
            );
          })}
          <SaveButton>
            <div onClick={saveMediaIds}>
              <EditContentButton src={TickIcon} alt="edit" />
              <span>Save</span>
            </div>
          </SaveButton>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 1rem;
  .profileCardView {
    border: transparent;
    border-radius: 10px;
    overflow: hidden;
    background-color: transparent;
  }
  .card-header {
    background-color: ${({ theme }): string => theme.black};
  }
  .profileCardBody {
    background-color: ${({ theme }): string => theme.white};
    min-height: 300px;
  }
  .profileContent {
    color: #000000;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }): string => theme.white};
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
`;

const DeleteIcon = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
`;

const SocialIcon = styled.img`
  text-align: center;
  margin-right: 0.3rem;
  width: 25px;
  height: 25px;
`;
const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }): string => theme.black};
`;
const MediaRow = styled.div`
  .input-group-text {
    background-color: #b8becf;
  }
`;

const SaveButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    background-color: ${({ theme }): string => theme.violet};
    width: 90px;
    cursor: pointer;
    font-weight: bold;
    padding: 0.3rem 0.5rem;
    padding-left: 0.2rem;
    font-size: 14px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    span {
      font-family: Nunito;
      font-size: 18px;
      font-weight: bold;
      color: ${({ theme }): string => theme.white};
    }
  }
`;
const EditContentButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 0.5rem;
`;

export default SocialMediaContainer;

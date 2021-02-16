import React, { FC, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

interface Props {
  image: string;
  setImage: (img: string) => void;
  dummyImage: string;
}

const ImageUploader: FC<Props> = ({
  image,
  setImage,
  dummyImage,
}: Props): JSX.Element => {
  const imageUploader = useRef<HTMLInputElement>(null);
  const [useLink, setUseLink] = useState<boolean>(false);

  const readFile = (e: any): void => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev: any): void => {
        setImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLink = (): void => {
    setUseLink((link) => !link);
  };

  const changeImage = (): void => {
    if (imageUploader !== null) {
      imageUploader?.current?.click();
    }
  };
  const removeLink = (): void => {
    setImage('');
  };

  return (
    <>
      <Container>
        <ImageContainer>
          <Image src={image || dummyImage} alt="performer" />
        </ImageContainer>
        <Form.Control
          type="file"
          ref={imageUploader}
          className="hidden"
          accept="image/png,image/jpg,image/jpeg"
          onChange={readFile}
        />
        <Form.Text className="uploadImgTxt ml-1" onClick={changeImage}>
          Change Image
        </Form.Text>
        <span>or</span>
        <Form.Text className="uploadImgTxt ml-1" onClick={toggleLink}>
          Upload Link
        </Form.Text>
      </Container>
      {useLink && (
        <ImageLink>
          <Form.Control
            placeholder="Image URL"
            className="formInput w-100"
            value={image}
            onChange={({ target: { value } }): void => setImage(value)}
          />
          {image.length > 0 && <Remove onClick={removeLink}>x</Remove>}
        </ImageLink>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;

  .hidden {
    display: none;
  }
  .uploadImgTxt {
    color: #58cb7d;
    cursor: pointer;
    display: inline-block;
  }
  span {
    margin: 0 1rem;
  }
`;
const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 5px;
  overflow: hidden;
  display: inline-block;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
const ImageLink = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 65%;
  margin: 0.5rem 0;
`;
const Remove = styled.span`
  cursor: pointer;
  position: absolute;
  right: 17px;
  width: 15px;
  text-align: center;
  background-color: ${({ theme }): string => theme.white};
  color: ${({ theme }): string => theme.primary};
`;

export default ImageUploader;

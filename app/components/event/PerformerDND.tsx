/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import styled from 'styled-components';
import { getArticle } from '../../../utils/Search';
import { SelectedPerformer } from '../../../model/contentModel';

interface PerformerProps {
  selectedPerformers: SelectedPerformer[];
  setSelectedPerformers: (value: SelectedPerformer[]) => void;
  selectPerformer: (id: string) => void;
  DummyImage: string;
  removePerformer: (id: string) => void;
  currentArtist: any;
}

interface PerformerItemProps {
  id: string;
  skill: string[];
  name: string;
  image: string;
  type: string;
  otherProps: Omit<PerformerProps, 'selectedPerformers'>;
}

const SortableItem = SortableElement(
  ({ image, name, skill, otherProps, id, type }: PerformerItemProps) => {
    const { id: currentArtistId } = otherProps?.currentArtist;
    const isNotCurrentPerformer = currentArtistId !== id;
    const loadDummyImage = (e: any): any => {
      e.target.src = otherProps.DummyImage;
    };
    return (
      <Container>
        <Row
          className="selectedPerfRow"
          onClick={(): void => otherProps.selectPerformer(id)}
          onMouseDown={(): void => otherProps.selectPerformer(id)}
        >
          <Col xs={2}>
            <Image
              src={image || otherProps.DummyImage}
              alt="artist"
              onError={loadDummyImage}
            />
          </Col>
          <Col xs={8} className="first-flex">
            <span>
              {`${name} (${type === 'Main' ? 'Main - ' : ''}${skill})`}
            </span>
          </Col>
          {isNotCurrentPerformer && (
            <Col xs={2} className="end-flex">
              <span
                onClick={(): void => otherProps.removePerformer(id)}
                onMouseDown={(): void => otherProps.removePerformer(id)}
                role="button"
                tabIndex={0}
              >
                <i className="fa fa-times rmovePerf" />
              </span>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
);

interface SortableCompProps {
  value: any;
  index: number;
  otherProps: any;
}

const SortableItemComponent: FC<SortableCompProps> = ({
  value,
  index,
  otherProps,
}: SortableCompProps): JSX.Element => {
  const { authToken } = useSelector((state: { auth: any }) => state.auth);
  const [image, setImage] = useState<undefined | string>(
    value?.performer?.image
  );
  const [skill, setSkill] = useState<string[] | undefined>(value?.skill);
  useEffect(() => {
    if (value?.performer?.id && (image === undefined || image === '')) {
      const { id } = value?.performer;
      getArticle({
        authToken,
        collection: 'artist',
        id,
      }).then((rep) => {
        setImage(rep.response?.result?.image);
        const isSkill = rep?.response?.result?.skill?.length > 0;
        if (isSkill) {
          setSkill(rep.response.result.skill[0]);
        }
      });
    }
  }, [index]);
  if (value?.performer?.id) {
    const { id, name } = value?.performer;
    const { type } = value;
    return (
      <SortableItem
        key={`item-${id}`}
        {...{
          index,
          image,
          name,
          skill,
          id,
          type,
          otherProps,
        }}
      />
    );
  }
  return null;
};

const SortablePerformerList = SortableContainer(
  ({ items, otherProps }: { items: SelectedPerformer[]; otherProps: any }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItemComponent
            key={value.performer?.id}
            {...{ value, index, otherProps }}
          />
        ))}
      </div>
    );
  }
);

const PerformerDND: FC<PerformerProps> = ({
  selectedPerformers,
  setSelectedPerformers,
  selectPerformer,
  DummyImage,
  removePerformer,
  currentArtist,
}: PerformerProps): JSX.Element => {
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }): void => {
    const arrangedArray = arrayMove(selectedPerformers, oldIndex, newIndex);
    const stringy = JSON.stringify(arrangedArray);
    const freshArray = JSON.parse(stringy);
    setSelectedPerformers(freshArray);
  };

  return (
    <div
      className="selectedPerformers"
      style={
        selectedPerformers.length > 3
          ? {
              height: 100,
              overflowY: 'auto',
            }
          : {}
      }
    >
      <SortablePerformerList
        {...{
          otherProps: {
            selectPerformer,
            DummyImage,
            removePerformer,
            currentArtist,
          },
          items: selectedPerformers,
          onSortEnd,
        }}
      />
    </div>
  );
};

const Container = styled.div`
  z-index: 99999;
  .selectedPerfRow {
    margin: 0.5rem 0;
    max-height: 300px;
    padding: 0.2rem 0;
  }
  .selectedPerfRow:hover {
    cursor: pointer;
    background-color: #495057;
  }
  .first-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .end-flex {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .rmovePerf {
    color: #cc1c34;
    font-size: 20px;
    cursor: pointer;
    width: 20px;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export default PerformerDND;

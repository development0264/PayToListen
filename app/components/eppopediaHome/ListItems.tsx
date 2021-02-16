import React, { FC, useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import styled from 'styled-components';
import { Performer } from '../../../model/SearchModel';
import Item from './Item';

interface ListProps {
  listFor: string;
  data: any[];
  showTitle: boolean;
  style?: object;
  isAuthorized?: boolean;
}

const ListItems: FC<ListProps> = ({
  listFor,
  data,
  showTitle,
  style = {},
  isAuthorized = false,
}: ListProps): JSX.Element => {
  const [responsive, setResponsive] = useState({
    0: {
      items: 1,
    },
    480: {
      items: 2,
    },
    600: {
      items: 3,
    },
    900: {
      items: 5,
    },
    1200: {
      items: 7,
    },
    1600: {
      items: 7,
    },
  });

  const loadResponsive = (): void => {
    if (listFor.toLowerCase().includes('venue')) {
      setResponsive({
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        480: {
          items: 2,
        },
        900: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1600: {
          items: 6,
        },
      });
    }
  };
  useEffect(() => {
    loadResponsive();
  }, []);
  return (
    <Container>
      {showTitle && <h3 className="title">{listFor}</h3>}
      <div className="block" style={style}>
        <OwlCarousel
          items={5}
          className="owl-theme"
          nav
          margin={30}
          responsive={responsive}
          navText={[
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          ]}
        >
          {data.map((item) => {
            return (
              <Item
                key={item.id}
                {...{
                  item,
                  to: listFor.toLowerCase(),
                  req: 'mainSearch',
                  isAuthorized,
                }}
              />
            );
          })}
        </OwlCarousel>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  .title {
    color: #ffffff;
  }
  .block {
    margin-top: 3rem 0;
  }
`;

export default ListItems;

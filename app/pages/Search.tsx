// @ts-nocheck

import React, { useState } from 'react';
import { useSearch } from '../../hooks/SearchHook';

const ListItem = ({ title, subTitle, image }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px #000',
        marginBottom: '10px',
      }}
    >
      <img src={image} style={{ width: 100, height: 100 }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>{title}</h3>
        <h4>{subTitle}</h4>
      </div>
    </div>
  );
};

const Search = () => {
  const {
    searchTerm,
    startSearch,
    searchResult,
    performersResult,
  } = useSearch();
  const handleChange = _.debounce((value) => {
    startSearch(value);
  }, 600);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
        <input
          type="text"
          onChange={(evt) => handleChange(evt.target.value)}
          style={{ display: 'block', flex: 0.7 }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          direction: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <h1>Content</h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {searchResult.map((item) => {
              const subTitle = [
                ...item._source.main,
                ...item._source.accompanist,
              ]
                .reduce((result, x) => {
                  if (x) {
                    result.push(x.name);
                  }
                  return result;
                }, [])
                .join(',');
              return (
                <ListItem
                  key={item._id}
                  image={item._source.image}
                  title={item._source.title}
                  subTitle={subTitle}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h1>Albums</h1>
          {_.uniqBy(searchResult, '_source.album.id')
            .map((item) => {
              const source = item._source;
              if (source.album) {
                return (
                  <ListItem
                    key={source.album.id}
                    image={source.album.image}
                    title={source.album.title}
                  />
                );
              }
            })
            .filter((x) => x)}
        </div>
        <div>
          <h1>Artists</h1>
          {performersResult.map((item) => {
            return (
              <ListItem
                key={item._id}
                title={item._source.name}
                image={item._source.image}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;

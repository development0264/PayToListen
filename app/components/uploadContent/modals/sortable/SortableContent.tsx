import React, { useState, useEffect } from 'react';
import arrayMove from 'array-move';
import _ from 'lodash';
import SortableContentList from './SortableContentList';

const SortableContent = ({ files, ...otherProps }: any): JSX.Element => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (files?.length > 0) {
      const sortedItems = _.sortBy(files, 'sortIndex');
      console.log('File Received with sort...', sortedItems);
      setItems(sortedItems);
    }
  }, [files]);

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }): void => {
    const updatedFiles = arrayMove(items, oldIndex, newIndex);
    const finalUpdates = _.sortBy(
      updatedFiles.map((o, i) => ({ ...o, sortIndex: i })),
      'sortIndex'
    );
    otherProps.updateSorting(finalUpdates);
  };
  if (items?.length === 0) {
    return (
      <div>
        <p>Media uploading takes some time, please wait...</p>
      </div>
    );
  }

  return (
    <SortableContentList
      {...{
        files: items,
        ...otherProps,
      }}
      onSortEnd={onSortEnd}
      pressDelay={200}
    />
  );
};

export default SortableContent;

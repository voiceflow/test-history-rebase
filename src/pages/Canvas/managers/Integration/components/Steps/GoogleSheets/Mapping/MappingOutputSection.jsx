import update from 'immutability-helper';
import React from 'react';

import NextStepButton from '../../components/NextStepButton';
import OutputMapping from './outputMapping';

function OutputSection({ onChange, data, loading, headers_list, openNextStep }) {
  const handleAddMap = () => {
    onChange({
      mapping: update(data.mapping, {
        $push: [
          {
            arg1: null,
            arg2: null,
          },
        ],
      }),
    });
  };

  const handleRemoveMap = (i) => {
    onChange({
      mapping: update(data.mapping, {
        $splice: [[i, 1]],
      }),
    });
  };

  const handleSelection = (i, arg, value) => {
    onChange({
      mapping: update(data.mapping, {
        [i]: {
          [arg]: {
            $set: value,
          },
        },
      }),
    });
  };

  const mapping_options = headers_list || [];

  return (
    <>
      {mapping_options && data.mapping && !loading && (
        <OutputMapping
          arg1_options={[
            {
              value: 'row_number',
              label: 'Row Number',
            },
          ].concat(mapping_options)}
          arguments={data.mapping}
          onAdd={handleAddMap}
          onRemove={handleRemoveMap}
          handleSelection={(i, arg, value) => handleSelection(i, arg, value)}
        />
      )}

      <NextStepButton openNextStep={openNextStep} />
    </>
  );
}

export default OutputSection;

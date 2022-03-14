import { Select } from '@voiceflow/ui';
import React from 'react';

import { AttributeType } from '../constants';
import AttributeValueText from './AttributeValueText';
import { SelectOption } from './Controls';

export default function AttributeValue({ value, name, onUpdate, tagData, attributeData, globalStore, onMouseLeave }) {
  const options = React.useMemo(() => {
    const opts = [];

    if (attributeData.type === AttributeType.TEXT_SELECT || attributeData.type === AttributeType.TEXT) {
      opts.push({ name: value, inputAttribute: name });
    }

    if (attributeData.type === AttributeType.TEXT_SELECT || attributeData.type === AttributeType.SELECT) {
      opts.push(...attributeData.options.map((name) => ({ name })));
    }

    return opts;
  }, [attributeData.type, attributeData.options, value, name]);

  const onOpen = () => {
    requestAnimationFrame(() => {
      globalStore.get('enableReadOnly')();
    });
  };

  const onClose = () => {
    globalStore.get('disableReadOnly')();
    onMouseLeave();
  };

  const onUpdateAttr = (value) => {
    onUpdate(name, value);
    onClose();
    globalStore.get('onBlurEditor')();
  };

  const isOptionSelected = attributeData.type === AttributeType.TEXT_SELECT && attributeData.options.includes(value);

  return attributeData ? (
    <Select
      value={value}
      onOpen={onOpen}
      options={options}
      onClose={onClose}
      onSelect={onUpdateAttr}
      autoWidth={false}
      renderAsSpan
      getOptionKey={(option) => `${option?.name}-${option?.inputAttribute || ''}`}
      renderTrigger={({ ref }) => (
        <AttributeValueText ref={ref} color={tagData.color}>
          "{value}"
        </AttributeValueText>
      )}
      getOptionLabel={(option) => option?.name}
      getOptionValue={(option) => option?.name}
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
        <SelectOption
          tag={tagData}
          value={isOptionSelected ? '' : value}
          option={option}
          isFocused={isFocused}
          searchLabel={searchLabel}
          onEnterPress={onUpdateAttr}
          getOptionLabel={() => option?.name}
          getOptionValue={getOptionValue}
        />
      )}
    />
  ) : (
    <span>"{value}"</span>
  );
}

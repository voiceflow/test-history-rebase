import React from 'react';

import { defaultLabelRenderer } from '@/componentsV2/Select';
import { toast } from '@/componentsV2/Toast';
import { stopPropagation, withKeyPress } from '@/utils/dom';

import SelectInputOption from './SelectInputOption';
import SelectInputOptionWrapper from './SelectInputOptionWrapper';
import SelectInputOptionWrapperAbsolute from './SelectInputOptionWrapperAbsolute';

const SelectOption = ({ tag, value, option, isFocused, onAddTag, onEnterPress, optionsPath, searchLabel, getOptionLabel, getOptionValue }) => {
  const inputRef = React.useRef();
  const [val, setVal] = React.useState(value);
  const tagInputAttribute = tag?.attributes?.[option.inputAttribute];

  const onEnterPressed = React.useCallback(
    withKeyPress(13, () => {
      const { valid, error } = tagInputAttribute.validate ? tagInputAttribute.validate(val) : { valid: true };

      if (!valid) {
        toast.error(error);
      } else {
        onAddTag?.(
          {
            tag: option.tag,
            name: val,
            attributes: { ...option.attributes, [option.inputAttribute]: val },
          },
          optionsPath
        );
        onEnterPress?.(val);

        window.document.body?.click();
      }
    }),
    [val, tagInputAttribute, option]
  );

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus?.();
    } else {
      inputRef.current?.blur?.();
    }
  }, [isFocused]);

  return option.inputAttribute ? (
    <SelectInputOptionWrapper>
      <SelectInputOptionWrapperAbsolute onClick={stopPropagation(null, true)}>
        <SelectInputOption
          ref={inputRef}
          value={val}
          variant="inline"
          onChange={({ target }) => setVal(target.value)}
          onKeyPress={onEnterPressed}
          placeholder={tagInputAttribute.placeholder}
        />
      </SelectInputOptionWrapperAbsolute>
    </SelectInputOptionWrapper>
  ) : (
    defaultLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)
  );
};

export default SelectOption;

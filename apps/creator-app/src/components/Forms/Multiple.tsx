import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, FlexCenter, Input } from '@voiceflow/ui';
import React from 'react';

import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';
import InputGroupText from '@/components/InputGroupText';
import { useLinkedState } from '@/hooks';
import { ClassName } from '@/styles/constants';

interface Multiple {
  max?: number;
  add: string;
  list: string[];
  update: (list: string[]) => void;
  prepend?: string;
  isDisabled?: boolean;
  placeholder?: string;
}

const Multiple: React.FC<Multiple> = ({ max, add, list, update, prepend, isDisabled, placeholder }) => {
  const [localList, setLocalList] = useLinkedState(list.length ? list : ['']);

  const onDelete = (index: number) => () => {
    if (localList.length > 1) {
      const nextList = Utils.array.without(localList, index);

      update(nextList);
      setLocalList(nextList);
    }
  };

  const onAdd = () => {
    const nextList = Utils.array.append(localList, '');

    update(nextList);
    setLocalList(nextList);
  };

  const onBlur = () => {
    update(localList);
  };

  return (
    <div className="multiple">
      {localList.map((item, index) => (
        <Box.FlexCenter key={index} mb={8}>
          <span className="px-2 font-weight-bold">{index + 1}.</span>

          <InputGroup>
            {!!prepend && (
              <InputGroupAddon addonType={AddonType.PREPEND}>
                <InputGroupText>{prepend}</InputGroupText>
              </InputGroupAddon>
            )}

            <Input
              type="text"
              name={String(index)}
              value={item}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              onBlur={onBlur}
              disabled={isDisabled}
              placeholder={placeholder}
              onChangeText={(value) => setLocalList((prevList) => Utils.array.replace(prevList, index, value))}
            />

            {localList.length > 1 && (
              <InputGroupAddon addonType={AddonType.APPEND}>
                <button className="close ml-3" onClick={onDelete(index)} />
              </InputGroupAddon>
            )}
          </InputGroup>
        </Box.FlexCenter>
      ))}

      {(max && localList.length >= max) || isDisabled ? null : (
        <FlexCenter fullWidth>
          <Button onClick={onAdd} variant={ButtonVariant.PRIMARY} className={ClassName.FORMS_MULTIPLE_BUTTON}>
            {add}
          </Button>
        </FlexCenter>
      )}
    </div>
  );
};

export default Multiple;

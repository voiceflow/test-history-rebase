import { Box, Button, ButtonVariant, FlexCenter, Input } from '@voiceflow/ui';
import React from 'react';

import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';
import InputGroupText from '@/components/InputGroupText';
import { useLinkedState } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { append, replace, without } from '@/utils/array';

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

  const onChange =
    (index: number) =>
    ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
      setLocalList((prevList) => replace(prevList, index, currentTarget.value));
    };

  const onDelete = (index: number) => () => {
    if (localList.length > 1) {
      const nextList = without(localList, index);

      update(nextList);
      setLocalList(nextList);
    }
  };

  const onAdd = () => {
    const nextList = append(localList, '');

    update(nextList);
    setLocalList(nextList);
  };

  const onBlur = () => {
    update(localList);
  };

  return (
    <div className="multiple">
      {localList.map((item, index) => (
        <Box key={index} className="super-center" mb={8}>
          <span className="px-2 font-weight-bold">{index + 1}.</span>

          <InputGroup>
            {!!prepend && (
              <InputGroupAddon addonType={AddonType.PREPEND}>
                <InputGroupText className="input-group-text-bg">{prepend}</InputGroupText>
              </InputGroupAddon>
            )}

            <Input
              type="text"
              name={String(index)}
              value={item}
              onBlur={onBlur}
              disabled={isDisabled}
              onChange={onChange(index)}
              className="form-control form-bg right outline"
              placeholder={placeholder}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            />

            {localList.length > 1 && (
              <InputGroupAddon addonType={AddonType.APPEND}>
                <button className="close ml-3" onClick={onDelete(index)} />
              </InputGroupAddon>
            )}
          </InputGroup>
        </Box>
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

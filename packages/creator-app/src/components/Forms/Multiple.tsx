import { Input } from '@voiceflow/ui';
import React from 'react';

import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';
import InputGroupText from '@/components/InputGroupText';
import { useLinkedState } from '@/hooks';
import { append, replace, without } from '@/utils/array';

import MultipleAddButton from './components/MultipleAddButton';

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
        <div key={index} className="super-center">
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
            />

            {localList.length > 1 && (
              <InputGroupAddon addonType={AddonType.APPEND}>
                <button className="close ml-3" onClick={onDelete(index)} />
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
      ))}

      {(max && localList.length >= max) || isDisabled ? null : <MultipleAddButton onClick={onAdd}>{add}</MultipleAddButton>}
    </div>
  );
};

export default Multiple;

import { getNestedMenuFormattedLabel, TableTypes, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import EditableText from '@/components/EditableText';
import { NLUContext } from '@/contexts';
import { styled } from '@/hocs';
import { NLUManagerContext } from '@/pages/NLUManager/context';

const Text = styled(EditableText)`
  b {
    text-decoration: underline;
  }
`;

interface NameColumnProps<I extends TableTypes.Item & { name: string }> extends TableTypes.ItemProps<I> {
  placeholder: string;
}

const NameColumn = <I extends TableTypes.Item & { name: string }>({ item, placeholder }: NameColumnProps<I>): React.ReactElement => {
  const nlu = React.useContext(NLUContext);
  const nluManager = React.useContext(NLUManagerContext);

  const [localValue, setLocalValue] = useLinkedState(item.name);

  const onChange = (name: string) => {
    if (nluManager.renamingItemID !== item.id) return;

    nlu.renameItem(name, item.id, nluManager.activeTab);
    nluManager.setRenamingItemID(null);
  };

  return (
    <Text
      value={localValue}
      onBlur={() => onChange(localValue)}
      editing={nluManager.renamingItemID === item.id}
      onChange={setLocalValue}
      placeholder={placeholder}
      startEditingOnFocus={false}
    >
      {getNestedMenuFormattedLabel(item.name, nluManager.search)}
    </Text>
  );
};

export default NameColumn;

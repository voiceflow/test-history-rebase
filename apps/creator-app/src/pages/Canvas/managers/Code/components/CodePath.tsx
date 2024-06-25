import type { BaseNode } from '@voiceflow/base-types';
import { Input, SectionV2, TippyTooltip, useLinkedState, withTargetValue } from '@voiceflow/ui';
import React from 'react';

interface CodePathProps {
  onRemove: () => void;
  onUpdate: (data: Partial<BaseNode.Code.CodePath>) => void;
  data: BaseNode.Code.CodePath;
}

const CodePath: React.FC<CodePathProps> = ({ data, onUpdate, onRemove }) => {
  const [label, setLabel] = useLinkedState(data.label);

  return (
    <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
      <TippyTooltip
        content={
          <>
            <code>return "{label}";</code>&nbsp;&nbsp;to resolve path
          </>
        }
        style={{ width: '100%' }}
        placement="left"
      >
        <Input
          value={label}
          onChange={withTargetValue(setLabel)}
          placeholder="Add path name"
          onBlur={() => onUpdate({ label })}
        />
      </TippyTooltip>
    </SectionV2.ListItem>
  );
};

export default CodePath;

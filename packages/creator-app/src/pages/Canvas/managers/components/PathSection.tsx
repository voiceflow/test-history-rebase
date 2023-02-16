import { Utils } from '@voiceflow/common';
import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable, useLinkedState, useScrollNodeIntoView } from '@/hooks';
import { withInputBlur } from '@/utils/dom';

interface PathSectionProps {
  onAdd: VoidFunction;
  title?: string;
  pathName: string;
  placeholder?: string;
  onRename: (pathName: string) => void;
  onRemove: VoidFunction;
  collapsed: boolean;
}

const PathSection: React.FC<PathSectionProps> = ({ title = 'Path', onAdd, pathName, onRemove, onRename, collapsed, placeholder }) => {
  const [name, setName] = useLinkedState(pathName);
  const [autofocus, enableAutofocus, disableAutofocus] = useEnableDisable(false);

  const [ref, scrollIntoView] = useScrollNodeIntoView<HTMLDivElement>();

  return (
    <SectionV2.ActionCollapseSection
      ref={ref}
      title={<SectionV2.Title bold={!collapsed}>{title}</SectionV2.Title>}
      action={
        collapsed ? (
          <SectionV2.AddButton onClick={Utils.functional.chainVoid(enableAutofocus, onAdd)} />
        ) : (
          <SectionV2.RemoveButton onClick={Utils.functional.chainVoid(disableAutofocus, onRemove)} />
        )
      }
      collapsed={collapsed}
      onEntered={() => scrollIntoView({ block: 'end' })}
      contentProps={{ bottomOffset: 2.5 }}
    >
      <Input
        value={name}
        onBlur={() => onRename(name)}
        autoFocus={autofocus}
        onChangeText={setName}
        onEnterPress={withInputBlur()}
        placeholder={placeholder}
      />
    </SectionV2.ActionCollapseSection>
  );
};

export default PathSection;

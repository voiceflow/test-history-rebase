import { Utils } from '@voiceflow/common';
import { Box, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable, useLinkedState, useScrollNodeIntoView } from '@/hooks';
import { withInputBlur } from '@/utils/dom';

interface PathSectionProps {
  onAdd: VoidFunction;
  title?: string;
  pathName: string;
  onRename: (pathName: string) => void;
  onRemove: VoidFunction;
  collapsed: boolean;
}

const PathSection: React.FC<PathSectionProps> = ({ title = 'Path', onAdd, pathName, onRemove, onRename, collapsed }) => {
  const [name, setName] = useLinkedState(pathName);
  const [autofocus, enableAutofocus, disableAutofocus] = useEnableDisable(false);

  const [ref, scrollIntoView] = useScrollNodeIntoView<HTMLDivElement>();

  return (
    <SectionV2.ActionCollapseSection
      ref={ref}
      title={<SectionV2.Title bold={!collapsed}>{title}</SectionV2.Title>}
      action={
        collapsed ? (
          <SectionV2.AddButton onClick={Utils.functional.chain(enableAutofocus, onAdd)} />
        ) : (
          <SectionV2.RemoveButton onClick={Utils.functional.chain(disableAutofocus, onRemove)} />
        )
      }
      collapsed={collapsed}
      onEntered={() => scrollIntoView({ block: 'end' })}
    >
      <Box pt={4}>
        <Input
          value={name}
          onBlur={() => onRename(name)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autofocus}
          onChangeText={setName}
          onEnterPress={withInputBlur()}
        />
      </Box>
    </SectionV2.ActionCollapseSection>
  );
};

export default PathSection;

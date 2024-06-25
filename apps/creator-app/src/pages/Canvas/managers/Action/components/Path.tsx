import { Checkbox, Input, SectionV2, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';

interface Path {
  label: string;
  isDefault?: boolean;
}

interface PathSectionProps {
  path: Path;
  index: number;
  onUpdate: (path: Partial<Path>) => void;
  onRemove?: VoidFunction;
  removeDisabled: boolean;
  updateDefaultPath: (index: number) => void;
}

const PathSection: React.FC<PathSectionProps> = ({
  path,
  onUpdate,
  onRemove,
  index,
  updateDefaultPath,
  removeDisabled,
}) => {
  const [label, setLabel] = useLinkedState(path.label);
  return (
    <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />}>
      <Input
        value={label}
        placeholder="Add path name"
        onBlur={() => onUpdate({ label })}
        onChangeText={setLabel}
        rightAction={
          <TippyTooltip
            content={path.isDefault ? 'Default Path' : 'Assign as default path'}
            position="top"
            offset={[0, 8]}
          >
            <Checkbox
              checked={path.isDefault}
              onChange={swallowEvent(() => updateDefaultPath(index))}
              padding={false}
            />
          </TippyTooltip>
        }
      />
    </SectionV2.ListItem>
  );
};

export default PathSection;

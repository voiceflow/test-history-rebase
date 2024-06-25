import type { MenuTypes } from '@voiceflow/ui';
import { ContextMenu, SectionV2 } from '@voiceflow/ui';
import React from 'react';

interface SectionProps {
  onClick: VoidFunction;
  onRemove?: VoidFunction;
}

const Section: React.FC<SectionProps> = ({ onClick, onRemove }) => {
  const options: MenuTypes.Option[] = [...(onRemove ? [{ label: 'Remove', onClick: onRemove }] : [])];

  return (
    <>
      <SectionV2.Divider />

      <ContextMenu options={options}>
        {({ onContextMenu }) => (
          <SectionV2.LinkSection onClick={onClick} onContextMenu={onContextMenu}>
            <SectionV2.Title>No match</SectionV2.Title>
          </SectionV2.LinkSection>
        )}
      </ContextMenu>
    </>
  );
};

export default Section;

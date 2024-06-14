import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

interface GeneralUploadButtonProps {
  onClick: VoidFunction;
  loading: boolean;
  progress: number;
}

const PublishButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  return (
    <TooltipWithKeys
      text="Publishing"
      hotkeys={[{ label: `${progress || 0}%` }]}
      modifiers={modifiers}
      placement="bottom"
      referenceElement={({ ref, onOpen, onClose }) => (
        <Header.Button.Secondary
          ref={ref}
          label="Publish"
          onClick={onClick}
          disabled={loading}
          isLoading={loading}
          onPointerEnter={loading ? onOpen : undefined}
          onPointerLeave={onClose}
        />
      )}
    />
  );
};

export default PublishButton;

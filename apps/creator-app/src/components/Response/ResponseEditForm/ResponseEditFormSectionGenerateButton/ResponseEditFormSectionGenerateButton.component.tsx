import { ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { Section, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { RESPONSE_VARIANT_TYPE_LABEL_MAP } from '../../Response.constant';
import type { IResponseEditFormSectionGenerateButton } from './ResponseEditFormSectionGenerateButton.interface';

export const ResponseEditFormSectionGenerateButton: React.FC<IResponseEditFormSectionGenerateButton> = ({ type, onClick, loading }) => {
  const isTextVariant = type === ResponseVariantType.TEXT;

  return (
    <Tooltip
      width={165}
      placement="top"
      referenceElement={({ ref, onOpen, onClose }) => (
        <Section.Header.Button
          ref={ref}
          onClick={onClick}
          iconName="Generate"
          disabled={!isTextVariant || loading}
          isLoading={loading}
          onPointerEnter={!isTextVariant ? onOpen : undefined}
          onPointerLeave={!isTextVariant ? onClose : undefined}
        />
      )}
    >
      {() => <Tooltip.Caption>Variant generation is not available for {RESPONSE_VARIANT_TYPE_LABEL_MAP[type]} responses.</Tooltip.Caption>}
    </Tooltip>
  );
};

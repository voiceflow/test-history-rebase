import { Section } from '@voiceflow/ui-next';
import React from 'react';

import type { IResponseEditFormSectionGenerateButton } from './ResponseEditFormSectionGenerateButton.interface';

export const ResponseEditFormSectionGenerateButton: React.FC<IResponseEditFormSectionGenerateButton> = ({
  onClick,
  loading,
  disabled,
}) => <Section.Header.Button onClick={onClick} iconName="Generate" disabled={disabled} isLoading={loading} />;

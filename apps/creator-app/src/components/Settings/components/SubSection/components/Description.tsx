import type { SectionV2Types } from '@voiceflow/ui';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

export interface DescriptionProps extends SectionV2Types.DescriptionProps, React.PropsWithChildren {}

const Description: React.FC<DescriptionProps> = ({ color, ...props }) => (
  <SectionV2.Description block secondary color={color as any} lineHeight="20px" {...props} />
);

export default Description;

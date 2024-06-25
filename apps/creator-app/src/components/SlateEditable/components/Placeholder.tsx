import React from 'react';
import type { RenderPlaceholderProps } from 'slate-react';

import { styled } from '@/hocs/styled';

export const PlaceholderText = styled.span`
  color: #8da2b5 !important;
  font-weight: 400;
  opacity: 1 !important;
  font-size: 15px;
  font-family: 'Open Sans', sans-serif !important;
  text-decoration: none;
  font-style: normal;
`;

const Placeholder: React.FC<RenderPlaceholderProps> = ({ attributes, children }) => (
  <PlaceholderText {...attributes}>{children}</PlaceholderText>
);

export default Placeholder;

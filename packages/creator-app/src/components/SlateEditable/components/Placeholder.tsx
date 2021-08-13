import React from 'react';
import { RenderPlaceholderProps } from 'slate-react';

import { styled } from '@/hocs';

const PlaceholderText = styled.span`
  color: #132144 !important;
  font-weight: 400;
  font-size: 15px;
  font-family: 'Open Sans', sans-serif !important;
  text-decoration: none;
  font-style: normal;
`;

const Placeholder: React.FC<RenderPlaceholderProps> = ({ attributes, children }) => <PlaceholderText {...attributes}>{children}</PlaceholderText>;

export default Placeholder;

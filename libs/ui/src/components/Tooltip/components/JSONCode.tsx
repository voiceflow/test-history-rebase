import React from 'react';

import { styled } from '@/styles';

const Pre = styled.pre`
  background-color: #142e55;
  font-size: 13px;
  line-height: 20px;
  color: #fff;
  margin: 0 -32px;
  padding: 16px 32px;
  white-space: pre-wrap;
  font-family: 'Open Sans';

  span {
    color: #e1d40b;
  }
`;

export interface JSONCodeProps extends Omit<React.ComponentProps<'pre'>, 'ref'>, React.PropsWithChildren {
  html: string;
}

const JSONCode: React.FC<JSONCodeProps> = ({ html, ...props }) => (
  <Pre {...props} dangerouslySetInnerHTML={{ __html: html }} />
);

export default JSONCode;

import React from 'react';

import { styled } from '@/hocs';

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

const JSONCode = ({ html, ...props }) => <Pre {...props} dangerouslySetInnerHTML={{ __html: html }} />;

export default JSONCode;

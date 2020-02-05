import React from 'react';

import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const CanvasReadOnlyContainer = styled(Flex)`
  position: absolute;
  float: left;
  top: 15px;
  left: 30px;
  z-index: 30;
  color: #62778c;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
  background-color: #fff;
  border-radius: 5px;
  transition: all 0.1s ease;
  padding: 8px 12px;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.08);
  line-height: 18px;
  animation: fadein 0.3s ease both, movein 0.3s ease both;
  user-select: none;
`;

const CanvasReadOnly = () => (
  <CanvasReadOnlyContainer>
    <img className="mr-2" alt="eye" src="/eye.svg" width={16} height={16} />
    <span>Read Only</span>
  </CanvasReadOnlyContainer>
);

export default CanvasReadOnly;

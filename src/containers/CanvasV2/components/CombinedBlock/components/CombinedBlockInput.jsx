import React from 'react';
import AutosizeInput from 'react-input-autosize';

import { css, styled } from '@/hocs';

// very annoying but autosize input needs to take in an "inputClassName" property instead of className
// eslint-disable-next-line react/display-name
const MappedAutoSizeInput = React.forwardRef(({ className, ...props }, ref) => <AutosizeInput inputClassName={className} {...props} ref={ref} />);

export const combinedBlockInputStyle = css`
  outline: none !important;
  border: none !important;
  text-align: center;
  padding: 4px 8px;
  margin: -4px -8px;
  height: 19px;
  background: #dce3eb;
  color: #62778c;
  font-weight: 600;
  letter-spacing: 0.1px;
  width: 100%;
  border-radius: 5px;
`;

const CombinedBlockInput = styled(MappedAutoSizeInput)`
  ${combinedBlockInputStyle}
`;

export default CombinedBlockInput;

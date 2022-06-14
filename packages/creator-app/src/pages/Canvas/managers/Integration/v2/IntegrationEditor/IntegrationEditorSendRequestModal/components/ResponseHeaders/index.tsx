import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { CustomAPITestResponse } from '@/pages/Canvas/managers/Integration/types';

import ResponseMetadata from '../ResponseMetadata';
import * as StyledResponseHeaders from './styles';

interface ResponseHeadersProps {
  response: CustomAPITestResponse;
}

const ResponseHeaders: React.FC<ResponseHeadersProps> = ({ response }) => {
  if (!response.headers?.length) return null;

  return (
    <StyledResponseHeaders.ResponseHeaderContainer>
      {response.headers?.map((header, index) => (
        <StyledResponseHeaders.HeaderItem key={index}>
          <Text fontSize={15} color="#132144">
            {header.key}
          </Text>
          <SvgIcon icon="collon" color="#6E849A" style={{ marginRight: '8px', marginLeft: '8px' }} />
          <Text fontSize={15} color="#132144">
            {header.val}
          </Text>
        </StyledResponseHeaders.HeaderItem>
      ))}

      <ResponseMetadata response={response} />
    </StyledResponseHeaders.ResponseHeaderContainer>
  );
};

export default ResponseHeaders;

import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import type { Response } from '../../types';
import ResponseMetadata from '../ResponseMetadata';
import * as S from './styles';

interface ResponseHeadersProps {
  response: Response;
}

const ResponseHeaders: React.FC<ResponseHeadersProps> = ({ response }) => {
  if (!response.headers?.length) return null;

  return (
    <S.ResponseHeaderContainer>
      {response.headers?.map((header, index) => (
        <S.HeaderItem key={index}>
          <Text fontSize={15} color="#132144">
            {header.key}
          </Text>

          <SvgIcon icon="collon" color="#6E849A" style={{ marginRight: '8px', marginLeft: '8px' }} />

          <Text fontSize={15} color="#132144">
            {header.val}
          </Text>
        </S.HeaderItem>
      ))}

      <ResponseMetadata response={response} />
    </S.ResponseHeaderContainer>
  );
};

export default ResponseHeaders;

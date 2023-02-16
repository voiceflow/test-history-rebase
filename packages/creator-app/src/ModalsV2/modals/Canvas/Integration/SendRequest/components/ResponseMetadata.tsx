import { Flex, Text } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

import { Response } from '../types';

interface ResponseMetadataProps {
  response: Response;
}

const Dot = styled.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: #6e849a;
  margin-left: 8px;
  margin-right: 8px;
`;

const ResponseMetadata: React.FC<ResponseMetadataProps> = ({ response }) => (
  <Flex style={{ alignItems: 'center' }}>
    <Text color={response.metadata.isError ? '#bd425f' : '#38751f'} fontSize={13} fontWeight={600}>
      {response.metadata.isError ? `${response.statusCode} ${response.statusText}` : `${response.statusCode} OK`}
    </Text>

    <Dot />

    <Text fontSize={13} color="#62778c">
      {response.metadata.size}
    </Text>

    <Dot />

    <Text fontSize={13} color="#62778c">
      {response.metadata.time}ms
    </Text>
  </Flex>
);

export default ResponseMetadata;

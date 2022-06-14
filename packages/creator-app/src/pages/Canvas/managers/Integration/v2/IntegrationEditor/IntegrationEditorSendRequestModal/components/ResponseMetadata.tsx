import { Flex, Text } from '@voiceflow/ui';
import React from 'react';

import { CustomAPITestResponse } from '@/pages/Canvas/managers/Integration/types';

interface ResponseMetadataProps {
  response: CustomAPITestResponse;
}

const ResponseMetadata: React.FC<ResponseMetadataProps> = ({ response }) => {
  return (
    <Flex style={{ alignItems: 'center' }}>
      <Text color={response.metadata.isError ? '#bd425f' : '#38751f'} fontSize={13} fontWeight={600}>
        {response.metadata.isError ? `${response.statusCode} ${response.statusText}` : `${response.statusCode} OK`}
      </Text>
      <Text fontSize={13} color="#62778c" ml={18} mr={18}>
        {response.metadata.size}
      </Text>
      <Text fontSize={13} color="#62778c">
        {response.metadata.time}ms
      </Text>
    </Flex>
  );
};

export default ResponseMetadata;

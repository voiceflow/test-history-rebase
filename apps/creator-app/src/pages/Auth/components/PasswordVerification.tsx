import { Box, Text } from '@voiceflow/ui';
import React from 'react';

import {
  PASSWORD_ELEVEN_CHAR_REGEX,
  PASSWORD_LOWERCASE_CHAR_REGEX,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SPECIAL_CHAR_REGEX,
  PASSWORD_UPPERCASE_CHAR_REGEX,
} from './constants';

export interface PasswordVerificationProps {
  password: string;
}

const getOpacity = (regex: RegExp, password: string) => (password.match(regex) ? 0.4 : 1);

const PasswordVerification: React.FC<PasswordVerificationProps> = ({ password }) => (
  <>
    You password should contain:
    <Box mt={10}>
      <ul>
        <li>
          <Text opacity={getOpacity(PASSWORD_ELEVEN_CHAR_REGEX, password)}>At least 11 characters</Text>
        </li>
        <li>
          <Text opacity={getOpacity(PASSWORD_LOWERCASE_CHAR_REGEX, password)}>Lower case character</Text>
        </li>
        <li>
          <Text opacity={getOpacity(PASSWORD_UPPERCASE_CHAR_REGEX, password)}>Upper case character</Text>
        </li>
        <li>
          <Text opacity={getOpacity(PASSWORD_NUMBER_REGEX, password)}>Number</Text>
        </li>
        <li>
          <Text opacity={getOpacity(PASSWORD_SPECIAL_CHAR_REGEX, password)}>Symbol </Text>
          <Text opacity={0.4} fontSize={12}>
            (!#$%&()*+.=@^_-)
          </Text>
        </li>
      </ul>
    </Box>
  </>
);

export default PasswordVerification;

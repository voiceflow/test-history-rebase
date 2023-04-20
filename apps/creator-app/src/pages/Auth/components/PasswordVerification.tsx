import { Box } from '@voiceflow/ui';
import React from 'react';

import { ELEVEN_CHAR_REGEX, LOWERCASE_CHAR_REGEX, NUMBER_REGEX, SPECIAL_CHAR_REGEX, UPPERCASE_CHAR_REGEX } from '@/constants';

export interface PasswordVerificationProps {
  password: string;
}

const getOpacity = (regex: RegExp, password: string) => (regex.test(password) ? 0.4 : 1);

const PasswordVerification: React.FC<PasswordVerificationProps> = ({ password }) => (
  <>
    You password should contain:
    <Box mt={10}>
      <ul>
        <li>
          <Box opacity={getOpacity(ELEVEN_CHAR_REGEX, password)}>At least 11 characters</Box>
        </li>
        <li>
          <Box opacity={getOpacity(LOWERCASE_CHAR_REGEX, password)}>Lower case character</Box>
        </li>
        <li>
          <Box opacity={getOpacity(NUMBER_REGEX, password)}>Upper case character</Box>
        </li>
        <li>
          <Box opacity={getOpacity(SPECIAL_CHAR_REGEX, password)}>Number</Box>
        </li>
        <li>
          <Box opacity={getOpacity(UPPERCASE_CHAR_REGEX, password)}>Symbol</Box>
        </li>
      </ul>
    </Box>
  </>
);

export default PasswordVerification;

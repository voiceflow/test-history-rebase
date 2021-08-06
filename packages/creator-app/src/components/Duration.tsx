import { Text } from '@voiceflow/ui';
import React from 'react';

import { useInterval } from '@/hooks';
import { getAbbrevatedFormat, getTimeDuration } from '@/utils/time';

const DURATION_TIMEOUT = 30000;

interface DurationProps {
  time: string | number;
  short?: boolean;
  color?: string;
}

const Duration: React.FC<DurationProps> = ({ time, short = false, color = '#8da2b5' }) => {
  const [duration, setDuration] = React.useState<string>(() => getTimeDuration(time));

  useInterval(() => setDuration(getTimeDuration(time)), DURATION_TIMEOUT);

  return (
    <Text color={color} fontSize={13}>
      {short ? getAbbrevatedFormat(duration) : `${duration} ago`}
    </Text>
  );
};

export default Duration;

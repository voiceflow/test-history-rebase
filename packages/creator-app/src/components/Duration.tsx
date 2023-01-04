import { Utils } from '@voiceflow/common';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { useInterval } from '@/hooks';

const DURATION_TIMEOUT = 30000;

interface DurationProps {
  time: string | number;
  short?: boolean;
  color?: string;
}

const Duration: React.FC<DurationProps> = ({ time, short = false, color = '#8da2b5' }) => {
  const [duration, setDuration] = React.useState(() => Utils.time.getTimeDuration(time));

  useInterval(() => setDuration(Utils.time.getTimeDuration(time)), DURATION_TIMEOUT);

  const lessThanAMinute = duration.includes('second');
  const durationText = short ? Utils.time.getAbbrevatedFormat(duration) : `${duration} ago`;

  return (
    <Text color={color} fontSize={13}>
      {lessThanAMinute ? 'just now' : durationText}
    </Text>
  );
};

export default Duration;

import React from 'react';

import Text from '@/components/Text';
import { useInterval } from '@/hooks';
import { getAbbrevatedFormat, getTimeDuration } from '@/utils/time';

const DURATION_TIMEOUT = 30000;

type DurationProps = {
  time: string;
  short?: boolean;
};

const Duration: React.FC<DurationProps> = ({ time, short = false }) => {
  const [duration, setDuration] = React.useState<string>(getTimeDuration(time));

  useInterval(() => setDuration(getTimeDuration(time)), DURATION_TIMEOUT);

  return (
    <Text color="#8da2b5" fontSize={13}>
      {short ? getAbbrevatedFormat(duration) : `${duration} ago`}
    </Text>
  );
};

export default Duration;

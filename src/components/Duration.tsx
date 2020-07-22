import React from 'react';

import Text from '@/components/Text';
import { useInterval } from '@/hooks';
import { getTimeDuration } from '@/utils/time';

const DURATION_TIMEOUT = 60000;

type DurationProps = {
  time: string;
};

const Duration: React.FC<DurationProps> = ({ time }) => {
  const [duration, setDuration] = React.useState<string>(getTimeDuration(time));

  useInterval(() => setDuration(getTimeDuration(time)), DURATION_TIMEOUT);

  return (
    <Text color="#8da2b5" fontSize={13}>
      {duration} ago
    </Text>
  );
};

export default Duration;

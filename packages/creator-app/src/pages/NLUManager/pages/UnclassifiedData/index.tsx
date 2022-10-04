import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';

import EmptyScreen from './components/EmptyScreen';

const UnclassifiedData: React.FC = () => {
  const allUnclassifiedUtterances = useSelector(NLUDuck.allUnclassifiedUtterancesSelector);

  if (!allUnclassifiedUtterances.length) return <EmptyScreen />;

  return (
    <div>
      {allUnclassifiedUtterances.map((u) => (
        <div key={u.utterance}>{u.utterance}</div>
      ))}
    </div>
  );
};

export default UnclassifiedData;

import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container } from './components';
import UtteranceRecommendation from './components/UtteranceRecommendation';

const SecondarySlider: React.FC = () => {
  const { showUtteranceRecos, selectedItemId, activeTab } = React.useContext(NLUManagerContext);

  return (
    <Container isOpened={showUtteranceRecos}>
      {activeTab === InteractionModelTabType.INTENTS && selectedItemId && <UtteranceRecommendation intentID={selectedItemId} />}
    </Container>
  );
};

export default SecondarySlider;

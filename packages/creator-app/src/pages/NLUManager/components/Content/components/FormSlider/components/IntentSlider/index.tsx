import React from 'react';

import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';

import Cards from './Cards';

interface IntentSliderProps {
  intentID: string;
}

const IntentSlider: React.FC<IntentSliderProps> = ({ intentID }) => {
  return (
    <>
      <Cards intentID={intentID} />
      <EditIntentForm intentID={intentID} rightSlider />
    </>
  );
};

export default IntentSlider;

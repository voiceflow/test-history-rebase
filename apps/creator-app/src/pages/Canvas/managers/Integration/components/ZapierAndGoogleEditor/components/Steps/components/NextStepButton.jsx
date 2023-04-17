import React from 'react';

const NextStepButton = ({ openNextStep }) => (
  <div className="text-center mt-3">
    <button className="btn-primary" onClick={() => openNextStep()}>
      Next
    </button>
  </div>
);

export default NextStepButton;

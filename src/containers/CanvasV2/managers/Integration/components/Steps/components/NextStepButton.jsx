import React from 'react';

function NextStepButton({ openNextStep }) {
  return (
    <div className="text-center mt-3">
      <button className="btn-primary" onClick={() => openNextStep()}>
        Next
      </button>
    </div>
  );
}

export default NextStepButton;

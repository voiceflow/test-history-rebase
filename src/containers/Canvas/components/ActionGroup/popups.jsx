import React from 'react';
import BaseConfetti from 'react-dom-confetti';
import { Modal } from 'reactstrap';

import Button from '@/components/Button';
import { ModalHeader } from '@/components/Modals/ModalHeader';

export function Confetti({ active }) {
  return (
    <div id="confetti-positioner">
      <BaseConfetti
        active={active}
        config={{
          angle: 90,
          spread: 70,
          startVelocity: 50,
          elementCount: 75,
          dragFriction: 0.05,
          duration: 8000,
          delay: 0,
        }}
      />
    </div>
  );
}

export function DisplayUploadPrompt({ showPrompt, onButtonClick, children }) {
  return (
    showPrompt && (
      <div className="upload-success-popup">
        <Button className="close close-upload-success-popup mt-2" onClick={onButtonClick} />
        {children}
      </div>
    )
  );
}

export function SettingsModal({ isOpen, onToggle, children }) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} className="ag__settings_modal">
      <div className="ag__settings_header">
        <ModalHeader toggle={onToggle} className="pb-2" header="Project Settings" />
      </div>
      {children}
    </Modal>
  );
}

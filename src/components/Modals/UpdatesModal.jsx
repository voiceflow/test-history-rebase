import Button from 'components/Button';
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

const class_mapping = {
  FEATURE: {
    class: 'update-modal-feature',
    label: 'New Feature',
  },
  UPDATE: {
    class: 'update-modal-update',
    label: 'Update',
  },
  CHANGE: {
    class: 'update-modal-change',
    label: 'Change',
  },
  empty: {
    class: 'update-modal-change',
    label: '',
  },
};

const UpdatesModal = ({ show_update_modal, toggle, product_updates }) => {
  return (
    <Modal isOpen={show_update_modal} toggle={toggle} centered>
      <div className="pt-3 mb-0 text-center">
        <p className="mb-0" id="update-modal-header-title">
          Since you've been gone{' '}
          <span role="img" aria-label="jsx-a11y/accessible-emoji">
            ✨
          </span>
        </p>
      </div>
      <ModalBody className="text-center pl-0 pr-0">
        <hr className="mt-0 w-100" />
        <div className="update-modal-body mb-4">
          {Array.isArray(product_updates) &&
            product_updates.map((entry, i) => {
              return (
                <React.Fragment key={i}>
                  <div align="left" className="pr-4 pl-4">
                    <p className={class_mapping[entry.type].class}>&bull; {class_mapping[entry.type].label}: </p>
                    {/* eslint-disable-next-line xss/no-mixed-html */}
                    <p className="update-modal-txt" dangerouslySetInnerHTML={{ __html: entry.details }} />
                  </div>
                  <hr className="w-100" />
                </React.Fragment>
              );
            })}
        </div>
        <div>
          <Button isBtn isClear onClick={toggle}>
            Got it!
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UpdatesModal;

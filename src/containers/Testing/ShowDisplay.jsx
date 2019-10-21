import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Modal, { ModalBody, ModalHeader } from '@/components/Modal';
import SvgIcon from '@/components/SvgIcon';
import DisplayRender from '@/containers/CanvasV2/managers/Display/components/DisplayRender';
import { allDisplaysSelector } from '@/ducks/display';
import { testDisplaySelector } from '@/ducks/test';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';

function ShowDisplay({ displays, currentDisplay }) {
  const [isOpen, toggle] = useToggle();
  const apl = currentDisplay && displays.filter((display) => display.id === currentDisplay.current_display)[0];

  return (
    <>
      <div onClick={toggle} className={cn('d-flex align-items-center pointer mr-2', { disabled: !apl })}>
        <Tooltip title="Show Device Display" position="bottom">
          <SvgIcon icon="display" />
        </Tooltip>
      </div>
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Display Preview</ModalHeader>
        <ModalBody className="pt-0">{apl && <DisplayRender apl={apl.document} data={currentDisplay.datasource} commands="[]" />}</ModalBody>
      </Modal>
    </>
  );
}

const mapStateToProps = {
  displays: allDisplaysSelector,
  currentDisplay: testDisplaySelector,
};

export default connect(mapStateToProps)(ShowDisplay);

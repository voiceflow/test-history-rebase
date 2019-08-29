import cn from 'classnames';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import SvgIcon from '@/components/SvgIcon';
import DisplayRender from '@/containers/Canvas/Editors/components/DisplayRender';

function showDisplay(props) {
  const { displays, currentDisplay } = props;
  const [showDisplay, setShow] = useState(false);
  const toggle = () => setShow(!showDisplay);
  const apl = currentDisplay && displays.filter((display) => display.display_id === currentDisplay.current_display)[0];
  return (
    <>
      <div onClick={toggle} className={cn('d-flex align-items-center pointer mr-2', { disabled: !apl })}>
        <Tooltip title="Show Device Display" position="bottom">
          <SvgIcon icon="display" />
        </Tooltip>
      </div>
      <Modal isOpen={showDisplay} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Display Preview</ModalHeader>
        <ModalBody className="pt-0">{apl && <DisplayRender apl={apl.document} data={currentDisplay.datasource} commands="[]" />}</ModalBody>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  displays: state.displays.displays,
  currentDisplay: state.test.state.display_info,
});

export default connect(mapStateToProps)(showDisplay);

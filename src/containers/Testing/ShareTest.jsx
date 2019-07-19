import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody } from 'reactstrap';

import RoundButton from '@/components/Button/RoundButton';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { shareTest } from '@/ducks/test';
import ShareIcon from '@/svgs/share.svg';

const TestingHeader = (props) => {
  const { shareTest, rendered, render } = props;

  const [share, setShare] = useState(false);
  const [link, setLink] = useState(false);

  const makeConfig = async () => {
    setShare(!share);
    if (!share) {
      setLink(`${window.location.origin}/demo/${await shareTest(render)}`);
    }
  };

  return (
    <>
      <Tooltip title="Share Test" position="bottom">
        <RoundButton
          id="icon-share"
          active={share}
          type="color"
          color="#5b9dfa"
          width={42}
          height={42}
          icon={ShareIcon}
          onClick={makeConfig}
          imgSize={15}
        />
      </Tooltip>
      <Popover placement="bottom" isOpen={share} target="icon-share" toggle={makeConfig} className="mt-3 share">
        <PopoverBody>
          {rendered && link ? (
            <>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <ClipBoard component="button" className="btn btn-clear copy-link" value={link} id="shareLink">
                    <i className="fas fa-copy" />
                  </ClipBoard>
                </InputGroupAddon>
                <Input readOnly value={link} className="form-control-border right" />
              </InputGroup>
              <div className="text-center text-dull p-2 mt-1">Share and test your project in the browser</div>
            </>
          ) : (
            <div className="text-center pt-2 pb-1">
              <div className="loader text-md" />
            </div>
          )}
        </PopoverBody>
      </Popover>
    </>
  );
};

const mapStateToProps = (state) => ({
  rendered: state.test.rendered,
});

const mapDispatchToProps = {
  shareTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);

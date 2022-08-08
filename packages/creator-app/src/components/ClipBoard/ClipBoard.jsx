import { flexEndStyles, SVG, SvgIcon } from '@voiceflow/ui';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import Clipboard from './ClipBoardSource';

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopiedContainer = styled.div`
  padding-top: 10px;
  display: flex;
`;

const Input = styled.input`
  display: block;
  flex: 1;
  width: 100%;
  padding: ${(props) => ('locked' in props ? '8px 16px 8px 42px' : '8px 16px')};
  font: normal 15px/1.4666666667 Open Sans, Arial, sans-serif;
  color: #132144;
  background: #fff;
  border: 1px solid #d4d9e6;
  margin-bottom: 0;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, padding 0.12s linear,
    max-height 0.12s linear;
`;

const InputPrepend = styled.div`
  position: absolute;
  padding: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex: 1;
`;

const CopyButton = styled.div`
  ${flexEndStyles}
  margin-left: 10px;
  min-width: 110px;
  white-space: nowrap;
`;

const ClipBoard = (props) => {
  const { id, name, value, locked, children } = props;
  const [copied, setCopied] = useState(false);
  const copyClearTimeout = useRef(false);

  const handleOnCopy = () => {
    if (copyClearTimeout.current) {
      clearTimeout(copyClearTimeout.current);
    }

    setCopied(true);
    copyClearTimeout.current = setTimeout(() => setCopied(false), 3000);
  };
  return (
    <>
      <InputContainer>
        {children || (
          <InputGroup>
            {'locked' in props && (
              <InputPrepend>
                <SvgIcon icon={locked ? SVG.lockLocked : SVG.lockUnlocked} width={18} height={18} />
              </InputPrepend>
            )}
            <Input readOnly value={value} className="form-control-border right" />
          </InputGroup>
        )}
        <CopyButton>
          <Clipboard
            id={id}
            style={{ cursor: 'pointer' }}
            data-clipboard-text={value}
            component="button"
            className="btn btn-secondary"
            onSuccess={handleOnCopy}
          >
            <span>Copy {name}</span>
          </Clipboard>
        </CopyButton>
      </InputContainer>
      {copied && (
        <CopiedContainer>
          <small className="light-blue">Copied to clipboard</small>
        </CopiedContainer>
      )}
    </>
  );
};

export default ClipBoard;

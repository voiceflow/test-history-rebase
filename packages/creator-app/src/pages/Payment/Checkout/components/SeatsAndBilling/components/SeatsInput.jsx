import { Input } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { styled, transition } from '@/hocs';
import { withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

export const BILLING_SEATS_ELEMENT = 'seats';

const SeatsInputBox = styled(Input)`
  ${transition()}
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  width: 55px;
  padding-right: 5px;
  text-align: center;
  border-color: ${({ hasError }) => (hasError ? '#E91E63 !important' : 'auto')};
`;

const ErrorTooltipContainer = styled.div`
  width: 150px;
`;

const SeatsInput = ({
  payment: {
    state: { focus },
  },
  errorMessage,
  hasError,
  onChange,
  value,
}) => {
  const initialValue = React.useMemo(() => value ?? 0, []);
  const inputRef = React.useRef(null);
  const errorTooltip = errorMessage ? <ErrorTooltipContainer>{errorMessage}</ErrorTooltipContainer> : <span />;
  const [hasFocus, setHasFocus] = React.useState(false);
  const [fetchingResponse, setFetchingResponse] = React.useState(false);
  const updateSeats = (e) => {
    onChange(parseInt(Math.min(Math.max(e.target.value, initialValue), 99), 10).toString());
  };

  React.useEffect(() => {
    if (focus === BILLING_SEATS_ELEMENT) {
      inputRef?.current?.focus();
    }
  }, [focus]);

  React.useEffect(() => {
    setFetchingResponse(false);
  }, [errorMessage]);

  return (
    <Tooltip
      open={hasError && hasFocus && !fetchingResponse && parseInt(value, 10) !== 0 && !!errorMessage}
      position="top-start"
      theme="warning"
      html={errorTooltip}
      distance={5}
    >
      <SeatsInputBox
        id={Identifier.PAYMENT_SEATS_INPUT}
        ref={inputRef}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onClick={() => setHasFocus(true)}
        hasError={hasError}
        value={value}
        type="number"
        onChange={(e) => {
          setFetchingResponse(true);
          updateSeats(e);
        }}
      />
    </Tooltip>
  );
};

export default withPayment(SeatsInput);

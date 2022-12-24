import { Input, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { styled, transition } from '@/hocs/styled';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

export const BILLING_SEATS_ELEMENT = 'seats';

interface SeatsInputBoxProps {
  hasError: boolean;
}

const SeatsInputBox = styled(Input)<SeatsInputBoxProps>`
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

interface SeatsInputProps {
  payment?: PaymentContextProps;
  errorMessage?: string;
  hasError: boolean;
  onChange: (value: number) => void;
  value: number;
}

const SeatsInput: React.FC<SeatsInputProps> = ({ payment, errorMessage, hasError, onChange, value }) => {
  const initialValue = React.useMemo(() => value ?? 0, []);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const errorTooltip = errorMessage ? <ErrorTooltipContainer>{errorMessage}</ErrorTooltipContainer> : <span />;
  const [hasFocus, setHasFocus] = React.useState(false);
  const [fetchingResponse, setFetchingResponse] = React.useState(false);
  const updateSeats = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(Math.min(Math.max(parseInt(e.target.value, 10), initialValue), 99).toString(), 10));
  };

  React.useEffect(() => {
    if (payment?.state.focus === BILLING_SEATS_ELEMENT) {
      inputRef?.current?.focus();
    }
  }, [payment?.state.focus]);

  React.useEffect(() => {
    setFetchingResponse(false);
  }, [errorMessage]);

  return (
    <TippyTooltip
      open={hasError && hasFocus && !fetchingResponse && value !== 0 && !!errorMessage}
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
    </TippyTooltip>
  );
};

export default withPayment(SeatsInput) as React.FC<SeatsInputProps>;

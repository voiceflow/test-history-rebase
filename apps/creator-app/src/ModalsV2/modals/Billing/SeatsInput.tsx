import React from 'react';

import * as S from './styles';

interface SeatsInputProps {
  onChange: (seats: number) => void;
  value: number;
  error?: boolean;
  min?: number;
}

const SeatsInput: React.FC<SeatsInputProps> = ({ value, onChange, error, min = 0 }) => {
  const [inputValue, setInputValue] = React.useState(String(value));

  const onPlusClick = () => {
    const nextSeats = value + 1;
    onChange(nextSeats);
    setInputValue(String(nextSeats));
  };

  const onMinusClick = () => {
    const nextSeats = Math.max(0, value - 1);
    onChange(nextSeats);
    setInputValue(String(nextSeats));
  };

  const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value) {
      const nextSeats = Math.max(min, Number(event.target.value || '0'));
      onChange(nextSeats);
    }
    setInputValue(event.target.value);
  };

  const onBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const nextSeats = Math.max(Number(inputValue || min), min);
    onChange(nextSeats);
    setInputValue(String(nextSeats));
  };

  return (
    <S.StyledInput
      min={1}
      value={inputValue}
      error={error}
      onChange={onChangeInput}
      onBlur={onBlur}
      onPlusClick={onPlusClick}
      onMinusClick={onMinusClick}
    />
  );
};

export default SeatsInput;

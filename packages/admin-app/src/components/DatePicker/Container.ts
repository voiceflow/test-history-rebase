import { styled } from '@/styles';

const DayPickerContainer = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);

  & * {
    outline: none !important;
  }
`;

export default DayPickerContainer;

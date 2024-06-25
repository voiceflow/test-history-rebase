import { styled } from '@/hocs/styled';

const PickerPointer = styled.div`
  width: 16px;
  height: 16px;
  box-shadow:
    rgba(17, 49, 96, 0.08) 0px 0px 0px 1px,
    rgba(17, 49, 96, 0.16) 0px 2px 3px 0px,
    rgb(255, 255, 255) 0px 0px 0px 6px inset,
    rgba(17, 49, 96, 0.08) 0px 0px 0px 7px inset,
    rgba(17, 49, 96, 0.16) 0px 2px 3px 3px inset;
  transform: translate(-8px, -4px);
  border-radius: 8px;
  cursor: pointer;
`;

export default PickerPointer;

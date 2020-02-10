import { styled } from '@/hocs';

const AddCollaborators = styled.p`
  margin-bottom: 0;
  color: #cdad32;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #b99b28;
  }

  /* stylelint-disable */
  & > * {
    padding-right: 6px;
  }

  & > span > svg {
    display: inline-block;
  }
`;

export default AddCollaborators;

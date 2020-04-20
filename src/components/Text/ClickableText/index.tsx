import { styled } from '@/hocs';

const ClickableText = styled.span`
  display: inline-block;
  color: #5d9df5;
  cursor: pointer;
  user-select: none;

  :hover {
    color: #4886da;
  }
`;

export default ClickableText;

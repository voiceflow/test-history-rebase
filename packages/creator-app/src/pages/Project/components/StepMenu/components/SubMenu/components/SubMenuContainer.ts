import { keyframes, styled } from '@/hocs';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const SubMenuContainer = styled.div`
  border-radius: 8px;
  background-color: white;
  height: fit-content;
  width: 154px;
  padding: 6px;
  margin-top: 8px;
  margin-left: 8px;
  box-shadow: 0 0 0 1px rgba(19, 33, 68, 0.04), 0 1px 0 0 rgba(19, 33, 68, 0.02), 0 1px 5px -4px rgba(19, 33, 68, 0.08),
    0 2px 8px -6px rgba(19, 33, 68, 0.24), 0 1px 3px 1px rgba(19, 33, 68, 0.01);
  transition: all 0.08s ease-in-out;

  animation: ${fadeIn} 0.08s;
`;

export default SubMenuContainer;

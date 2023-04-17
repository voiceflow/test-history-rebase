import { styled } from '@/hocs/styled';

export { default as Actions } from './Sections/Actions';
export { default as Context } from './Sections/Context';
export { default as Notes } from './Sections/Notes';
export { default as Tags } from './Sections/Tags';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  max-width: 340px;
  border-left: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
  height: 100%;
  background: white;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

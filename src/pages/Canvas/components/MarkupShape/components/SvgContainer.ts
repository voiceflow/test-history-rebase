import { styled } from '@/hocs';

export type SvgContainerProps = {
  isPresentationMode?: boolean;
};

const SvgContainer = styled.svg<SvgContainerProps>`
  overflow: visible;
  position: ${({ isPresentationMode }) => (isPresentationMode ? 'relative' : 'absolute')};
`;

export default SvgContainer;

import { styled } from '@/hocs';

// eslint-disable-next-line no-secrets/no-secrets
const VF_LOGO = 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/dohvpzgjnwzndaen346r';
const DEFAULT_SIZE = 48;

type BoxLogoProps = {
  url?: string;
  size?: number;
};

const BoxLogo = styled.div<BoxLogoProps>`
  display: inline-block;
  width: ${({ size = DEFAULT_SIZE }) => size}px;
  height: ${({ size = DEFAULT_SIZE }) => size}px;
  margin-bottom: 32px;
  border-radius: 12px;
  border: solid 2px white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  background: url('${({ url = VF_LOGO }) => url}');
  background-size: contain;
`;

export default BoxLogo;

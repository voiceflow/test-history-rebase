import { styled } from '@/hocs';

const Effect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  padding: 10px 0 10px 20px;

  &:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
  }
`;

export default Effect;

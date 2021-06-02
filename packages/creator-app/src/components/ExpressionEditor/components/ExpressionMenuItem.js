import { styled } from '@/hocs';

const ExpressionMenuItem = styled.div`
  padding: 8px 20px;
  cursor: pointer;

  &:hover {
    color: #62778c;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
  }
`;

export default ExpressionMenuItem;

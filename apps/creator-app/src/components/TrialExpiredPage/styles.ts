import { blurryTranscripts } from '@/assets';
import { styled } from '@/hocs/styled';

export const SvgShadow = styled.div`
  background-color: #e3f0ff;
  border-radius: 50%;
  height: 104px;
  width: 104px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const UpgradeBox = styled.div`
  background-color: white;
  padding: 32px 32px;
  border: 1px solid rgba(17, 49, 96, 0.1);
  border-radius: 10px;
  margin-bottom: 100px;
  max-width: 316px;
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.04);
`;

export const BackgroundContainer = styled.div`
  background: rgba(249, 249, 249, 0.75) url('${blurryTranscripts}') center no-repeat;
  background-size: contain;
  filter: blur(32px);
  -webkit-filter: blur(32px);
  width: 100%;
  height: 100%;
  position: fixed;
  margin: 0 0 0 65px;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
`;

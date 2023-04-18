import BaseAceEditor from '@/components/AceEditor';
import { styled, units } from '@/hocs/styled';

export const AceEditor = styled(BaseAceEditor).attrs({
  fontSize: 14,
  minLines: 9.5,
  maxLines: 17,
  tabSize: 0,
  fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  wrapEnabled: true,
  scrollMargin: [12, 12, 0, 0],
})`
  color: #132144 !important;
  border: solid 1px #d4d9e6;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);

  .ace_gutter {
    background: #fff !important;
  }

  .ace_placeholder {
    margin-top: 12px;
    margin-left: 4px;
    color: #8da2b5;
  }

  .ace_gutter-cell {
    font-size: 13;
    line-height: 19px;
    color: #8da2b5;
  }
`;

interface SeparatorProps {
  isLast?: boolean;
}

export const Separator = styled.div<SeparatorProps>`
  position: relative;
  right: -${units(4)}px;
  width: calc(100% + ${units(4)}px);
  height: 1px;
  margin-top: ${units(2)}px;
  margin-left: -${units(4)}px;
  margin-bottom: ${({ isLast }) => (isLast ? 0 : units(2))}px;
  background-color: #eaeff4;
`;

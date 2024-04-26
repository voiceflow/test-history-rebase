import { Box, Checkbox } from '@voiceflow/ui';
import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import { styled } from '@/hocs/styled';

import type { Diff } from './diff';

const StyledViewerContainer = styled(Box)`
  pre {
    line-height: 16px !important;
  }
`;

const MAX_DIFF_LENGTH = 10000;

const DiffItem: React.FC<{ diff: Diff<{ name: string }>; toggleDiff: VoidFunction; name?: string }> = ({
  diff,
  toggleDiff,
  name,
}) => {
  const [diffView, setDiffView] = React.useState<boolean>(false);
  const [overflow, setOverflow] = React.useState<boolean>(false);
  const stringifiedDiff = React.useRef<{ currentResource?: string; nextResource?: string }>({
    currentResource: undefined,
    nextResource: undefined,
  });

  const toggleDiffView = () => {
    if (!stringifiedDiff.current.nextResource) {
      stringifiedDiff.current.nextResource = JSON.stringify(diff.nextResource, null, 2);
      stringifiedDiff.current.currentResource = JSON.stringify(diff.currentResource || undefined, null, 2);
      const totalLength =
        stringifiedDiff.current.nextResource.length + (stringifiedDiff.current.currentResource?.length ?? 0);

      setOverflow(totalLength > MAX_DIFF_LENGTH);
    }

    setDiffView((prev) => !prev);
  };

  return (
    <>
      <Box.FlexApart mb={11}>
        <Box flexGrow={1} onClick={toggleDiffView} cursor="pointer" fontWeight={diffView ? 600 : 400}>
          {name || diff.nextResource.name || <i>(untitled)</i>}
        </Box>
        <Box.FlexApart width={120} flexDirection="row-reverse" px={22}>
          <Checkbox checked={diff.useNext} padding={false} onClick={toggleDiff} />
          {!!diff.currentResource && <Checkbox checked={!diff.useNext} onClick={toggleDiff} />}
        </Box.FlexApart>
      </Box.FlexApart>

      {diffView &&
        (overflow ? (
          <Box.FlexCenter mb={11}>
            <i>The difference is too large to be displayed</i>
          </Box.FlexCenter>
        ) : (
          <StyledViewerContainer fontSize={13} mx={-32} mb={11}>
            <ReactDiffViewer
              oldValue={stringifiedDiff.current.currentResource}
              newValue={stringifiedDiff.current.nextResource}
              splitView={true}
            />
          </StyledViewerContainer>
        ))}
    </>
  );
};

export default React.memo(DiffItem, (prev, next) => prev.diff === next.diff);

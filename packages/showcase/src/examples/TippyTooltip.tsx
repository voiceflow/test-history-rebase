import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const html = createExample('html', ({ isPage }) => (
  <TippyTooltip html={<b>html</b>} open={isPage}>
    hover
  </TippyTooltip>
));

const simple = createExample('simple', ({ isPage }) => (
  <TippyTooltip title="Title" open={isPage}>
    hover
  </TippyTooltip>
));

const withHotkey = createExample('with hotkey', ({ isPage }) => (
  <TippyTooltip title="Title" hotkey="S" open={isPage}>
    hover
  </TippyTooltip>
));

const multiline = createExample('multiline', ({ isPage }) => (
  <TippyTooltip
    html={
      <TippyTooltip.Multiline>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.Multiline>
    }
    open={isPage}
  >
    hover
  </TippyTooltip>
));

const multilineWithTitle = createExample('multiline with title', ({ isPage }) => (
  <TippyTooltip
    html={
      <TippyTooltip.Multiline>
        <TippyTooltip.Title>Title</TippyTooltip.Title>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.Multiline>
    }
    open={isPage}
  >
    hover
  </TippyTooltip>
));

const withButton = createExample('with button', ({ isPage }) => (
  <TippyTooltip
    html={
      <TippyTooltip.FooterButton buttonText="More" onClick={() => null}>
        <TippyTooltip.Title>Title</TippyTooltip.Title>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.FooterButton>
    }
    open={isPage}
    interactive
  >
    hover
  </TippyTooltip>
));

export default createSection('TippyTooltip', 'src/components/TippyTooltip/index.tsx', [
  simple,
  withHotkey,
  html,
  multiline,
  multilineWithTitle,
  withButton,
]);

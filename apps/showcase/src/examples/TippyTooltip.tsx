import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const simple = createExample('simple', ({ isPage }) => (
  <TippyTooltip content="Title" visible={isPage}>
    hover
  </TippyTooltip>
));

const withHotkey = createExample('with hotkey', ({ isPage }) => (
  <TippyTooltip content={<TippyTooltip.WithHotkey hotkey="S">Title</TippyTooltip.WithHotkey>} visible={isPage}>
    hover
  </TippyTooltip>
));

const multiline = createExample('multiline', ({ isPage }) => (
  <TippyTooltip
    width={208}
    content={
      <TippyTooltip.Multiline>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.Multiline>
    }
    visible={isPage}
  >
    hover
  </TippyTooltip>
));

const multilineWithTitle = createExample('multiline with title', ({ isPage }) => (
  <TippyTooltip
    width={208}
    content={
      <TippyTooltip.Multiline>
        <TippyTooltip.Title>Title</TippyTooltip.Title>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.Multiline>
    }
    visible={isPage}
  >
    hover
  </TippyTooltip>
));

const withButton = createExample('with button', ({ isPage }) => (
  <TippyTooltip
    width={232}
    content={
      <TippyTooltip.FooterButton buttonText="More" onClick={() => null}>
        <TippyTooltip.Title>Title</TippyTooltip.Title>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
        the 1500s
      </TippyTooltip.FooterButton>
    }
    visible={isPage}
    interactive
  >
    hover
  </TippyTooltip>
));

export default createSection('TippyTooltip', 'src/components/TippyTooltip/index.tsx', [
  simple,
  withHotkey,
  multiline,
  multilineWithTitle,
  withButton,
]);

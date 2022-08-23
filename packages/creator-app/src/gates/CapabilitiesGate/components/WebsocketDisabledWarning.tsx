import { FlexCenter, Link, PageError } from '@voiceflow/ui';
import React from 'react';

import { supportGraphicSmall } from '@/assets';

const RealtimeDisabledWarning: React.FC = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <PageError
      icon={<img src={supportGraphicSmall} alt="" />}
      title="Browser Not Supported"
      message={
        <>
          Voiceflow requires your browser to support <Link href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API">WebSocket</Link>{' '}
          technology for communication.
          <br />
          <br />
          Consider switching to: <br />
          <Link href="https://www.google.com/chrome">Google Chrome</Link>
          <br />
          <Link href="https://www.mozilla.org/firefox">Mozilla Firefox</Link>
          <br />
          <Link href="https://www.microsoft.com/edge">Microsoft Edge</Link>
          <br />
          <Link href="https://www.apple.com/ca/safari/">Apple Safari</Link> (macOS only)
          <br /> or other equivalent modern web browsers.
        </>
      }
    ></PageError>
  </FlexCenter>
);

export default RealtimeDisabledWarning;

import React from 'react';

import { ClickableText } from '@/components/Text';
import { useOpenIntercom } from '@/vendors/intercom';

function ChatWithUsLink({ children }) {
  const openIntercom = useOpenIntercom();

  return (
    <ClickableText>
      <a href="/" onClick={openIntercom}>
        {children}
      </a>
    </ClickableText>
  );
}

export default ChatWithUsLink;

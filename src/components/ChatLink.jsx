import React from 'react';

import { ClickableText } from '@/components/Text';

function ChatWithUsLink({ children }) {
  return (
    <ClickableText>
      <a href="/" className="custom_intercom_launcher">
        {children}
      </a>
    </ClickableText>
  );
}

export default ChatWithUsLink;

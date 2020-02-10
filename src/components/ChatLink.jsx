import React from 'react';

import ClickableText from '@/components/Text/ClickableText';

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

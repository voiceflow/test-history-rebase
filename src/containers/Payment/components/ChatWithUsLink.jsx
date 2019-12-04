import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';

function ChatWithUsLink() {
  return (
    <ClickableText>
      <a href="/" className="custom_intercom_launcher">
        Questions? Start a chat
      </a>
    </ClickableText>
  );
}

export default ChatWithUsLink;

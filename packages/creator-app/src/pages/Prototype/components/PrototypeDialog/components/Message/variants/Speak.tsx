import { Link, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import Markdown, { MarkdownOptions } from 'markdown-to-jsx';
import React from 'react';

import { NEW_LINE_REGEX, SSML_TAG_REGEX, URL_REGEX } from '@/constants';
import perf, { PerfAction } from '@/performance';
import { ClassName } from '@/styles/constants';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type SpeakProps = Omit<MessageProps, 'iconProps'> & {
  voice?: string;
  message: string;
};

const ALL_URLS_REGEXP = new RegExp(URL_REGEX, 'g');

const MARKDOWN_OPTIONS: MarkdownOptions = {
  forceInline: true,
  overrides: { a: (props) => <Link {...props} onClick={stopPropagation()} /> },
};

const Speak: React.FC<SpeakProps> = ({ voice, message, className, ...props }) => {
  const formattedMessage = React.useMemo(
    () => message.replace(SSML_TAG_REGEX, '').replace(ALL_URLS_REGEXP, '[$1]($1)').replace(NEW_LINE_REGEX, '  \n'), // double spaces is a "Line Return" in the markdown
    [message]
  );

  React.useEffect(() => {
    if (formattedMessage) {
      perf.action(PerfAction.PROTOTYPE_SPEAK_RENDERED);
    }
  }, [!!formattedMessage]);

  return formattedMessage ? (
    <Message className={cn(ClassName.CHAT_DIALOG_SPEAK_MESSAGE, className)} {...props}>
      <Markdown options={MARKDOWN_OPTIONS}>{formattedMessage}</Markdown>
    </Message>
  ) : null;
};

export default Speak;

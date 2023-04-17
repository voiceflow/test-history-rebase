import { AudioPlayer, Link, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React from 'react';

import { ALL_URLS_REGEX, NEW_LINE_REGEX, SSML_TAG_REGEX } from '@/constants';
import perf, { PerfAction } from '@/performance';
import { ClassName } from '@/styles/constants';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface SpeakProps extends Omit<BaseMessageProps, 'iconProps'> {
  ai?: boolean;
  src?: string | null;
  audio?: HTMLAudioElement;
  voice?: string;
  message: string;
  isMuted?: boolean;
  onPause?: VoidFunction;
  onContinue?: VoidFunction;
}

const MARKDOWN_OPTIONS: MarkdownToJSX.Options = {
  overrides: { a: { component: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <Link {...props} onClick={stopPropagation()} /> } },
  forceInline: true,
};

const Speak: React.FC<SpeakProps> = ({ ai, src, audio, voice, message, className, onPause, onContinue, ...props }) => {
  const audioPlayer = AudioPlayer.useAudioPlayer({ audioURL: src });

  const formattedMessage = React.useMemo(
    () => message.replace(SSML_TAG_REGEX, '').replace(ALL_URLS_REGEX, '[$1]($1)').replace(NEW_LINE_REGEX, '  \n'), // double spaces is a "Line Return" in the markdown
    [message]
  );

  React.useEffect(() => {
    if (formattedMessage) {
      perf.action(PerfAction.PROTOTYPE_SPEAK_RENDERED);
    }
  }, [!!formattedMessage]);

  React.useEffect(() => {
    if (audioPlayer.playing) {
      onPause?.();
    } else {
      onContinue?.();
    }

    const forcePause = () => audioPlayer.onPause();

    audio?.addEventListener('play', forcePause);

    return () => {
      audio?.removeEventListener('play', forcePause);
    };
  }, [audioPlayer.playing, audio]);

  return formattedMessage ? (
    <BaseMessage onClick={audioPlayer.onToggle} className={cn(ClassName.CHAT_DIALOG_SPEAK_MESSAGE, className)} {...props} isAiMessage={ai}>
      <Markdown options={MARKDOWN_OPTIONS}>{formattedMessage}</Markdown>
    </BaseMessage>
  ) : null;
};

export default Speak;

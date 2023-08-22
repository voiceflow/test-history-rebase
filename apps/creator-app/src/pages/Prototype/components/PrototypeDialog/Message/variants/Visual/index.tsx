import { BaseNode } from '@voiceflow/base-types';
import { Link } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';

import { VisualMessage } from '@/pages/Prototype/types';

import BaseMessage, { BaseMessageProps } from '../../Base';
import * as S from './styles';

interface VisualProps extends BaseMessageProps {
  visual: VisualMessage;
  isTranscript?: boolean;
}

const Visual: React.FC<VisualProps> = ({ visual, isTranscript, ...props }) => {
  const imageURL = React.useMemo(() => {
    const isImageType = visual.visualType === BaseNode.Visual.VisualType.IMAGE;
    const imageURL = (isImageType ? visual.image : visual.imageURL) ?? '';

    if (!imageURL.includes('.gif')) return imageURL;

    const parsedURL = queryString.parseUrl(imageURL);

    return queryString.stringifyUrl({ ...parsedURL, query: { ...parsedURL.query, _vfV: Date.now() } });
  }, [visual]);

  return (
    <S.VisualContainer>
      <BaseMessage bubble={false} {...props}>
        <Link href={imageURL} style={{ pointerEvents: 'none' }}>
          <S.Image src={imageURL} borderRadius={12} />
        </Link>
      </BaseMessage>
    </S.VisualContainer>
  );
};

export default Visual;

import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { ButtonGroup } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { OnInteraction } from '@/pages/Prototype/types';
import { textFieldHasValue } from '@/utils/prototypeMessage';

import { handleRequestActions } from '../../../utils';
import BaseMessage, { BaseMessageProps } from '../../Base';
import * as S from './styles';

interface CardV2Props extends Omit<BaseMessageProps, 'iconProps'>, BaseNode.CardV2.TraceCardV2 {
  onInteraction: OnInteraction;
}

const CardV2: React.FC<CardV2Props> = ({ title, description, imageUrl, buttons, onInteraction, color, ...messageProps }) => {
  const hasInfo = Boolean(title || textFieldHasValue(description?.slate));

  return (
    <BaseMessage {...messageProps} bubble={false}>
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
        <S.Card>
          {imageUrl && <S.CardImage src={imageUrl} roundedBottomBorders={!hasInfo && !buttons?.length} />}
          {hasInfo && (
            <S.CardHeader>
              <S.CardHeaderInfo>
                <S.CardTitle>{title}</S.CardTitle>
                {(description.slate && <S.CardDescription>{SlateEditable.serializeToJSX(description.slate)}</S.CardDescription>) ||
                  (description.text && <S.CardDescription>{description.text}</S.CardDescription>)}
              </S.CardHeaderInfo>
            </S.CardHeader>
          )}
          {!!buttons?.length && (
            <ButtonGroup>
              {buttons.map(({ request, name }) => (
                <S.Button
                  key={request.type}
                  onClick={Utils.functional.chainVoid(handleRequestActions(request), () => onInteraction({ name, request }))}
                  color={color}
                  hasInfo={hasInfo}
                >
                  {name}
                </S.Button>
              ))}
            </ButtonGroup>
          )}
        </S.Card>
      </div>
    </BaseMessage>
  );
};

export default CardV2;

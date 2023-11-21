import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { ButtonGroup, Thumbnail } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { OnInteraction } from '@/pages/Prototype/types';

import { handleRequestActions } from '../../../../utils';
import Message, { BaseMessageProps } from '../../../Base';
import * as S from './styles';

interface MessageVariantCarouselListLayoutProps extends Omit<BaseMessageProps, 'iconProps'> {
  cards: BaseNode.Carousel.TraceCarouselCard[];
  onInteraction: OnInteraction;
  color?: string;
}

const MessageVariantCarouselListLayout: React.FC<MessageVariantCarouselListLayoutProps> = ({ cards, onInteraction, color, ...messageProps }) => {
  return (
    <Message {...messageProps} bubble={false}>
      <S.Container>
        {cards.map(({ id, title, description, imageUrl, buttons }) => {
          const hasInfo = (description.slate && !SlateEditable.EditorAPI.isNewState(description.slate)) || title;
          return (
            <S.Card key={id}>
              {(hasInfo || imageUrl) && (
                <S.CardHeader>
                  {hasInfo && (
                    <S.CardHeaderInfo>
                      {title && <S.CardTitle>{title}</S.CardTitle>}
                      {(description.slate && <S.CardDescription>{SlateEditable.serializeToJSX(description.slate)}</S.CardDescription>) ||
                        (description.text && <S.CardDescription>{description.text}</S.CardDescription>)}
                    </S.CardHeaderInfo>
                  )}
                  {imageUrl && <Thumbnail src={imageUrl} ml={16} size="md" />}
                </S.CardHeader>
              )}
              {!!buttons?.length && (
                <ButtonGroup mt={16}>
                  {buttons.map(({ request, name }) => (
                    <S.Button
                      key={request.type}
                      onClick={Utils.functional.chainVoid(handleRequestActions(request), () => onInteraction({ name, request }))}
                      color={color}
                    >
                      {name}
                    </S.Button>
                  ))}
                </ButtonGroup>
              )}
            </S.Card>
          );
        })}
      </S.Container>
    </Message>
  );
};

export default MessageVariantCarouselListLayout;

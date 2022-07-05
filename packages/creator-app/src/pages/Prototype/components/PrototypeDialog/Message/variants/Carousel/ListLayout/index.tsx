import { BaseNode } from '@voiceflow/base-types';
import { ButtonGroup, Thumbnail } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { OnInteraction } from '@/pages/Prototype/types';

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
          const hasDescription = !SlateEditable.EditorAPI.isNewState(description?.slate);
          return (
            <S.Card key={id}>
              {(hasDescription || imageUrl) && (
                <S.CardHeader>
                  {(title || hasDescription) && (
                    <S.CardHeaderInfo>
                      <S.CardTitle>{title}</S.CardTitle>
                      {description.slate && <S.CardDescription>{SlateEditable.serializeToJSX(description.slate)}</S.CardDescription>}
                    </S.CardHeaderInfo>
                  )}
                  {imageUrl && <Thumbnail src={imageUrl} ml={16} size="md" />}
                </S.CardHeader>
              )}
              {!!buttons?.length && (
                <ButtonGroup mt={16}>
                  {buttons.map(({ request, name }) => (
                    <S.Button key={request.type} onClick={() => onInteraction({ name, request })} color={color}>
                      {name || 'Button Label'}
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

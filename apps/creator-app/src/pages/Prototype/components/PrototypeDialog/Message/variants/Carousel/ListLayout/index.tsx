import type { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { ButtonGroup, Thumbnail } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import type { OnInteraction } from '@/pages/Prototype/types';
import { textFieldHasValue } from '@/utils/prototypeMessage';

import { handleRequestActions } from '../../../../utils';
import type { BaseMessageProps } from '../../../Base';
import Message from '../../../Base';
import * as S from './styles';

interface MessageVariantCarouselListLayoutProps extends Omit<BaseMessageProps, 'iconProps'> {
  cards: BaseNode.Carousel.TraceCarouselCard[];
  onInteraction: OnInteraction;
  color?: string;
}

const MessageVariantCarouselListLayout: React.FC<MessageVariantCarouselListLayoutProps> = ({
  cards,
  onInteraction,
  color,
  ...messageProps
}) => {
  const cardsWithInfo = React.useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        hasInfo: card.imageUrl || !!card.title || textFieldHasValue(card.description.slate ?? card.description.text),
        description: card.description.slate
          ? SlateEditable.serializeToJSX(card.description.slate)
          : card.description.text,
      })),
    [cards]
  );

  return (
    <Message {...messageProps} bubble={false}>
      <S.Container>
        {cardsWithInfo.map(({ id, title, description, imageUrl, buttons, hasInfo }) => (
          <S.Card key={id}>
            {hasInfo && (
              <S.CardHeader>
                {(title || description) && (
                  <S.CardHeaderInfo>
                    {title && <S.CardTitle>{title}</S.CardTitle>}

                    {description && <S.CardDescription>{description}</S.CardDescription>}
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
                    color={color}
                    onClick={Utils.functional.chainVoid(handleRequestActions(request), () =>
                      onInteraction({ name, request })
                    )}
                  >
                    {name}
                  </S.Button>
                ))}
              </ButtonGroup>
            )}
          </S.Card>
        ))}
      </S.Container>
    </Message>
  );
};

export default MessageVariantCarouselListLayout;

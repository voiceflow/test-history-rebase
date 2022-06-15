import { BaseNode } from '@voiceflow/base-types';
import { ButtonGroup, Thumbnail } from '@voiceflow/ui';
import React from 'react';

import { OnInteraction } from '@/pages/Prototype/types';
import { serializeSlateToJSX } from '@/utils/slate';

import Message, { MessageProps } from '../../components/Message';
import * as S from './styles';

type CarouselProps = Omit<MessageProps, 'iconProps'> & {
  cards: BaseNode.Carousel.TraceCarouselCard[];
  onInteraction: OnInteraction;
};

const Carousel: React.FC<CarouselProps> = ({ cards, onInteraction, ...messageProps }) => {
  return (
    <Message {...messageProps} bubble={false}>
      <S.Container>
        {cards.map(({ id, title, description, imageUrl, buttons }) => (
          <S.Card key={id}>
            <S.CardHeader>
              <S.CardHeaderInfo>
                <S.CardTitle>{title}</S.CardTitle>
                {description.slate && <S.CardDescription>{serializeSlateToJSX(description.slate)}</S.CardDescription>}
              </S.CardHeaderInfo>
              {imageUrl && <Thumbnail src={imageUrl} ml={16} size="md" />}
            </S.CardHeader>
            {!!buttons?.length && (
              <ButtonGroup mt={16}>
                {buttons.map(({ request, name }) => (
                  <ButtonGroup.Button key={request.type} onClick={() => onInteraction({ name, request })}>
                    {name || 'Button Label'}
                  </ButtonGroup.Button>
                ))}
              </ButtonGroup>
            )}
          </S.Card>
        ))}
      </S.Container>
    </Message>
  );
};

export default Carousel;

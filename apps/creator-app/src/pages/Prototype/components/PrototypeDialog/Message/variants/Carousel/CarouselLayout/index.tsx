import type { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { ButtonGroup } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { useResizeObserver } from '@/hooks';
import type { OnInteraction } from '@/pages/Prototype/types';
import { textFieldHasValue } from '@/utils/prototypeMessage';

import { handleRequestActions } from '../../../../utils';
import type { BaseMessageProps } from '../../../Base';
import BaseMessage from '../../../Base';
import * as S from './styles';

interface MessageVariantCarouselCarouselLayoutProps extends Omit<BaseMessageProps, 'iconProps'> {
  cards: BaseNode.Carousel.TraceCarouselCard[];
  onInteraction: OnInteraction;
  color?: string;
}

const AVATAR_WIDTH = 32;
const AVATAR_MARGIN = 14;
const CARDS_GAP = 16;
const CARDS_WIDTH = 242;
const VIEWPORT_PADDING = 24;

const MessageVariantCarouselCarouselLayout: React.FC<MessageVariantCarouselCarouselLayoutProps> = ({
  cards,
  onInteraction,
  color,
  ...messageProps
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState(0);

  const slideWidth = cards.length * (CARDS_WIDTH + CARDS_GAP) - CARDS_GAP + AVATAR_WIDTH + AVATAR_MARGIN;
  const hasOverflow = slideWidth > viewportWidth - VIEWPORT_PADDING;
  const maxViewItems = Math.floor(viewportWidth / CARDS_WIDTH);
  const maxIndex = cards.length - maxViewItems;

  const recalculateOverflow = () => {
    if (!containerRef.current) return;
    const { width: viewportWidth } = containerRef.current.getBoundingClientRect();
    setViewportWidth(viewportWidth);
  };

  React.useLayoutEffect(recalculateOverflow, []);
  useResizeObserver(containerRef, recalculateOverflow);

  const cardsWithInfo = React.useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        hasInfo: !!card.title || textFieldHasValue(card.description.slate ?? card.description.text),
        description: card.description.slate
          ? SlateEditable.serializeToJSX(card.description.slate)
          : card.description.text,
      })),
    [cards]
  );

  return (
    <S.Container ref={containerRef}>
      {hasOverflow && (
        <>
          <S.BackButton onClick={() => setIndex(index - 1)} disabled={!index} />
          <S.NextButton onClick={() => setIndex(index + 1)} disabled={index >= maxIndex} />
        </>
      )}

      <S.Slide
        style={{
          width: slideWidth,
          transform: hasOverflow ? `translateX(-${index * (CARDS_WIDTH + CARDS_GAP)}px)` : undefined,
        }}
      >
        <BaseMessage {...messageProps} bubble={false}>
          <div style={{ flexGrow: 1, display: 'flex', gap: CARDS_GAP, alignItems: 'flex-start' }}>
            {cardsWithInfo.map(({ id, title, description, imageUrl, buttons, hasInfo }) => (
              <S.Card key={id}>
                {imageUrl && <S.CardImage src={imageUrl} roundedBottomBorders={!hasInfo && !buttons?.length} />}

                {hasInfo && (
                  <S.CardHeader>
                    <S.CardHeaderInfo>
                      <S.CardTitle>{title}</S.CardTitle>

                      {description && <S.CardDescription>{description}</S.CardDescription>}
                    </S.CardHeaderInfo>
                  </S.CardHeader>
                )}

                {!!buttons?.length && (
                  <ButtonGroup>
                    {buttons.map(({ request, name }) => (
                      <S.Button
                        key={request.type}
                        color={color}
                        onClick={Utils.functional.chainVoid(handleRequestActions(request), () =>
                          onInteraction({ name, request })
                        )}
                        hasInfo={hasInfo}
                      >
                        {name}
                      </S.Button>
                    ))}
                  </ButtonGroup>
                )}
              </S.Card>
            ))}
          </div>
        </BaseMessage>
      </S.Slide>
    </S.Container>
  );
};

export default MessageVariantCarouselCarouselLayout;

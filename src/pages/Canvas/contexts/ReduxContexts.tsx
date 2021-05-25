import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as UI from '@/ducks/ui';
import * as Version from '@/ducks/version';
import { createSelectorContext } from '@/utils/redux';

export const { Context: IsCanvasOnlyContext, Provider: IsCanvasOnlyProvider, Consumer: IsCanvasOnlyConsumer } = createSelectorContext(
  UI.isCanvasOnlyShowingSelector
);

export const {
  Context: IsCreatorMenuHiddenContext,
  Provider: IsCreatorMenuHiddenProvider,
  Consumer: IsCreatorMenuHiddenConsumer,
} = createSelectorContext(UI.isCreatorMenuHiddenSelector);

export const { Context: IsStraightLinksContext, Provider: IsStraightLinksProvider, Consumer: IsStraightLinksConsumer } = createSelectorContext(
  Project.isStraightLinksSelector
);

export const { Context: AccountLinkingContext, Provider: AccountLinkingProvider, Consumer: AccountLinkingConsumer } = createSelectorContext(
  Version.alexa.accountLinkingSelector
);

export const { Context: ProductMapContext, Provider: ProductMapProvider, Consumer: ProductMapConsumer } = createSelectorContext(
  Product.productMapSelector
);

export const { Context: CustomIntentMapContext, Provider: CustomIntentMapProvider, Consumer: CustomIntentMapConsumer } = createSelectorContext(
  Intent.mapCustomIntentsSelector
);

export const { Context: DiagramMapContext, Provider: DiagramMapProvider, Consumer: DiagramMapConsumer } = createSelectorContext(
  Diagram.diagramMapSelector
);

export const ReduxContextsProviders: React.FC = ({ children }) => (
  <IsCanvasOnlyProvider>
    <IsCreatorMenuHiddenProvider>
      <IsStraightLinksProvider>
        <AccountLinkingProvider>
          <ProductMapProvider>
            <CustomIntentMapProvider>
              <DiagramMapProvider>
                {/* comment to have a children on a new line */}
                {children}
              </DiagramMapProvider>
            </CustomIntentMapProvider>
          </ProductMapProvider>
        </AccountLinkingProvider>
      </IsStraightLinksProvider>
    </IsCreatorMenuHiddenProvider>
  </IsCanvasOnlyProvider>
);

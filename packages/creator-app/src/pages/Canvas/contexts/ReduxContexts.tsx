import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as UI from '@/ducks/ui';
import * as VersionV2 from '@/ducks/versionV2';
import { createSelectorContext } from '@/utils/redux';

export const {
  Context: IsCanvasOnlyContext,
  Provider: IsCanvasOnlyProvider,
  Consumer: IsCanvasOnlyConsumer,
} = createSelectorContext(UI.isCanvasOnlyShowingSelector);

export const {
  Context: IsCreatorMenuHiddenContext,
  Provider: IsCreatorMenuHiddenProvider,
  Consumer: IsCreatorMenuHiddenConsumer,
} = createSelectorContext(UI.isCreatorMenuHiddenSelector);

export const {
  Context: IsStraightLinksContext,
  Provider: IsStraightLinksProvider,
  Consumer: IsStraightLinksConsumer,
} = createSelectorContext(ProjectV2.active.isStraightLinksSelector);

export const {
  Context: AccountLinkingContext,
  Provider: AccountLinkingProvider,
  Consumer: AccountLinkingConsumer,
} = createSelectorContext(VersionV2.active.alexa.accountLinkingSelector);

export const {
  Context: ProductMapContext,
  Provider: ProductMapProvider,
  Consumer: ProductMapConsumer,
} = createSelectorContext(ProductV2.productMapSelector);

export const {
  Context: CustomIntentMapContext,
  Provider: CustomIntentMapProvider,
  Consumer: CustomIntentMapConsumer,
} = createSelectorContext(IntentV2.customIntentMapSelector);

export const { Context: SlotMapContext, Provider: SlotMapProvider, Consumer: SlotMapConsumer } = createSelectorContext(SlotV2.slotMapSelector);

export const {
  Context: DiagramMapContext,
  Provider: DiagramMapProvider,
  Consumer: DiagramMapConsumer,
} = createSelectorContext(DiagramV2.diagramMapSelector);

export const ReduxContextsProviders: React.FC = ({ children }) => (
  <IsCanvasOnlyProvider>
    <IsCreatorMenuHiddenProvider>
      <IsStraightLinksProvider>
        <AccountLinkingProvider>
          <ProductMapProvider>
            <CustomIntentMapProvider>
              <SlotMapProvider>
                <DiagramMapProvider>
                  {/* comment to have a children on a new line */}
                  {children}
                </DiagramMapProvider>
              </SlotMapProvider>
            </CustomIntentMapProvider>
          </ProductMapProvider>
        </AccountLinkingProvider>
      </IsStraightLinksProvider>
    </IsCreatorMenuHiddenProvider>
  </IsCanvasOnlyProvider>
);

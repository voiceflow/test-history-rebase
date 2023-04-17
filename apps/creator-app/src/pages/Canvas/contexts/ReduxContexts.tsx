import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as DomainV2 from '@/ducks/domain';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import * as UI from '@/ducks/ui';
import * as VersionV2 from '@/ducks/versionV2';
import { createSelectorContext } from '@/utils/redux';

export const {
  Context: FullScreenModeContext,
  Provider: FullScreenModeProvider,
  Consumer: FullScreenModeConsumer,
} = createSelectorContext(UI.isFullScreenMode);

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

export const {
  Context: ActiveDiagramTypeContext,
  Provider: ActiveDiagramTypeProvider,
  Consumer: ActiveDiagramTypeConsumer,
} = createSelectorContext(DiagramV2.active.typeSelector);

export const {
  Context: IntentNodeDataLookupContext,
  Provider: IntentNodeDataLookupProvider,
  Consumer: IntentNodeDataLookupConsumer,
} = createSelectorContext(CreatorV2.intentNodeDataLookupSelector);

export const {
  Context: GlobalIntentStepMapContext,
  Provider: GlobalIntentStepMapProvider,
  Consumer: GlobalIntentStepMapConsumer,
} = createSelectorContext(DiagramV2.globalIntentStepMapSelector);

export const {
  Context: SharedNodesContext,
  Provider: SharedNodesProvider,
  Consumer: SharedNodesConsumer,
} = createSelectorContext(DiagramV2.sharedNodesSelector);

export const {
  Context: DomainMapContext,
  Provider: DomainMapProvider,
  Consumer: DomainMapConsumer,
} = createSelectorContext(DomainV2.domainsMapSelector);

export const {
  Context: ActionsRouteMatchContext,
  Provider: ActionsRouteMatchProvider,
  Consumer: ActionsRouteMatchConsumer,
} = createSelectorContext(Router.actionsMatchSelector);

export const ReduxContextsProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <FullScreenModeProvider>
    <IsCanvasOnlyProvider>
      <IsCreatorMenuHiddenProvider>
        <IsStraightLinksProvider>
          <AccountLinkingProvider>
            <ProductMapProvider>
              <CustomIntentMapProvider>
                <SlotMapProvider>
                  <DiagramMapProvider>
                    <GlobalIntentStepMapProvider>
                      <ActiveDiagramTypeProvider>
                        <IntentNodeDataLookupProvider>
                          <SharedNodesProvider>
                            <ActionsRouteMatchProvider>
                              <DomainMapProvider>
                                {/* comment to have a children on a new line */}
                                {children}
                              </DomainMapProvider>
                            </ActionsRouteMatchProvider>
                          </SharedNodesProvider>
                        </IntentNodeDataLookupProvider>
                      </ActiveDiagramTypeProvider>
                    </GlobalIntentStepMapProvider>
                  </DiagramMapProvider>
                </SlotMapProvider>
              </CustomIntentMapProvider>
            </ProductMapProvider>
          </AccountLinkingProvider>
        </IsStraightLinksProvider>
      </IsCreatorMenuHiddenProvider>
    </IsCanvasOnlyProvider>
  </FullScreenModeProvider>
);

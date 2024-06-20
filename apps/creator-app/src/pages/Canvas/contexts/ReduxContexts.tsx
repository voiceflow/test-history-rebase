import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as CustomBlock from '@/ducks/customBlock';
import * as Designer from '@/ducks/designer';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as UI from '@/ducks/ui';
import * as VersionV2 from '@/ducks/versionV2';
import { createSelectorContext } from '@/utils/redux';

export const {
  Context: IsCanvasOnlyContext,
  Provider: IsCanvasOnlyProvider,
  Consumer: IsCanvasOnlyConsumer,
} = createSelectorContext(UI.selectors.isCanvasOnly);

export const {
  Context: CanvasSidebarContext,
  Provider: CanvasSidebarProvider,
  Consumer: CanvasSidebarConsumer,
} = createSelectorContext(UI.selectors.canvasSidebar);

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
  Context: IntentMapContext,
  Provider: IntentMapProvider,
  Consumer: IntentMapConsumer,
} = createSelectorContext(Designer.Intent.selectors.mapWithFormattedBuiltInName);

export const {
  Context: FlowMapByDiagramIDContext,
  Provider: FlowMapByDiagramIDProvider,
  Consumer: FlowMapByDiagramIDConsumer,
} = createSelectorContext(Designer.Flow.selectors.mapByDiagramID);

export const {
  Context: ResponseMapFirstVariantByResponseIDContext,
  Provider: ResponseMapFirstVariantByResponseIDProvider,
  Consumer: ResponseMapFirstVariantByResponseIDConsumer,
} = createSelectorContext(Designer.Response.selectors.mapFirstVariantByResponseID);

export const {
  Context: FunctionMapContext,
  Provider: FunctionMapProvider,
  Consumer: FunctionMapConsumer,
} = createSelectorContext(Designer.Function.selectors.map);

export const {
  Context: FunctionPathMapContext,
  Provider: FunctionPathMapProvider,
  Consumer: FunctionPathMapConsumer,
} = createSelectorContext(Designer.Function.FunctionPath.selectors.map);

export const {
  Context: RequiredEntityMapContext,
  Provider: RequiredEntityMapProvider,
  Consumer: RequiredEntityMapConsumer,
} = createSelectorContext(Designer.Intent.RequiredEntity.selectors.map);

export const {
  Context: EntityMapContext,
  Provider: EntityMapProvider,
  Consumer: EntityMapConsumer,
} = createSelectorContext(Designer.Entity.selectors.map);

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
  Context: ActiveDiagramNormalizedEntitiesAndVariablesContext,
  Provider: ActiveDiagramNormalizedEntitiesAndVariablesProvider,
  Consumer: ActiveDiagramNormalizedEntitiesAndVariablesConsumer,
} = createSelectorContext(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);

export const {
  Context: IntentIDNodeIDMapContext,
  Provider: IntentIDNodeIDMapProvider,
  Consumer: IntentIDNodeIDMapConsumer,
} = createSelectorContext(CreatorV2.intentIDNodeIDMapSelector);

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const {
  Context: GlobalIntentStepMapContext,
  Provider: GlobalIntentStepMapProvider,
  Consumer: GlobalIntentStepMapConsumer,
} = createSelectorContext(DiagramV2.globalIntentStepMapSelector);

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const {
  Context: SharedNodesContext,
  Provider: SharedNodesProvider,
  Consumer: SharedNodesConsumer,
} = createSelectorContext(DiagramV2.sharedNodesSelector);

export const {
  Context: BlockNodeResourceByNodeIDMapByDiagramIDMapContext,
  Provider: BlockNodeResourceByNodeIDMapByDiagramIDMapProvider,
} = createSelectorContext(Designer.Reference.selectors.blockNodeResourceByNodeIDMapByDiagramIDMap);

export const {
  Context: GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapContext,
  Provider: GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapProvider,
} = createSelectorContext(Designer.Reference.selectors.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap);

export const {
  Context: CustomBlockMapContext,
  Provider: CustomBlockMapProvider,
  Consumer: CustomBlockMapConsumer,
} = createSelectorContext(CustomBlock.customBlockMapSelector);

export const {
  Context: ActionsRouteMatchContext,
  Provider: ActionsRouteMatchProvider,
  Consumer: ActionsRouteMatchConsumer,
} = createSelectorContext(Router.actionsMatchSelector);

export const ReduxContextsProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <IsCanvasOnlyProvider>
    <CanvasSidebarProvider>
      <IsStraightLinksProvider>
        <AccountLinkingProvider>
          <IntentMapProvider>
            <RequiredEntityMapProvider>
              <EntityMapProvider>
                <DiagramMapProvider>
                  <GlobalIntentStepMapProvider>
                    <GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapProvider>
                      <ActiveDiagramTypeProvider>
                        <IntentIDNodeIDMapProvider>
                          <SharedNodesProvider>
                            <BlockNodeResourceByNodeIDMapByDiagramIDMapProvider>
                              <ActionsRouteMatchProvider>
                                <CustomBlockMapProvider>
                                  <ResponseMapFirstVariantByResponseIDProvider>
                                    <FlowMapByDiagramIDProvider>
                                      <FunctionMapProvider>
                                        <FunctionPathMapProvider>
                                          <ActiveDiagramNormalizedEntitiesAndVariablesProvider>
                                            {/* comment to have a children on a new line */}
                                            {children}
                                          </ActiveDiagramNormalizedEntitiesAndVariablesProvider>
                                        </FunctionPathMapProvider>
                                      </FunctionMapProvider>
                                    </FlowMapByDiagramIDProvider>
                                  </ResponseMapFirstVariantByResponseIDProvider>
                                </CustomBlockMapProvider>
                              </ActionsRouteMatchProvider>
                            </BlockNodeResourceByNodeIDMapByDiagramIDMapProvider>
                          </SharedNodesProvider>
                        </IntentIDNodeIDMapProvider>
                      </ActiveDiagramTypeProvider>
                    </GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapProvider>
                  </GlobalIntentStepMapProvider>
                </DiagramMapProvider>
              </EntityMapProvider>
            </RequiredEntityMapProvider>
          </IntentMapProvider>
        </AccountLinkingProvider>
      </IsStraightLinksProvider>
    </CanvasSidebarProvider>
  </IsCanvasOnlyProvider>
);

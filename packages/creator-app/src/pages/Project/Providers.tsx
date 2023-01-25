import React from 'react';

import { ExportProvider } from '@/contexts/ExportContext';
import { NLUProvider } from '@/contexts/NLUContext';
import { PrototypeJobProvider } from '@/contexts/PrototypeJobContext';
import { PublishProvider } from '@/contexts/PublishContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import { AnalyticsDashboardProvider } from '@/pages/AnalyticsDashboard/context';
import { NLUManagerProvider } from '@/pages/NLUManager/context';
// TODO: move this context into contexts folder
import { ExportProvider as NLUExportProvider } from '@/pages/Project/components/Header/components/SharePopper/components/Export/Context';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { LastCreatedComponentProvider, ProjectIdentityProvider, ProjectPreviewProvider, SelectionProvider, TrainingModelProvider } from './contexts';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ProjectPreviewProvider>
    <ProjectIdentityProvider>
      <PrototypeProvider>
        <PrototypeJobProvider>
          <PublishProvider>
            <ExportProvider>
              <TrainingProvider>
                <NLUExportProvider>
                  <NLUProvider>
                    <TrainingModelProvider>
                      <NLUManagerProvider>
                        <SelectionProvider>
                          <SearchProvider>
                            <LastCreatedComponentProvider>
                              <AnalyticsDashboardProvider>{children}</AnalyticsDashboardProvider>
                            </LastCreatedComponentProvider>
                          </SearchProvider>
                        </SelectionProvider>
                      </NLUManagerProvider>
                    </TrainingModelProvider>
                  </NLUProvider>
                </NLUExportProvider>
              </TrainingProvider>
            </ExportProvider>
          </PublishProvider>
        </PrototypeJobProvider>
      </PrototypeProvider>
    </ProjectIdentityProvider>
  </ProjectPreviewProvider>
);

export default Providers;

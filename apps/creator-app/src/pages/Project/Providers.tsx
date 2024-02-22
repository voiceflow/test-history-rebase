import React from 'react';

import * as Project from '@/components/Project';
import { ExportProvider } from '@/contexts/ExportContext';
import { PrototypeJobProvider } from '@/contexts/PrototypeJobContext';
import { PublishProvider } from '@/contexts/PublishContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import { AnalyticsDashboardProvider } from '@/pages/AnalyticsDashboard/context';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { SharePopperProvider } from './components/Header/contexts';
import { ActiveProjectIdentityProvider, ProjectPreviewProvider, SelectionProvider, TrainingModelProvider } from './contexts';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ProjectPreviewProvider>
    <ActiveProjectIdentityProvider>
      <PrototypeProvider>
        <PrototypeJobProvider>
          <PublishProvider>
            <ExportProvider>
              <TrainingProvider>
                <Project.Export.Provider>
                  <TrainingModelProvider>
                    <SelectionProvider>
                      <SearchProvider>
                        <AnalyticsDashboardProvider>
                          <SharePopperProvider>{children}</SharePopperProvider>
                        </AnalyticsDashboardProvider>
                      </SearchProvider>
                    </SelectionProvider>
                  </TrainingModelProvider>
                </Project.Export.Provider>
              </TrainingProvider>
            </ExportProvider>
          </PublishProvider>
        </PrototypeJobProvider>
      </PrototypeProvider>
    </ActiveProjectIdentityProvider>
  </ProjectPreviewProvider>
);

export default Providers;

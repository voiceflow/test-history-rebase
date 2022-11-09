import React from 'react';

import { VersionTag } from '@/constants/platforms';
import { ExportProvider, NLUProvider, PublishProvider, TrainingProvider } from '@/contexts';
import { SearchProvider } from '@/contexts/SearchContext';
import { NLUManagerProvider } from '@/pages/NLUManager/context';
// TODO: move this context into contexts folder
import { ExportProvider as NLUExportProvider } from '@/pages/Project/components/Header/components/SharePopper/components/Export/Context';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { LastCreatedComponentProvider, SelectionProvider, TrainingModelProvider } from './contexts';

const Providers: React.FC = ({ children }) => {
  return (
    <>
      <PrototypeProvider>
        <PublishProvider>
          <ExportProvider>
            <TrainingProvider tag={VersionTag.DEVELOPMENT}>
              <NLUExportProvider>
                <NLUProvider>
                  <TrainingModelProvider>
                    <NLUManagerProvider>
                      <SelectionProvider>
                        <SearchProvider>
                          <LastCreatedComponentProvider>{children}</LastCreatedComponentProvider>
                        </SearchProvider>
                      </SelectionProvider>
                    </NLUManagerProvider>
                  </TrainingModelProvider>
                </NLUProvider>
              </NLUExportProvider>
            </TrainingProvider>
          </ExportProvider>
        </PublishProvider>
      </PrototypeProvider>
    </>
  );
};

export default Providers;

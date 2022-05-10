import React from 'react';

import { ExportProvider, NLUProvider, PublishProvider } from '@/contexts';
import { NLUManagerProvider } from '@/pages/NLUManager/context';
// TODO: move this context into contexts folder
import { ExportProvider as NLUExportProvider } from '@/pages/Project/components/Header/components/SharePopper/components/Export/Context';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { LastCreatedComponentProvider, NLPProvider, SelectionProvider, TrainingModelProvider } from './contexts';

const Providers: React.FC = ({ children }) => {
  return (
    <>
      <PrototypeProvider>
        <PublishProvider>
          <ExportProvider>
            <NLPProvider>
              <NLUExportProvider>
                <NLUProvider>
                  <TrainingModelProvider>
                    <NLUManagerProvider>
                      <SelectionProvider>
                        <LastCreatedComponentProvider>{children}</LastCreatedComponentProvider>
                      </SelectionProvider>
                    </NLUManagerProvider>
                  </TrainingModelProvider>
                </NLUProvider>
              </NLUExportProvider>
            </NLPProvider>
          </ExportProvider>
        </PublishProvider>
      </PrototypeProvider>
    </>
  );
};

export default Providers;

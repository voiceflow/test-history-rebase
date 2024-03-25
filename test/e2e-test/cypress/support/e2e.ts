import './commands';
import 'cy-verify-downloads';
import '@4tw/cypress-drag-drop';
import 'cypress-plugin-api';
import 'cypress-real-events';
import 'cypress-wait-until';

import * as Common from '@voiceflow/cypress-common';
import * as VerifyDownloads from 'cy-verify-downloads';
import * as DeleteDownloads from 'cypress-delete-downloads-folder';

VerifyDownloads.addCustomCommand();

DeleteDownloads.addCustomCommand();
DeleteDownloads.deleteDownloadsFolderBeforeEach();

Common.registerLifecycleHooks();
Common.filterRequestLogs();

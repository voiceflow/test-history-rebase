import { Utils } from '@voiceflow/common';
import { DEVICE_INFO } from '@voiceflow/ui';

import { APP_ENV, CLOUD_ENV, IS_PRIVATE_CLOUD } from '@/config';
import logger from '@/utils/logger';
import speedDetection from '@/utils/speedDetection';

import { ChatWidgetEventData, Project, User, Workspace } from './types';

interface Options {
  projectID: string;
}

class VoiceflowAssistant {
  private user: User | null = null;

  private logger = logger.child('VoiceflowAssistant');

  private hidden = false;

  private setuped = false;

  private autoSetup = false;

  private projectID: string;

  private initialized = false;

  private fetchPromise: Promise<void> | null = null;

  private activeProject: Project | null = null;

  private activeWorkspace: Workspace | null = null;

  private updateInfoBatched = false;

  constructor(options: Options) {
    this.projectID = options.projectID;

    this.logger.setLevel(localStorage.getItem('vfadevlogs') === 'true' ? 'debug' : 'info');
  }

  private async batchUpdateInfo() {
    if (!this.fetchPromise) {
      await this.updateInfo();

      return;
    }

    if (this.updateInfoBatched) return;

    this.updateInfoBatched = true;

    await this.fetchPromise;

    this.fetchPromise = null;

    await this.updateInfo();

    this.updateInfoBatched = false;
  }

  private async updateInfo() {
    if (!this.initialized) return;

    if (!this.user) {
      logger.debug('User is not set');

      return;
    }

    if (this.fetchPromise) {
      this.batchUpdateInfo();

      return;
    }

    let resolveFetchPromise!: VoidFunction;

    this.fetchPromise = new Promise((resolve) => {
      resolveFetchPromise = resolve;
    });

    const speedResults = speedDetection.getResults();

    try {
      await fetch(`https://vfassistant.voiceflow.fr/patch/${this.user.id}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          os: `${DEVICE_INFO.os} ${DEVICE_INFO.version}`,
          env: APP_ENV,
          url: window.location.href,
          cloud: CLOUD_ENV,
          browser: `${DEVICE_INFO.browser} ${DEVICE_INFO.browserVersion}`,
          isPrivateCloud: IS_PRIVATE_CLOUD,

          userID: this.user.id,
          userName: this.user.name,
          userRole: this.user.role,
          userEmail: this.user.email,
          userImage: this.user.image,

          connectionBPs: speedResults?.readableBPs,
          connectionKBPs: speedResults?.readableKBPs,
          connectionMBPs: speedResults?.readableMBPs,

          activeWorkspaceID: this.activeWorkspace?.id,
          activeWorkspaceName: this.activeWorkspace?.name,
          activeWorkspacePlan: this.activeWorkspace?.plan,

          activeProjectID: this.activeProject?.id,
          activeProjectNLU: this.activeProject?.nlu,
          activeProjectName: this.activeProject?.name,
          activeProjectType: this.activeProject?.type,
          activeProjectLocale: this.activeProject?.locales.join(', '),
          activeProjectPlatform: this.activeProject?.platform,
        }),
      });
    } catch {
      this.logger.debug('Error updating info');
    } finally {
      resolveFetchPromise();
    }
  }

  private enableProductionMode() {
    this.logger.info('Reloading in PRODUCTION mode...');

    localStorage.setItem('vfadevmode', 'production');

    window.setTimeout(() => window.location.reload(), 2200);
  }

  private enableDevelopmentMode() {
    this.logger.info(`Reloading in DEVELOPMENT mode...`);

    localStorage.setItem('vfadevmode', 'development');

    window.setTimeout(() => window.location.reload(), 2200);
  }

  private onMessage = async (event: MessageEvent<ChatWidgetEventData | unknown>) => {
    if (!event.data) return;

    let possibleData: unknown;

    try {
      if (typeof event.data === 'string') {
        possibleData = JSON.parse(event.data);
      } else {
        possibleData = event.data;
      }
    } catch {
      // skip
    }

    // not a voiceflow widget event
    if (
      !Utils.object.isObject(possibleData) ||
      !Utils.object.hasProperty(possibleData, 'type') ||
      typeof possibleData.type !== 'string' ||
      !possibleData.type.includes('voiceflow:')
    )
      return;

    const vfData = possibleData as ChatWidgetEventData;

    this.logger.debug(`Received event: ${vfData.type}`);

    if (vfData.type === 'voiceflow:open') {
      await speedDetection.detect().catch(() => {});

      await this.updateInfo();
    }
  };

  show() {
    if (!this.initialized) return;

    this.hidden = false;

    if (this.setuped) {
      window.voiceflow?.chat.show();
    }
  }

  hide() {
    if (!this.initialized) return;

    this.hidden = true;

    window.voiceflow?.chat.hide();
  }

  setUser(data: User) {
    this.user = data;

    this.updateInfo();
  }

  setActiveProject(data: Project | null) {
    this.activeProject = data;

    this.updateInfo();
  }

  setActiveWorkspace(data: Workspace | null) {
    this.activeWorkspace = data;

    this.updateInfo();
  }

  async setup() {
    this.autoSetup = true;

    if (!this.initialized) return;

    if (!window.voiceflow?.chat) {
      logger.debug('Widget is not loaded');

      return;
    }

    try {
      await this.updateInfo();

      if (this.hidden) return;

      window.voiceflow.chat.load({
        user: { name: this.user?.name ?? 'Unknown', image: this.user?.image ?? '' },
        verify: { projectID: this.projectID },
        userID: String(this.user?.id ?? 'unknown'),
        versionID: localStorage.getItem('vfadevmode') || 'production',
      });

      this.setuped = true;

      window.voiceflow.chat.show();
    } catch (err) {
      logger.debug('Loading widget error', err);
    }
  }

  async cleanup() {
    this.user = null;
    this.autoSetup = false;
    this.activeProject = null;
    this.activeWorkspace = null;

    this.hide();
    window.voiceflow?.chat.destroy();
  }

  initialize() {
    if (this.initialized) return;

    const firstScript = document.getElementsByTagName('script')[0];
    const widgetScript = document.createElement('script');

    widgetScript.onerror = (error) => this.logger.debug('Error loading Voiceflow Assistant widget', error);
    widgetScript.onload = () => {
      this.initialized = true;

      if (this.autoSetup) this.setup();
    };

    widgetScript.type = 'text/javascript';
    widgetScript.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
    // the script should be loaded synchronously otherwise browsers complain about CORS issues
    // TODO: uncomment when server is fixed
    // widgetScript.async = true;

    firstScript?.parentNode?.insertBefore(widgetScript, firstScript);

    window.VFAForceSetup = () => {
      this.setup();
      this.initialize();
    };

    window.VFAProduction = () => this.enableProductionMode();

    window.VFADevelopment = () => this.enableDevelopmentMode();

    window.VFAToggleDevLogs = () => {
      if (localStorage.getItem('vfadevlogs') === 'true') {
        localStorage.setItem('vfadevlogs', 'false');
        this.logger.setLevel('info');
      } else {
        localStorage.setItem('vfadevlogs', 'true');
        this.logger.setLevel('trace');
      }
    };

    window.addEventListener('message', this.onMessage, true);
  }
}

export default new VoiceflowAssistant({ projectID: '636a8776907ffb000677045c' });

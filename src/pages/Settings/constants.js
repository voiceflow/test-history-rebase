import AdvancedSettings from '@/pages/Settings/Advanced';
import BackupSettings from '@/pages/Settings/Backups';
import BasicSettings from '@/pages/Settings/Basic';

export const SettingsRoute = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  DISCOVERY: 'discovery',
  BACKUPS: 'backups',
};

export const SETTINGS_ROUTES = [
  {
    value: SettingsRoute.BASIC,
    label: 'Basic',
    component: BasicSettings,
  },
  {
    value: SettingsRoute.ADVANCED,
    label: 'Advanced',
    component: AdvancedSettings,
  },
  {
    value: SettingsRoute.BACKUPS,
    label: 'Backups',
    component: BackupSettings,
  },
];

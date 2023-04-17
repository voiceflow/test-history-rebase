import { api } from './fetch';

export const MAINTENANCE_PATH = 'maintenance';

const maintenanceClient = {
  check: () => api.get<void>(MAINTENANCE_PATH),
};

export default maintenanceClient;

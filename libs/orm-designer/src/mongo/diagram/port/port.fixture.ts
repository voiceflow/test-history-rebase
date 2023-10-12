import { link } from '../link/link.fixture';
import type { Port } from './port.dto';
import { PortType } from './port-type.enum';

export const nextPort: Port = {
  key: PortType.NEXT,
  link,
};

import { createConfig } from '@voiceflow/dependency-cruiser-config';

export default createConfig({
  allowTypeCycles: true,
  orphans: { ignore: ['.*/mikro-orm\\.config\\.ts', '.*/migrations/Migration\\d+\\.ts'] },
});

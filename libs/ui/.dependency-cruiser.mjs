import { createConfig } from '@voiceflow/dependency-cruiser-config';

export default createConfig({
  allowTypeCycles: true,
  orphans: { ignore: ['.*\\.svg\\.jsx'] },
});

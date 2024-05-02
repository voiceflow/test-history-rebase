import baseConfig from '@voiceflow/vitest-config';
import type { UserConfig } from 'vitest/config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig<UserConfig, UserConfig>(baseConfig, {
  test: {
    setupFiles: './config/test/setup.ts',
  },
});

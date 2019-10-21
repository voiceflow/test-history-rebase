import React from 'react';

import { withContext } from '@/hocs';

export const TestingModeContext = React.createContext(null);
export const { Provider: TestingModeProvider, Consumer: TestingModeConsumer } = TestingModeContext;

export const withTestingMode = withContext(TestingModeContext, 'isTesting');

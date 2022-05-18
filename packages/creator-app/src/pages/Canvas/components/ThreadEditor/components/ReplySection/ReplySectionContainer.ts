import { NestedMenuComponents } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ReplySectionContainer = styled(NestedMenuComponents.FooterActionContainer)`
  position: sticky;
  bottom: 0;
  opacity: 1 !important;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-bottom: 0;
`;

export default ReplySectionContainer;

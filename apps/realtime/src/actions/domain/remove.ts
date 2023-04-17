import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractDomainResourceControl } from './utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveDomain extends AbstractDomainResourceControl<Payload> {
  protected actionCreator = Realtime.domain.crud.remove;

  protected process = Utils.functional.noop;
}

export default RemoveDomain;

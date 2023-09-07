import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDomainResourceControl } from './utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.Domain> {}

class AddDomain extends AbstractDomainResourceControl<Payload> {
  protected actionCreator = Realtime.domain.crud.add;

  protected process = Utils.functional.noop;
}

export default AddDomain;

import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractDomainResourceControl } from './utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuesPayload<Realtime.Domain> {}

class AddManyDomains extends AbstractDomainResourceControl<Payload> {
  protected actionCreator = Realtime.domain.crud.addMany;

  protected process = Utils.functional.noop;
}

export default AddManyDomains;

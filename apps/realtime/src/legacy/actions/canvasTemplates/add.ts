import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.CanvasTemplate> {}

class AddCanvasTemplate extends AbstractVersionResourceControl<Payload> {
  protected actionCreator = Realtime.canvasTemplate.crud.add;

  protected process = Utils.functional.noop;
}

export default AddCanvasTemplate;

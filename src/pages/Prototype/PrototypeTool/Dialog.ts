/* eslint-disable no-throw-literal */
import NLC, { IIntentFullfilment, ISlotFullfilment } from '@voiceflow/natural-language-commander';
import cuid from 'cuid';

import client from '@/client';
import { Slot } from '@/models';
import { regexVariables } from '@/utils/string';

import { PMStatus, TMAmazonIntent } from '../types';
import AudioController from './Audio';
import MessageController from './Message';

export type DialogControllerProps = {
  nlc: NLC;
  locale: string;
  variables: Record<string, any>;
  updateStatus: (status: PMStatus) => void;
  slots: Array<Slot>;
};

type DialogControllerOptions = {
  props: DialogControllerProps;
  audio: AudioController;
  message: MessageController;
};

enum DialogStatus {
  INTERACTION = 'interaction',
  PROMPT = 'prompt',
  CONFIRM = 'confirm',
  CONFIRM_PROMPT = 'confirm_prompt',
}

class DialogController<Options extends DialogControllerOptions = DialogControllerOptions> {
  private fulfillment: IIntentFullfilment | null = null;

  private dialog: IIntentFullfilment | null = null;

  private status: DialogStatus = DialogStatus.INTERACTION;

  private props: Options['props'];

  private audio: Options['audio'];

  private message: Options['message'];

  constructor({ props, audio, message }: Options) {
    this.props = props;
    this.audio = audio;
    this.message = message;
  }

  private async processMessage(message: string, variables = this.props.variables) {
    const regexedMessage = regexVariables(message, variables);
    let src = '';
    try {
      src = await client.prototype.getSpeakAudio({ ssml: regexedMessage, voice: '_DEFAULT' });
      this.audio.playExternal(src);
    } finally {
      this.message.speak(cuid(), { message: regexedMessage, src });
    }
  }

  private async checkConfirm(input: string) {
    if (!this.dialog) return;

    const confirmFulfillment = this.props.nlc.handleDialog(this.dialog, input);

    const confirm = this.dialog.required?.[0].dialog?.confirm;

    if (confirmFulfillment.intent === this.dialog.intent && confirm?.length) {
      const mergedVariables = {
        ...this.props.variables,
        ...confirmFulfillment.slots.reduce<Record<string, any>>((acc, slot) => {
          acc[slot.name] = slot.value;
          return acc;
        }, {}),
      };

      await this.processMessage(confirm[0] || 'confirm slot?', mergedVariables);

      this.dialog = confirmFulfillment;
      this.status = DialogStatus.CONFIRM_PROMPT;
      throw 'confirm required';
    } else {
      this.fulfillment = confirmFulfillment;
    }
  }

  private async checkConfirmPrompt(input: string) {
    if (!this.dialog) return;

    const confirmPromptFulfillment = this.props.nlc.handleCommand(input);
    const confirmIntent = confirmPromptFulfillment?.intent;

    if (confirmIntent === TMAmazonIntent.YES) {
      this.fulfillment = this.dialog;
      this.dialog = null;
    } else if (confirmIntent && confirmIntent !== TMAmazonIntent.NO) {
      // if a whole new intent, use that new intent
      this.fulfillment = confirmPromptFulfillment;
    } else {
      // if no intent or no intent matched, prompt user again for the slot
      await this.checkRequired();
    }
  }

  private async checkRequired() {
    if (this.fulfillment?.required?.[0]?.dialog) {
      const intentSlot = this.fulfillment.required[0];

      this.dialog = this.fulfillment;
      await this.processMessage(intentSlot.dialog?.prompt[0] || `${intentSlot.name} slot required`);

      if (intentSlot.dialog?.confirm) {
        this.status = DialogStatus.CONFIRM;
      }

      throw 'dialog required';
    }
  }

  private mapToSlotKeys = (unmappedSlot: ISlotFullfilment) => {
    const slotMeta = this.props.slots.find(({ name }) => name === unmappedSlot.name);

    if (!slotMeta) throw new Error('NLC produced an unexpected slot');

    const input = slotMeta.inputs.find(
      ({ value, synonyms }) => value === unmappedSlot.value || synonyms.split(', ').some((synonym) => synonym === unmappedSlot.value)
    );

    if (!input) throw new Error('NLC matched slot type, but its value is incorrect');

    unmappedSlot.value = input.value;
  };

  public async handle(input: string) {
    // eslint-disable-next-line sonarjs/no-small-switch
    if (this.status === DialogStatus.CONFIRM) {
      await this.checkConfirm(input);
    } else if (this.status === DialogStatus.CONFIRM_PROMPT) {
      await this.checkConfirmPrompt(input);
    } else if (this.status === DialogStatus.PROMPT && this.dialog) {
      this.fulfillment = this.props.nlc.handleDialog(this.dialog, input);
    } else {
      this.fulfillment = this.props.nlc.handleCommand(input);
    }

    await this.checkRequired();

    this.status = DialogStatus.INTERACTION;
    this.dialog = null;

    if (this.fulfillment) {
      this.fulfillment.slots.forEach((slot) => this.mapToSlotKeys(slot));
    }

    return this.fulfillment;
  }

  public stop() {
    this.dialog = null;
  }
}

export default DialogController;

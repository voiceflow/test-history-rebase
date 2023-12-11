import { CustomSlot, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, COLOR_PICKER_CONSTANTS, Modal, pickRandomDefaultColor, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { useFormik } from 'formik';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import manager from '@/ModalsV2/manager';
import EntityForm from '@/pages/Canvas/components/EntityForm';
import { applySlotNameFormatting, slotNameFormatter, validateSlotName } from '@/utils/slot';

import { FormValues, SCHEME } from './types';

const FORM_ID = 'entity-form';

export interface NLUEntityCreateProps {
  name?: string;
  creationType: Tracking.CanvasCreationType;
}

const Create = manager.create<NLUEntityCreateProps, Realtime.Slot>(
  'NLUEntityCreate',
  () =>
    ({ api, type, opened, hidden, animated, name, creationType }) => {
      const createSlot = useDispatch(SlotV2.createSlot);
      const slots = useSelector(SlotV2.allSlotsSelector);
      const intents = useSelector(IntentV2.allIntentsSelector);

      const platform = useSelector(ProjectV2.active.platformSelector);

      const [trackingEvents] = useTrackingEvents();

      const [valueError, setValueError] = React.useState(false);

      const initialValues = React.useMemo<FormValues>(
        () => ({
          name: name ? applySlotNameFormatting(platform)(name) : '',
          type: CustomSlot.type,
          color: pickRandomDefaultColor(COLOR_PICKER_CONSTANTS.ALL_COLORS_WITH_DARK_BASE),
          values: [],
        }),
        [name, platform]
      );

      const onCreateEntity = async ({ name, color, type: slotType, values }: FormValues) => {
        try {
          api.preventClose();
          const formattedSlotName = slotNameFormatter(platform)(name);
          const id = Utils.id.cuid.slug();

          const error = validateSlotName({
            slots,
            intents,
            slotName: formattedSlotName,
            slotType,
          });

          if (error) {
            toast.error(error);
            api.enableClose();
            return;
          }

          if (
            !values.some(({ value, synonyms }) => value.trim() || synonyms.trim()) &&
            (slotType === VoiceflowConstants.SlotType.CUSTOM || slotType === CustomSlot.type)
          ) {
            setValueError(true);
            api.enableClose();
            return;
          }

          const entity = { id, type: slotType, name: formattedSlotName, color, inputs: values };
          await createSlot(id, entity);
          api.resolve(entity);

          trackingEvents.trackEntityCreated({ creationType });

          api.enableClose();
          api.close();
        } catch {
          toast.error('Failed to create entity.');
          api.enableClose();
        }
      };

      const form = useFormik({
        onSubmit: onCreateEntity,
        initialValues,
        validationSchema: SCHEME,
        enableReinitialize: true,
      });

      return (
        <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
            Create Entity
          </Modal.Header>

          <form onSubmit={form.handleSubmit} id={FORM_ID}>
            <EntityForm
              type={form.values.type}
              name={form.values.name}
              color={form.values.color}
              values={form.values.values}
              saveColor={(color) => form.setFieldValue('color', color)}
              saveValues={(inputs) => form.setFieldValue('values', inputs)}
              updateType={(type) => form.setFieldValue('type', type)}
              updateName={(name) => form.setFieldValue('name', applySlotNameFormatting(platform)(name))}
              valueError={valueError}
            />
          </form>

          <Modal.Footer gap={12} sticky>
            <Button variant={Button.Variant.TERTIARY} onClick={api.onClose} squareRadius>
              Cancel
            </Button>

            <Button type="submit" name="submit" disabled={form.isSubmitting} isLoading={form.isSubmitting} form={FORM_ID}>
              Create Entity
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Create;

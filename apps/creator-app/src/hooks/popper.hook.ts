import type { PopperModifiers } from '@voiceflow/ui-next';
import { Popper, useConst } from '@voiceflow/ui-next';
import type { PopperModifier } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export const usePopperModifiers = <Modifiers>(modifiers: ReadonlyArray<PopperModifier<Modifiers>>) =>
  useConst<PopperModifiers<'preventOverflow' | Modifiers>>([...Popper.DEFAULT_MODIFIERS, ...modifiers]);

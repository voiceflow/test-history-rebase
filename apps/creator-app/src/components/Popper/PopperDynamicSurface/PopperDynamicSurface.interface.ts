import { ISurface } from '@voiceflow/ui-next/build/esm/components/Utility/Surface/Surface.interface';

export interface IPopperDynamicSurface extends ISurface {
  /**
   * function to update the popper position
   */
  update: VoidFunction;
}

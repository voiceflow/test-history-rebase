import { Switch as SwitchComponent } from './Switch.component';
import { SwitchPane } from './SwitchPane/SwitchPane.component';

export const Switch = Object.assign(SwitchComponent, {
  Pane: SwitchPane,
});

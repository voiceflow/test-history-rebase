import { MOCK_DATA, PerfAction, PerfScenario } from '../constants';
import { PAGES, runner } from '../utils';

runner.register(PerfScenario.PROTOTYPE_RESPONSE_ON_SUBMIT, async ({ commands, unit, beforeAll, afterAll, afterEach }) => {
  beforeAll(async () => {
    await commands.login();
    await commands.goToPrototype(MOCK_DATA.PROTOTYPE_VERSION_ID);
  });

  afterAll(async () => {
    await commands.logout();
  });

  afterEach(async () => {
    await PAGES.PROTOTYPE.restartButton().click();
  });

  unit(async () => {
    await PAGES.PROTOTYPE.startButton().click();

    await commands.waitAction(PerfAction.PROTOTYPE_BUTTONS_RENDERED);

    if (!PAGES.PROTOTYPE.speakMessages().length) {
      // waiting first speak message to be rendered
      await commands.waitAction(PerfAction.PROTOTYPE_SPEAK_RENDERED);
    }

    PAGES.PROTOTYPE.responseInput().value = 'yes';

    const event = await document.createEvent('HTMLEvents');

    await event.initEvent('change', false, true);

    await PAGES.PROTOTYPE.responseInput().dispatchEvent(event);

    await PAGES.PROTOTYPE.sendButton().click();
  });
});

import initStoryshots from '@storybook/addon-storyshots';
import path from 'path';
import renderer from 'react-test-renderer';

initStoryshots({
  configPath: path.resolve(__dirname, '../.storybook/storyshotConfig.js'),
  test: ({ story, context, stories2snapsConverter }) => {
    const snapshotFileName = stories2snapsConverter.getSnapshotFileName(context);

    const storyElement = story.render(context);
    const component = renderer.create(storyElement);
    const tree = component.toJSON();

    expect(tree).toMatchSpecificSnapshot(snapshotFileName);
  },
});

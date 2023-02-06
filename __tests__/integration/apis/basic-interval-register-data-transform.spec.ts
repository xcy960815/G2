import { createNodeGCanvas } from '../utils/createNodeGCanvas';
import { sleep } from '../utils/sleep';
import { basicIntervalRegisterDataTransform as render } from './basic-interval-register-data-transform';
import '../utils/useSnapshotMatchers';

describe('G2.register(data.[name])', () => {
  const canvas = createNodeGCanvas(640, 480);

  it('G2.register(data.[name]) should register data transform.', async () => {
    const { finished } = render({ canvas });
    await finished;
    await sleep(20);
    const dir = `${__dirname}/../snapshots-api`;
    await expect(canvas).toMatchCanvasSnapshot(dir, render.name);
  });

  afterAll(() => {
    canvas?.destroy();
  });
});

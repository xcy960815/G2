import { chartChangeSize as render } from '../plots/api/chart-change-size';
import { createNodeGCanvas } from './utils/createNodeGCanvas';
import { sleep } from './utils/sleep';
import './utils/useSnapshotMatchers';

describe('mark.changeSize', () => {
  const canvas = createNodeGCanvas(640, 480);

  it('mark.changeSize(width, height) should rerender expected chart', async () => {
    const { finished, button, chart } = render({
      canvas,
      container: document.createElement('div'),
    });
    await finished;
    button.dispatchEvent(new CustomEvent('click'));
    await new Promise<void>((resolve) => chart.on('afterchangesize', resolve));
    const dir = `${__dirname}/snapshots/api`;
    await sleep(20);
    await expect(canvas).toMatchCanvasSnapshot(dir, render.name);
  });

  afterAll(() => {
    canvas?.destroy();
  });
});

import { chartEmitItemTooltipHideContent as render } from '../plots/api/chart-emit-item-tooltip-hide-content';
import './utils/useSnapshotMatchers';
import {
  dispatchFirstElementEvent,
  createPromise,
  receiveExpectData,
} from './utils/event';
import { createDOMGCanvas } from './utils/createDOMGCanvas';

describe('chart.emit', () => {
  const canvas = createDOMGCanvas(800, 500);

  it('chart.tooltip hide body should emit events.', async () => {
    const { finished, chart, clear } = render({
      canvas,
      container: document.createElement('div'),
    });
    await finished;
    clear();

    // chart.on("tooltip:hide") should be called when hiding tooltip.
    const [tooltipHided, resolveHide] = createPromise();
    chart.on('tooltip:hide', receiveExpectData(resolveHide, null));
    dispatchFirstElementEvent(canvas, 'pointerout');
    await tooltipHided;
  });

  afterAll(() => {
    canvas?.destroy();
  });
});

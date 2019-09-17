import { Group } from '@antv/g';
import Component from '../../component';

type Position = [number, number];

interface MockComponentProps {
  readonly text: string;
}

/**
 * 用于测试的组件
 */
export class MockComponent extends Component {
  // 组件的属性
  private text: string = '';

  constructor(container: any, position: Position, props: MockComponentProps) {
    super(container, position);

    const { text = '' } = props;
    this.text = text;

    this.initial();
  }

  protected initial() {
    this.container.addShape('text', {
      attrs: {
        x: 0,
        y: 0,
        text: this.text,
        textAlign: 'top',
        textBaseline: 'left',
      },
    });

    this.move(...this.position);
  }

  /**
   * 绑定事件
   */
  protected proxyEvents() {
    this.container.on('click', (evt: any) => {
      this.emit('click', evt);
    });
  }
}

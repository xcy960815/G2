import { TransformComponent, Vector2 } from '../runtime';
import { StatisticTransform, StatisticTransformTypes } from './statistic';

export type Transform =
  | SortByTransform
  | PickTransform
  | RenameTransform
  | SubsetTransform
  | FoldTransform
  | FetchTransform
  | FilterByTransform
  | SankeyTransform
  | WordCloudTransform
  | VoronoiTransform
  | ConnectorTransform
  | StatisticTransform
  | CustomTransform;

export type TransformTypes =
  | 'sortBy'
  | 'fetch'
  | 'filterBy'
  | 'pick'
  | 'fold'
  | 'connector'
  | StatisticTransformTypes
  | TransformComponent;

export type SortByTransform = {
  type?: 'sortBy';
  fields?: string[];
  order?: 'DESC' | 'ASC';
};

export type PickTransform = {
  type?: 'pick';
  fields?: string[];
};

export type RenameTransform = {
  type?: 'rename';
  map?: Record<string, string>;
};

export type SubsetTransform = {
  type?: 'subset';
  start?: number;
  end?: number;
  fields?: string[];
};

export type FetchTransform = {
  type?: 'fetch';
  url?: string;
  format?: 'json';
  callback?: (d: any) => any;
};

export type FilterByTransform = {
  type?: 'filterBy';
  fields?: string[];
  callback?: (d: any) => boolean;
};

export type SankeyTransform = {
  type?: 'sankey';
  nodeId?: (node: any) => string;
  nodes?: (graph: any) => any;
  links?: (graph: any) => any;
  /**
   * sankey.nodeSort(undefined) is the default and resorts by ascending breadth during each iteration.
   * sankey.nodeSort(null) specifies the input order of nodes and never sorts.
   * sankey.nodeSort(function) specifies the given order as a comparator function and sorts once on initialization.
   */
  nodeSort?: null | undefined | ((a: any, b: any) => number);
  /**
   * sankey.linkSort(undefined) is the default, indicating that vertical order of links within each node will be determined automatically by the layout. If
   * sankey.linkSort(null) will resort by the input.
   * sankey.linkSort(function) specifies the given order as a comparator function and sorts once on initialization.
   */
  linkSort?: null | undefined | ((a: any, b: any) => number);
  nodeAlign?:
    | 'left'
    | 'center'
    | 'right'
    | 'justify'
    | ((node: any, n: number) => number);
  nodeWidth?: number;
  nodePadding?: number;
  iterations?: number;
  // support config the depth of node
  nodeDepth?: (datum: any, maxDepth: number) => number;
};

export type WordCloudTransform = {
  type?: 'wordCloud';
  /**
   * @description If specified, sets the rectangular [width, height] of the layout
   * @default [1, 1]
   */
  size?: [number, number];
  font?: string | ((word: any) => string);
  fontStyle?: string | ((word: any) => string);
  fontWeight?: any | ((word: any) => any);
  fontSize?: number | [number, number] | ((word: any) => number);
  padding?: number | ((word: any) => number);
  /**
   * @description sets the text accessor function, which indicates the text for each word
   * @default (d) => d.text
   */
  text?: (word: any) => number;
  rotate?: number | ((word: any) => number);
  timeInterval?: number;
  random?: number | (() => number);
  /**
   * @description sets the current type of spiral used for positioning words. This can either be one of the two built-in spirals, "archimedean" and "rectangular"
   * @default "archimedean"
   */
  spiral?:
    | 'archimedean'
    | 'rectangular'
    | ((size: [number, number]) => (t: number) => number[]);
  imageMask?: HTMLImageElement | string;
  on?:
    | ((type: 'end', details?: { cloud; words; bounds }) => void)
    | ((type: 'word', details?: { cloud; word }) => void);
};

export type VoronoiTransform = {
  type?: 'voronoi';
  /**
   * @description Sets the input fields from the data.
   */
  fields: [string, string];
  /**
   * @description Sets the output fields into data.
   */
  as: [string, string];
  /**
   * @description Sets region of canvas.
   */
  extend: Vector2[];
};

export type FoldTransform = {
  type?: 'fold';
  fields?: string[];
  as?: string[];
};

export type ConnectorTransform = {
  type?: 'connector';
  callback: (d: any) => any;
};

export type CustomTransform = {
  type?: TransformComponent;
  [key: string]: any;
};

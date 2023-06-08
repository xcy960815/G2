import { IDocument } from '@antv/g';
import { error } from '../utils/helper';
import { G2ComponentOptions, G2Context, G2Library } from './types/options';
import {
  G2Component,
  G2ComponentNamespaces,
  G2ComponentValue,
} from './types/component';

export function useLibrary<
  O extends G2ComponentOptions,
  C extends G2Component,
  V extends G2ComponentValue,
>(
  namespace: G2ComponentNamespaces,
  library: G2Library,
): [(options: O, context?) => V, (type: O['type']) => C] {
  const create = (type: O['type']) => {
    if (typeof type !== 'string') return type;
    const key = `${namespace}.${type}`;
    return library[key] || error(`Unknown Component: ${key}`);
  };
  const use = (options: O, context?) => {
    const { type, ...rest } = options;
    return create(type)(rest, context);
  };
  return [use, create];
}

export function documentOf(library: G2Context): IDocument {
  const { canvas, group } = library;
  if (group) return group.ownerDocument;
  return canvas.document;
}

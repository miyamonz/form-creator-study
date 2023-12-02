import { PrimitiveAtom, getDefaultStore } from "jotai";
import { FormItem } from "./App";

export function getNarrowedAtom<Type extends string>(
  itemAtom: PrimitiveAtom<FormItem>,
  type: Type
) {
  const store = getDefaultStore();
  const item = store.get(itemAtom);
  if (item.type !== type) {
    return null;
  }
  return itemAtom as unknown as PrimitiveAtom<
    Extract<FormItem, { type: typeof type }>
  >;
}

import { PrimitiveAtom, getDefaultStore } from "jotai";
import { FormItem } from "./App";

export function castAtomType<Item extends FormItem>(
  type: Item["type"],
  itemAtom: PrimitiveAtom<FormItem>
) {
  const store = getDefaultStore();
  const item = store.get(itemAtom);
  if (item.type !== type) {
    return null;
  }
  return itemAtom as unknown as PrimitiveAtom<Item>;
}

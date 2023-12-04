import { atom, useSetAtom } from "jotai";
import { type FormItemText, textImpl } from "./FormItemText";
import { type FormItemRadio, radioImpl } from "./FormItemRadio";
import { type FormItemCheckbox, checkboxImpl } from "./FormItemCheckbox";
import { Action, reducer } from "./reducer";

export type FormItemImpl<
  Type extends string,
  ItemType extends {
    type: Type;
  }
> = {
  type: Type;
  itemType?: ItemType;
  tryRender: (
    item: FormItem,
    onChange: (item: FormItem) => void
  ) => React.ReactNode;
  tryRenderUser: (item: FormItem) => React.ReactNode;
  initialValue: ItemType;
};

export const formItemImpls = [
  textImpl,
  radioImpl,
  checkboxImpl,
] as const satisfies readonly FormItemImpl<string, FormItem>[];

export type FormSchema = {
  items: FormItem[];
};
export type FormItem = FormItemText | FormItemRadio | FormItemCheckbox;

// state
const formSchemaAtom_ = atom<FormSchema>({
  items: [
    textImpl.initialValue,
    radioImpl.initialValue,
    checkboxImpl.initialValue,
  ],
});

export const formSchemaAtom = atom((get) => get(formSchemaAtom_));

const dispatchAtom = atom(null, (get, set, action: Action) => {
  set(formSchemaAtom_, reducer(get(formSchemaAtom_), action));
});
export function useDispatch() {
  return useSetAtom(dispatchAtom);
}

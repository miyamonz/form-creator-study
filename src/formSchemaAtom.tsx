import { atom, PrimitiveAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { type FormItemText, textImpl } from "./FormItemText";
import { type FormItemRadio, radioImpl } from "./FormItemRadio";
import { type FormItemCheckbox, checkboxImpl } from "./FormItemCheckbox";

export type FormItemImpl<
  Type extends string,
  ItemType extends {
    type: Type;
  }
> = {
  type: Type;
  itemType?: ItemType;
  tryRender: (itemAtom: PrimitiveAtom<FormItem>) => React.ReactNode;
  tryRenderUser: (item: FormItem) => React.ReactNode;
  initialValue: ItemType;
};

export const formItemImpls = [
  textImpl,
  radioImpl,
  checkboxImpl,
] as const satisfies readonly FormItemImpl<string, FormItem>[];

type FormSchema = {
  items: FormItem[];
};
export type FormItem = FormItemText | FormItemRadio | FormItemCheckbox;

// state
export const formSchemaAtom = atom<FormSchema>({
  items: [
    textImpl.initialValue,
    radioImpl.initialValue,
    checkboxImpl.initialValue,
  ],
});
const itemsAtom = focusAtom(formSchemaAtom, (optic) => optic.prop("items"));
export const itemAtomsAtom = splitAtom(itemsAtom);

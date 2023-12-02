import { atom, useAtom, PrimitiveAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { type FormItemText, textImpl } from "./FormItemText";
import { type FormItemRadio, radioImpl } from "./FormItemRadio";
import { FormItemCheckbox, checkboxImpl } from "./FormItemCheckbox";
import { TwoPane } from "./TwoPane";
import { SchemaEditor } from "./SchemaEditor";

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

const formSchemaAtom = atom<FormSchema>({
  items: [
    textImpl.initialValue,
    radioImpl.initialValue,
    checkboxImpl.initialValue,
  ],
});

const itemsAtom = focusAtom(formSchemaAtom, (optic) => optic.prop("items"));
export const itemAtomsAtom = splitAtom(itemsAtom);
function App() {
  return (
    <>
      <TwoPane left={<SchemaEditor />} right={<Preview />} />
    </>
  );
}

function Preview() {
  const [schema] = useAtom(formSchemaAtom);

  return (
    <>
      <div>
        {schema.items.map((item, i) => {
          const impl = formItemImpls.find((impl) => impl.type === item.type)!;
          return (
            <div key={i} className="border-2 border-black p-2">
              {impl.tryRenderUser(item)}
            </div>
          );
        })}
      </div>
      <pre className="mt-2 border-2 border-black">
        {JSON.stringify(schema, null, 2)}
      </pre>
    </>
  );
}
export default App;

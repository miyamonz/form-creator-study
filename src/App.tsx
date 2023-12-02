import { atom, useAtom, PrimitiveAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { useState } from "react";
import { type FormItemText, textImpl } from "./FormItemText";
import { type FormItemRadio, radioImpl } from "./FormItemRadio";

export type FormItemImpl<
  Type extends string,
  ItemType extends {
    type: Type;
  }
> = {
  type: Type;
  itemType?: ItemType;
  tryRender: (itemAtom: PrimitiveAtom<FormItem>) => React.ReactNode;
  initialValue: ItemType;
};

const formItemImpls = [
  textImpl,
  radioImpl,
] as const satisfies readonly FormItemImpl<string, FormItem>[];

type FormSchema = {
  items: FormItem[];
};
export type FormItem = FormItemText | FormItemRadio;

const formSchemaAtom = atom<FormSchema>({
  items: [
    {
      type: "text",
      title: "",
      description: "",
    },
    {
      type: "radio",
      title: "",
      description: "",
      choices: ["選択肢1"],
    },
  ],
});

const itemsAtom = focusAtom(formSchemaAtom, (optic) => optic.prop("items"));
const itemAtomsAtom = splitAtom(itemsAtom);
function App() {
  const [schema] = useAtom(formSchemaAtom);

  return (
    <>
      <TwoPane
        left={<SchemaEditor />}
        right={<pre>{JSON.stringify(schema, null, 2)}</pre>}
      />
    </>
  );
}

function TwoPane({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <div className="w-1/2 outline outline-2 outline-blue-300">{left}</div>
      <div className="w-1/2 outline outline-2 outline-blue-300">{right}</div>
    </div>
  );
}

function SchemaEditor() {
  // const [schema, setSchema] = useAtom(formSchemaAtom);

  return <ItemsView />;
}

function ItemsView() {
  const [itemAtoms, dispatch] = useAtom(itemAtomsAtom);

  return (
    <div>
      <h2 className="text-3xl">form editor</h2>
      <ul>
        {itemAtoms.map((item, index) => (
          <div key={index} className="relative [&:not(:first-child)]:mt-2">
            <ItemView itemAtom={item} />
            {/* remove button on top right */}
            <div className="absolute top-0 right-0 w-8 aspect-square">
              <button
                className=" bg-red-500 hover:bg-red-700 text-white font-bold  w-full h-full"
                onClick={() => {
                  dispatch({ type: "remove", atom: item });
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </ul>
      <AddButton />
    </div>
  );
}

function AddButton() {
  const [, dispatch] = useAtom(itemAtomsAtom);

  const [type, setType] =
    useState<(typeof formItemImpls)[number]["type"]>("text");
  const currentInitialValue = formItemImpls.find(
    (impl) => impl.type === type
  )!.initialValue;

  return (
    <>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
      >
        {formItemImpls.map((impl) => (
          <option key={impl.type} value={impl.type}>
            {impl.type}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          dispatch({
            type: "insert",
            value: currentInitialValue,
          });
        }}
      >
        add
      </button>
    </>
  );
}

function ItemView({ itemAtom }: { itemAtom: PrimitiveAtom<FormItem> }) {
  return formItemImpls
    .map((impl) => impl.tryRender(itemAtom))
    .reduce((acc, elm) => acc ?? elm, null as React.ReactNode);
}
export default App;

import { useAtom, PrimitiveAtom } from "jotai";
import { useState } from "react";
import { itemAtomsAtom, formItemImpls, FormItem } from "./App";

export function SchemaEditor() {
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

import { useAtom } from "jotai";
import { useState } from "react";
import {
  formItemImpls,
  FormItem,
  useDispatch,
  formSchemaAtom,
} from "./formSchemaAtom";

export function SchemaEditor() {
  return <ItemsView />;
}
function ItemsView() {
  const [schema] = useAtom(formSchemaAtom);
  const items = schema.items;

  return (
    <div>
      <h2 className="text-3xl">form editor</h2>
      <ul>
        {items.map((item, index) => {
          return (
            <div key={index} className="relative [&:not(:first-child)]:mt-2">
              <ItemView item={item} index={index} />
              <div className="absolute top-0 right-0">
                <RemoveButton index={index} />
              </div>
            </div>
          );
        })}
      </ul>
      <AddButton />
    </div>
  );
}

function RemoveButton({ index }: { index: number }) {
  const dispatch = useDispatch();

  return (
    <button
      className=" bg-red-500 hover:bg-red-700 text-white font-bold w-8 aspect-square"
      onClick={() => {
        dispatch({ type: "remove", index });
      }}
    >
      ✕
    </button>
  );
}
function AddButton() {
  const dispatch = useDispatch();

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
            type: "add",
            item: currentInitialValue,
          });
        }}
      >
        add
      </button>
    </>
  );
}
function ItemView({ item, index }: { item: FormItem; index: number }) {
  const dispatch = useDispatch();

  const onChange = (update: FormItem) => {
    dispatch({ type: "update", index, item: update });
  };

  return formItemImpls
    .map((impl) => impl.tryRender(item, onChange))
    .reduce((acc, elm) => acc ?? elm, null as React.ReactNode);
}

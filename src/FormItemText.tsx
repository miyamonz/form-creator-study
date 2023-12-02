import { useAtom, PrimitiveAtom } from "jotai";
import { FormItem, FormItemImpl } from "./App";
import { castAtomType } from "./castAtomType";

const typeName = "text" as const;
export type FormItemText = {
  type: typeof typeName;
  title: string;
  description: string;
};

const initialValue = {
  type: typeName,
  title: "",
  description: "",
} as const satisfies FormItemText;

function tryRender(itemAtom: PrimitiveAtom<FormItem>) {
  const anAtom = castAtomType<FormItemText>(typeName, itemAtom);
  if (!anAtom) return null;
  return <ItemViewText itemAtom={anAtom} />;
}

function ItemViewText({ itemAtom }: { itemAtom: PrimitiveAtom<FormItemText> }) {
  const [item, setItem] = useAtom(itemAtom);

  return (
    <div className="border-2 border-black p-2">
      <h3 className="text-xl">Title</h3>
      <input
        className="text-2xl"
        type="text"
        value={item.title}
        onChange={(e) =>
          setItem((item) => ({ ...item, title: e.target.value }))
        }
        placeholder="title"
      />
      <br />
      <h3 className="text-xl">Description</h3>
      <input
        type="text"
        value={item.description}
        onChange={(e) =>
          setItem((item) => ({ ...item, description: e.target.value }))
        }
        placeholder="description"
      />
    </div>
  );
}

export const textImpl = {
  type: typeName,
  tryRender,
  initialValue,
} as const satisfies FormItemImpl<typeof typeName, FormItemText>;

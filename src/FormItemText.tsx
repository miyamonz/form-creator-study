import { useAtom, PrimitiveAtom } from "jotai";
import { FormItem, FormItemImpl } from "./App";
import { castAtomType } from "./castAtomType";

export type FormItemText = {
  type: "text";
  title: string;
  description: string;
};

const initialValue = {
  type: "text",
  title: "",
  description: "",
} as const satisfies FormItemText;

function tryRender(itemAtom: PrimitiveAtom<FormItem>) {
  const anAtom = castAtomType<FormItemText>("text", itemAtom);
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
  type: "text",
  tryRender,
  initialValue,
} as const satisfies FormItemImpl<"text", FormItemText>;

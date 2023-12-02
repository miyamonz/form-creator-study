import { useAtom, PrimitiveAtom } from "jotai";
import { FormItem, FormItemImpl } from "./App";
import { getNarrowedAtom } from "./getNarrowedAtom";

export type FormItemText = {
  type: "text";
  title: string;
  description: string;
};

const initialValueText = {
  type: "text",
  title: "",
  description: "",
} as const satisfies FormItemText;

function tryRenderFormItemText(itemAtom: PrimitiveAtom<FormItem>) {
  const anAtom = getNarrowedAtom(itemAtom, "text");
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
  itemType: initialValueText,
  tryRender: tryRenderFormItemText,
  initialValue: initialValueText,
} as const satisfies FormItemImpl<"text", FormItemText>;

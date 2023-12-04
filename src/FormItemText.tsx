import { FormItem, FormItemImpl } from "./formSchemaAtom";

const typeName = "text" as const;
export type FormItemText = {
  type: typeof typeName;
  title: string;
  description: string;
};

const initialValue = {
  type: typeName,
  title: "タイトル",
  description: "説明",
} as const satisfies FormItemText;

function tryRender(item: FormItem, onChange: (item: FormItem) => void) {
  if (item.type !== typeName) return null;

  return <ItemViewText item={item} onChange={onChange} />;
}

function ItemViewText({
  item,
  onChange,
}: {
  item: FormItemText;
  onChange: (item: FormItemText) => void;
}) {
  return (
    <div className="border-2 border-black p-2">
      <h3 className="text-xl">Title</h3>
      <input
        className="text-2xl"
        type="text"
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        placeholder="title"
      />
      <br />
      <h3 className="text-xl">Description</h3>
      <input
        type="text"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        placeholder="description"
      />
    </div>
  );
}

function tryRenderUser(schema: FormItem) {
  if (schema.type !== typeName) return null;
  return <ViewForUser schema={schema} />;
}
function ViewForUser({ schema }: { schema: FormItemText }) {
  return (
    <div>
      <h1>{schema.title}</h1>
      <p>{schema.description}</p>
      <input type="text" />
    </div>
  );
}

export const textImpl = {
  type: typeName,
  tryRender,
  initialValue,
  tryRenderUser,
} as const satisfies FormItemImpl<typeof typeName, FormItemText>;

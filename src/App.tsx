import { useAtom } from "jotai";
import { TwoPane } from "./TwoPane";
import { SchemaEditor } from "./SchemaEditor";
import { formSchemaAtom, formItemImpls } from "./formSchemaAtom";

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

import { useMemo } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { FormItem, FormItemImpl } from "./App";
import { focusAtom } from "jotai-optics";
import { splitAtom } from "jotai/utils";
import { castAtomType } from "./castAtomType";

const typeName = "radio" as const;

export type FormItemRadio = {
  type: typeof typeName;
  title: string;
  description: string;
  choices: string[];
};

const initialValue = {
  type: typeName,
  title: "タイトル",
  description: "説明",
  choices: ["選択肢1"] as string[],
} as const satisfies FormItemRadio;

function tryRender(itemAtom: PrimitiveAtom<FormItem>) {
  const anAtom = castAtomType<FormItemRadio>(typeName, itemAtom);
  if (!anAtom) return null;
  return <ItemViewRadio itemAtom={anAtom} />;
}

function ItemViewRadio({
  itemAtom,
}: {
  itemAtom: PrimitiveAtom<FormItemRadio>;
}) {
  const [item, setItem] = useAtom(itemAtom);

  const choicesAtom = useMemo(() => {
    return focusAtom(itemAtom, (optic) => optic.prop("choices"));
  }, [itemAtom]);

  return (
    // text form with title and description, add tailwind classes
    <div className="border-2 border-black p-2">
      <h3 className="text-xl">radio</h3>
      <input
        className="text-2xl"
        type="text"
        value={item.title}
        onChange={(e) => setItem({ ...item, title: e.target.value })}
        placeholder="title"
      />
      <br />
      <h3 className="text-xl">Description</h3>
      <input
        type="text"
        value={item.description}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
        placeholder="description"
      />

      <h3 className="text-xl">choices</h3>
      <ChoicesView choicesAtom={choicesAtom} />
    </div>
  );
}

function ChoicesView({
  choicesAtom,
}: {
  choicesAtom: PrimitiveAtom<string[]>;
}) {
  const [choices, setChoices] = useAtom(choicesAtom);
  const choiceAtomsAtom = useMemo(() => splitAtom(choicesAtom), [choicesAtom]);

  const [choiceAtoms, dispatch] = useAtom(choiceAtomsAtom);
  return (
    <div>
      {choices.map((choice, index) => (
        <div key={index}>
          <input
            type="text"
            value={choice}
            onChange={(e) => {
              const newChoices = [...choices];
              newChoices[index] = e.target.value;
              setChoices(newChoices);
            }}
            placeholder="choice"
          />
          <button
            onClick={() => {
              dispatch({ type: "remove", atom: choiceAtoms[index] });
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        onClick={() => {
          setChoices([...choices, ""]);
        }}
      >
        add
      </button>
    </div>
  );
}

function tryRenderUser(schema: FormItem) {
  if (schema.type !== typeName) return null;
  return <ViewForUser schema={schema} />;
}
function ViewForUser({ schema }: { schema: FormItemRadio }) {
  return (
    <div>
      <h1>{schema.title}</h1>
      <p>{schema.description}</p>
      <div>
        {schema.choices.map((choice) => (
          // todo
          <div key={choice}>
            <input type="radio" id="aaa" name="aaa" value={choice} />
            <label>{choice}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export const radioImpl = {
  type: typeName,
  tryRender,
  initialValue,
  tryRenderUser,
} as const satisfies FormItemImpl<typeof typeName, FormItemRadio>;

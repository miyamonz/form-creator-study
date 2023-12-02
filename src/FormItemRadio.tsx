import { useMemo } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { FormItem, FormItemImpl } from "./App";
import { focusAtom } from "jotai-optics";
import { getNarrowedAtom } from "./getNarrowedAtom";
import { splitAtom } from "jotai/utils";

export type FormItemRadio = {
  type: "radio";
  title: string;
  description: string;
  choices: string[];
};

const initialValueRadio = {
  type: "radio",
  title: "",
  description: "",
  choices: ["選択肢1"] as string[],
} as const satisfies FormItemRadio;

function tryRenderFormItemRadio(itemAtom: PrimitiveAtom<FormItem>) {
  const anAtom = getNarrowedAtom(itemAtom, "radio");
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

export const radioImpl = {
  type: "radio",
  itemType: initialValueRadio,
  tryRender: tryRenderFormItemRadio,
  initialValue: initialValueRadio,
} as const satisfies FormItemImpl<"radio", FormItemRadio>;

import { FormItem, FormSchema } from "./formSchemaAtom";

export type Action =
  | { type: "add"; item: FormItem }
  | { type: "remove"; index: number }
  | { type: "update"; index: number; item: FormItem };

export function reducer(state: FormSchema, action: Action): FormSchema {
  switch (action.type) {
    case "add":
      return {
        ...state,
        items: [...state.items, action.item],
      };
    case "remove":
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index),
      };
    case "update":
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.index ? action.item : item
        ),
      };
  }
  return state;
}

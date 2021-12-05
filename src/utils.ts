import df from "d-forest";
import { FormState, InputMap, InputState } from "./types";
import { InputStatus } from "./enums";

function mergeInputState(
  name: string,
  inputState: InputState,
  state: FormState
) {
  return Object.entries(inputState).reduce((prev, [key, value]) => {
    return df.updateByPath(prev, [key, name], () => value);
  }, state);
}

function mergeInputMap(inputMap: InputMap<InputState>, state: FormState) {
  return Object.entries(inputMap).reduce((prev, [name, state]) => {
    return mergeInputState(name, state || {}, prev);
  }, state);
}

function areEqual(obj1: Object, obj2: Object) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

function classByStatus(status: string) {
  const classNames = {
    [InputStatus.error]: "is-danger",
    [InputStatus.warning]: "is-warning",
    [InputStatus.success]: "is-success",
  };
  return classNames[status] || "";
}

const isFunction = (value: unknown) => typeof value === "function";

export { mergeInputState, mergeInputMap, areEqual, classByStatus, isFunction };

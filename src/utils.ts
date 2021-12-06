import df from "d-forest";
import { FormState, InputMap, InputState } from "./types";
import { InputStatus } from "./enums";

function mergeInputState(name: string, state: InputState, form: FormState) {
  return Object.entries(state).reduce((prev, [key, value]) => {
    return df.updateByPath(prev, [key, name], () => value);
  }, form);
}

function mergeInputMap(map: InputMap<InputState>, form: FormState) {
  return Object.entries(map).reduce((prev, [name, state]) => {
    return mergeInputState(name, state || {}, prev);
  }, form);
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

export { mergeInputState, mergeInputMap, areEqual, classByStatus };

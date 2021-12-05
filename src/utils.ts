import df from "d-forest";
import { FormState, IFormState, InputState } from "./types";
import { InputStatus } from "./enums";

function mergeInputState(name: string, state: InputState, form: IFormState) {
  return Object.entries(state).reduce((prev, [key, value]) => {
    return df.updateByPath(prev, [key, name], () => value);
  }, form);
}

function mergeFormState(state: FormState, form: IFormState) {
  return Object.entries(state).reduce((prev, [key, state]) => {
    return { ...prev, [key]: { ...prev[key], ...state } };
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

export { mergeInputState, mergeFormState, areEqual, classByStatus };

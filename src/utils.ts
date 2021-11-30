import { isValidElement, ReactElement } from "react";

function isReactElement(el: ReactElement) {
  return isValidElement(el) && typeof el.type === "function";
}

function areEqual(obj1: any, obj2: any) {
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

export { isReactElement, areEqual };

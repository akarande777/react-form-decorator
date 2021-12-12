import { createContext, MutableRefObject, ReactElement } from "react";
import { IFormState, InputDecProps, InputProps } from "./types";

interface IFormContext {
  stateRef: MutableRefObject<IFormState>;
  formState: IFormState;
  getInputProps: (name: string) => InputProps;
  inputDecorator?: (name: string, props: InputDecProps) => ReactElement;
}

const FormContext = createContext({} as IFormContext);

export default FormContext;

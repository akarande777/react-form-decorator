import { ReactElement } from "react";

export interface InputMap<T> {
  [key: string]: T;
}

export type InputStatus = "succes" | "danger" | "warning";

export type Validate = (
  value: string
) => Promise<[InputStatus, string] | []> | [InputStatus, string] | [];

export interface FormState {
  input: InputMap<string>;
  initial: InputMap<string>;
  required: InputMap<boolean>;
  status: InputMap<InputStatus>;
  message: InputMap<string>;
  validate: InputMap<Validate>;
  format: InputMap<(value: string) => string>;
  validateRef: string;
}

export interface InputWrapperProps {
  name: string;
  inputEl: ReactElement;
  label?: string;
  status?: string;
  message?: string;
}

export interface FormOptions {
  validateTrigger?: (name: string) => "onChange" | "onBlur";
  messageOnEmpty?: (name: string) => string;
  valueFromEvent?: (event: unknown, name: string) => string;
  inputWrapper?: (props: InputWrapperProps) => ReactElement;
}

export interface Options {
  label?: string;
  clsname?: string;
  addon?: ReactElement;
  initial?: string;
  required?: boolean;
  validate?: Validate;
  format?: (value: string) => string;
}

export interface InputState {
  input?: string;
  required?: boolean;
  status?: InputStatus;
  message?: string;
}

export interface InputProps {
  name: string;
  value: string;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
}

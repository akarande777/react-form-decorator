import { ReactElement } from "react";

export interface InputMap<T> {
  [key: string]: T | undefined;
}

export type Validate =
  | [string, string, InputMap<InputState>]
  | [string, string]
  | [];

export type PromiseOr<T> = Promise<T> | T;

export interface IValidate {
  name: string;
  action: "validate" | "resolve";
  value: PromiseOr<Validate>;
}

export interface IFormState {
  input: InputMap<any>;
  initial: InputMap<any>;
  required: InputMap<boolean>;
  status: InputMap<string>;
  message: InputMap<string>;
  validate: InputMap<(value: any) => PromiseOr<Validate>>;
  format: InputMap<(value: any) => string>;
}

export interface InputDecProps {
  inputEl: ReactElement;
  status?: string;
  message?: string;
}

export interface Options {
  initial?: any;
  required?: boolean;
  validate?: (value: any) => PromiseOr<Validate>;
  format?: (value: any) => string;
}

export interface InputState {
  input?: any;
  required?: boolean;
  status?: string;
  message?: string;
}

export interface InputProps {
  name: string;
  value: any;
  onChange: (event: unknown) => void;
  onBlur: () => void;
}

export interface FormState {
  input: InputMap<any>;
  required: InputMap<boolean>;
  status: InputMap<string>;
  message: InputMap<string>;
}

export interface FormInstance {
  formState: FormState;
  setInputState: (state: InputMap<InputState>) => void;
  validateForm: () => Promise<InputMap<any>>;
}

import { ReactElement } from "react";

export interface InputMap<T> {
  [key: string]: T | undefined;
}

export type Validate = [string, string, FormState] | [string, string] | [];

export type PromiseOr<T> = Promise<T> | T;

export interface ValidState {
  name: string;
  action: "validate" | "resolve";
  value: PromiseOr<Validate>;
}

export interface IFormState {
  input: InputMap<string>;
  initial: InputMap<string>;
  required: InputMap<boolean>;
  status: InputMap<string>;
  message: InputMap<string>;
  validate: InputMap<(value: string) => PromiseOr<Validate>>;
  format: InputMap<(value: string) => string>;
}

export interface FormState {
  input?: InputMap<string>;
  initial?: InputMap<string>;
  required?: InputMap<boolean>;
  status?: InputMap<string>;
  message?: InputMap<string>;
}

export interface InputDecProps {
  inputEl: ReactElement;
  label?: string;
  status?: string;
  message?: string;
}

export interface FormOptions {
  messageOnEmpty?: (name: string) => string;
  valueFromEvent?: (name: string, event: unknown) => string;
  customDecorator?: (name: string, props: InputDecProps) => ReactElement;
}

export interface Options {
  label?: string;
  addons?: [ReactElement | null, ReactElement | null];
  initial?: string;
  required?: boolean;
  validate?: (value: string) => PromiseOr<Validate>;
  format?: (value: string) => string;
}

export interface InputState {
  input?: string;
  initial?: string;
  required?: boolean;
  status?: string;
  message?: string;
}

export interface InputProps {
  name: string;
  value: string;
  onChange: (event: unknown) => void;
}

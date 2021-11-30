export interface AnyInput<T> {
  [key: string]: T | undefined;
}

export type InputError = Promise<AnyInput<string>> | AnyInput<string>;

export interface FormState {
  input: AnyInput<string>;
  initial: AnyInput<string>;
  required: AnyInput<boolean>;
  error: AnyInput<string>;
}

export interface InputState {
  input?: string;
  initial?: string;
  required?: boolean;
  error?: string;
}

export interface Options {
  label?: string;
  initial?: string;
  required?: boolean;
  validate?: (value: string, state: AnyInput<string>) => InputError;
  format?: (value: string) => string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

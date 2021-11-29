type PureFn = (value: string, state: FormState) => string;

export interface FormState {
  input: { [key: string]: string };
  initial: { [key: string]: string };
  required: { [key: string]: boolean };
  error: { [key: string]: string };
  validate: { [key: string]: PureFn };
  format: { [key: string]: PureFn };
}

export interface InputState {
  input?: string;
  initial?: string;
  required?: boolean;
  error?: string;
  validate?: PureFn;
  format?: PureFn;
}

export interface Options {
  label?: string;
  initial?: string;
  required?: boolean;
  validate?: PureFn;
  format?: PureFn;
}

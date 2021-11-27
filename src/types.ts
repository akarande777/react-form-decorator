type PureFn = (value: string, state: FormState) => string;

export interface FormState {
  input: { [key: string]: string };
  initial: { [key: string]: string };
  required: { [key: string]: boolean };
  valid: { [key: string]: boolean };
  message: { [key: string]: string };
  validate: { [key: string]: PureFn };
  format: { [key: string]: PureFn };
}

export interface InputState {
  input?: string;
  initial?: string;
  required?: boolean;
  valid?: boolean;
  message?: string;
  validate?: PureFn;
  format?: PureFn;
}

export interface Options {
  initial?: string;
  required?: boolean;
  validate?: PureFn;
  format?: PureFn;
}

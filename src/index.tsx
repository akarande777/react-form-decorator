import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  FormOptions,
  FormState,
  InputProps,
  InputState,
  InternalState,
  Options,
} from "./types";
import "./index.scss";
import {
  areEqual,
  classByStatus,
  mergeInputMap,
  mergeInputState,
} from "./utils";
import { InputStatus } from "./enums";
import FormInput from "./components/form-input";
import FormField from "./components/form-field";
import debounce from "lodash.debounce";

const FORM_STATE: InternalState = {
  input: {},
  initial: {},
  required: {},
  status: {},
  message: {},
  validate: {},
  format: {},
  validateRef: "",
};

function useFormDecorator({
  messageOnEmpty = () => "This field is required",
  valueFromEvent = (_, e: any) => e.target.value,
  customDecorator,
}: FormOptions = {}) {
  const [formState, setFormState] = useState(FORM_STATE);
  const { input, required, status, message } = formState;
  const { initial, validateRef } = formState;
  const stateRef: React.MutableRefObject<InternalState> = useRef(formState);
  const { validate, format } = stateRef.current;
  stateRef.current = formState;

  const asyncValidator = useRef(
    debounce(({ name, formState, validateInput }) => {
      const { input } = formState;
      const result = validateInput(name, input[name]);
      Promise.resolve(result).then(([sts, msg, map]) => {
        const { status, message } = formState;
        const state = {
          ...formState,
          status: { ...status, [name]: sts || "" },
          message: { ...message, [name]: msg || "" },
          validateRef: "",
        };
        setFormState(mergeInputMap(map || {}, state));
      });
    }, 400)
  );

  useEffect(() => {
    setFormState(stateRef.current);
  }, []);

  useEffect(() => {
    if (validateRef) {
      const name = validateRef;
      asyncValidator.current({ name, formState, validateInput });
    }
  }, [formState]);

  const _format = (name: string, value: string) => {
    if (typeof format[name] === "function") return format[name](value);
    return value;
  };

  const validateInput = (name: string, value: string) => {
    const hasValue = _format(name, value) !== _format(name, "");
    if (required[name] && !hasValue) {
      return [InputStatus.error, messageOnEmpty(name)];
    }
    if (typeof validate[name] === "function") {
      return validate[name](value);
    }
    return [];
  };

  const handleChange = (name: string, value: string) => {
    const input = _format(name, value);
    setFormState({
      ...mergeInputState(name, { input }, formState),
      validateRef: name,
    });
  };

  const getInputProps = (name: string) => ({
    value: _format(name, input[name]),
    onChange: (event: any) => {
      handleChange(name, valueFromEvent(name, event));
    },
  });

  const formatInitial = ({ initial, format }: Options) => {
    if (typeof format === "function") return format(initial || "");
    return initial || "";
  };

  const inputDecorator = (
    name: string,
    { label, addons, ...options }: Options
  ) => {
    const input = formatInitial(options);
    const state = { ...options, initial: input, input };
    stateRef.current = mergeInputState(name, state, stateRef.current);

    return (getInputEl: (props: InputProps) => ReactElement) => {
      const props = { name, ...getInputProps(name) };
      const inputEl = getInputEl(props);
      if (typeof customDecorator === "function") {
        return customDecorator(name, {
          inputEl,
          label,
          status: status[name],
          message: message[name],
        });
      }
      return (
        <FormField
          className={`rfd-${name} ${addons ? "has-addons" : ""}`}
          status={status[name] || ""}
          message={message[name] || ""}
        >
          {addons && addons[0]}
          <FormInput
            inputEl={inputEl}
            className={classByStatus(status[name])}
            label={label || ""}
          />
          {addons && addons[1]}
        </FormField>
      );
    };
  };

  const validateForm = () => {
    return Object.keys(input)
      .reduce((prev, name) => {
        return prev.then((acc) => {
          const result = validateInput(name, input[name]);
          return Promise.resolve(result).then(([sts, msg]) => [
            [...acc[0], [name, sts || ""]],
            [...acc[1], [name, msg || ""]],
          ]);
        });
      }, Promise.resolve([[], []]))
      .then((entries: string[][][]) => {
        setFormState({
          ...formState,
          status: Object.fromEntries(entries[0]),
          message: Object.fromEntries(entries[1]),
        });
        const error = entries[0].find(([_, sts]) => sts === InputStatus.error);
        if (error) throw entries[1];
        return input;
      });
  };

  return {
    formState: { input, required, status, message } as FormState,
    setInputState: (name: string, state: InputState) => {
      setFormState(mergeInputState(name, state, stateRef.current));
    },
    inputDecorator,
    validateForm,
    isFormDirty: () => !areEqual(input, initial),
  };
}

export { useFormDecorator };

import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  FormOptions,
  FormState,
  InputProps,
  InputState,
  Options,
} from "./types";
import df from "d-forest";
import InputGroup from "./components/input-group";
import "./index.scss";
import debounce from "lodash.debounce";
import { areEqual } from "./utils";
import { InputStatus, InputEvents } from "./enums";

const FORM_STATE: FormState = {
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
  validateTrigger = () => InputEvents.change,
  messageOnEmpty = () => "This field is required",
  valueFromEvent = (e: any) => e.target.value,
  inputWrapper,
}: FormOptions = {}) {
  const [formState, setFormState] = useState(FORM_STATE);
  const { input, required, status, message } = formState;
  const { initial, validateRef } = formState;
  const stateRef: React.MutableRefObject<FormState> = useRef(FORM_STATE);
  const { validate, format } = stateRef.current;

  const asyncValidator = useRef(
    debounce(({ name, formState, validateInput }) => {
      const { input, status, message } = formState;
      const result = validateInput(name, input[name]);
      Promise.resolve(result).then(([sts, msg]) => {
        setFormState({
          ...formState,
          status: { ...status, [name]: sts || "" },
          message: { ...message, [name]: msg || "" },
          validateRef: "",
        });
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
    return Promise.reject();
  };

  const mergeState = (name: string, state: InputState, form = formState) => {
    return Object.entries(state).reduce((prev, [key, value]) => {
      return df.updateByPath(prev, [key, name], () => value);
    }, form);
  };

  const handleChange = (name: string, value: string) => {
    const _validate = validateTrigger(name) === InputEvents.change;
    setFormState({
      ...mergeState(name, { input: _format(name, value) }),
      validateRef: _validate ? name : "",
    });
  };

  const getInputValue = (name: string, event: any) => {
    if (typeof valueFromEvent[name] === "function")
      return valueFromEvent[name](event);
    return event.target.value;
  };

  const getInputProps = (name: string) => {
    return {
      value: _format(name, input[name]),
      onChange: (event: any) => {
        handleChange(name, getInputValue(name, event));
      },
      onBlur: () => {
        if (validateTrigger(name) === InputEvents.blur)
          setFormState({ ...formState, validateRef: name });
      },
    };
  };

  const formatInitial = ({ initial, format }: Options) => {
    if (typeof format === "function") return format(initial || "");
    return initial || "";
  };

  const inputDecorator = (
    name: string,
    { label, clsname, ...options }: Options
  ) => {
    const _initial = formatInitial(options);
    const state = { ...options, initial: _initial, input: _initial };
    stateRef.current = mergeState(name, state, stateRef.current);

    return (getInputEl: (props: InputProps) => ReactElement) => {
      const props = { name, ...getInputProps(name) };
      const inputEl = getInputEl(props);

      if (typeof inputWrapper === "function") {
        return inputWrapper({
          ...{ name, label, inputEl },
          status: status[name],
          message: message[name],
        });
      }

      return (
        <div className={"field rfd-" + name}>
          <InputGroup
            inputEl={inputEl}
            label={label || ""}
            status={status[name] || ""}
          />
          {status[name] && (
            <p className={"help is-" + status[name]}>{message[name]}</p>
          )}
        </div>
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
    formState: { input, required, status, message },
    setFormState: (name: string, state: InputState) => {
      setFormState(mergeState(name, { [name]: state }));
    },
    inputDecorator,
    validateForm,
    isFormDirty: () => !areEqual(input, initial),
  };
}

export { useFormDecorator };

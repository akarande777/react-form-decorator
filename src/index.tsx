import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormState, InputState, Options } from "./types";
import df from "d-forest";

interface InputMap {
  [key: string]: InputState;
}

const FORM_STATE: FormState = {
  input: {},
  initial: {},
  required: {},
  valid: {},
  message: {},
  validate: {},
  format: {},
};

function useFormDecorator() {
  const [formState, setFormState] = useState(FORM_STATE);
  const { input, required, validate, format } = formState;
  const inputMap: React.MutableRefObject<InputMap | null> = useRef({});

  useEffect(() => {
    if (inputMap.current) {
      const newState = Object.entries(inputMap.current).reduce(
        (prev, [name, state]) => mergeState(name, state, prev),
        formState
      );
      inputMap.current = null;
      setFormState(newState);
    }
  }, []);

  const getValue = (name: string, value: string) => {
    if (typeof format[name] === "function") {
      return format[name](value, formState);
    }
    return value;
  };

  const hasValue = (name: string, value: string) => {
    return getValue(name, value) !== getValue(name, "");
  };

  const validateInput = (name: string, value: string) => {
    if (required[name] && !hasValue(name, value)) {
      return { valid: false, message: "This field is required" };
    }
    if (typeof validate[name] === "function") {
      const message = validate[name](value, formState);
      return { valid: !message, message };
    }
    return { valid: true, message: "" };
  };

  const mergeState = (name: string, state: InputState, form = formState) => {
    return Object.entries(state).reduce((prev, [key, value]) => {
      return df.updateByPath(prev, [key, name], () => value);
    }, form);
  };

  const handleChange = (name: string, value: string) => {
    const newState = mergeState(name, {
      input: getValue(name, value),
      ...validateInput(name, getValue(name, value)),
    });
    setFormState(newState);
  };

  const decorate =
    (inputEl: ReactElement) =>
    (name: string, options: Options = {}) => {
      if (inputMap.current) {
        const initial = options.initial || "";
        inputMap.current = {
          ...inputMap.current,
          [name]: { ...(options as InputState), input: initial, initial },
        };
      } else {
        inputMap.current = {
          [name]: { ...(options as InputState) },
        };
      }
      return React.cloneElement(inputEl, {
        name,
        value: getValue(name, input[name] || ""),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(name, e.target.value);
        },
        ...inputEl.props,
      });
    };

  const isFormValid = useMemo(() => {
    return Object.entries(input).every(
      ([name, value]) => validateInput(name, value).valid
    );
  }, [input]);

  return { formState, setFormState, decorate, isFormValid };
}

export { useFormDecorator };

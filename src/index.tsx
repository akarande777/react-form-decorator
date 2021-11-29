import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormState, InputState, Options } from "./types";
import df from "d-forest";
import InputGroup from "./components/input-group";
import "./index.scss";

interface InputMap {
  [key: string]: InputState;
}

const FORM_STATE: FormState = {
  input: {},
  initial: {},
  required: {},
  error: {},
  validate: {},
  format: {},
};

function useFormDecorator() {
  const [formState, setFormState] = useState(FORM_STATE);
  const { input, required, error, validate, format } = formState;
  const inputMap: React.MutableRefObject<InputMap | null> = useRef({});

  useEffect(() => {
    const newState = Object.entries(inputMap.current || {}).reduce(
      (prev, [name, state]) => mergeState(name, state, prev),
      formState
    );
    setFormState(newState);
    inputMap.current = null;
  }, []);

  const applyFormat = (name: string, value: string) => {
    if (typeof format[name] === "function") {
      return format[name](value, formState);
    }
    return value;
  };

  const hasValue = (name: string, value: string) => {
    return applyFormat(name, value) !== applyFormat(name, "");
  };

  const validateInput = (name: string, value: string) => {
    if (required[name] && !hasValue(name, value)) {
      return "This field is required";
    }
    if (typeof validate[name] === "function") {
      return validate[name](value, formState);
    }
    return "";
  };

  const mergeState = (name: string, state: InputState, form = formState) => {
    return Object.entries(state).reduce((prev, [key, value]) => {
      return df.updateByPath(prev, [key, name], () => value);
    }, form);
  };

  const handleChange = (name: string, value: string) => {
    const input = applyFormat(name, value);
    const error = validateInput(name, input);
    const newState = mergeState(name, { input, error });
    setFormState(newState);
  };

  const initialize = (name: string, options: Options) => {
    const initial = options.initial || "";
    inputMap.current = {
      ...inputMap.current,
      [name]: { ...options, initial, input: initial },
    };
  };

  const getClassName = (name: string, inputEl: ReactElement) => {
    const { className, type } = inputEl.props;
    const errorClass = error[name] ? "is-danger" : "";
    switch (true) {
      case inputEl.type === "select":
        return className;
      case ["checkbox", "radio"].includes(type):
        return className;
      case type === "file":
        return `file-input ${className}`;
      default:
        return `input ${className} ${errorClass}`;
    }
  };

  const getInputProps = (name: string, inputEl: ReactElement) => {
    return {
      value: applyFormat(name, input[name]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(name, e.target.value);
      },
      ...inputEl.props,
      className: getClassName(name, inputEl),
      name,
    };
  };

  const inputDecorator = (name: string, { label, ...options }: Options) => {
    if (inputMap.current) initialize(name, options);
    return (inputEl: ReactElement) => {
      const props = getInputProps(name, inputEl);
      return (
        <div className={"field rfd-" + name}>
          <InputGroup
            inputEl={React.cloneElement(inputEl, props)}
            label={label || ""}
            hasError={Boolean(error[name])}
          />
          {error[name] && <p className="help is-danger">{error[name]}</p>}
        </div>
      );
    };
  };

  const isFormValid = useMemo(() => {
    return Object.entries(input).every(
      ([name, value]) => !validateInput(name, value)
    );
  }, [formState]);

  return {
    formState,
    setFormState: (name: string, state: InputState) => {
      const newState = mergeState(name, state);
      setFormState(newState);
    },
    inputDecorator,
    isFormValid,
  };
}

export { useFormDecorator };

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
import { areEqual, isReactElement } from "./utils";
import debounce from "lodash.debounce";

const FORM_STATE = {
  input: {},
  initial: {},
  required: {},
  error: {},
  validate: {},
  format: {},
};

interface InputMap {
  [key: string]: InputState;
}

function useFormDecorator() {
  const [formState, setFormState] = useState(FORM_STATE);
  const { input, initial, required, error }: FormState = formState;
  const { validate, format } = formState;
  const inputMap: React.MutableRefObject<InputMap | null> = useRef({});
  const errorRef: React.MutableRefObject<string> = useRef("");
  const asyncValidator = useRef(
    debounce(({ name, formState, validateInput }) => {
      const { input, error } = formState;
      const result = validateInput(name, input[name]);
      Promise.resolve(result).then((value) => {
        setFormState({
          ...formState,
          error: { ...error, ...value, [name]: value[name] || "" },
        });
      });
    }, 400)
  );

  useEffect(() => {
    const state = Object.entries(inputMap.current || {}).reduce(
      (prev, [name, state]) => mergeState(name, state, prev),
      formState
    );
    setFormState(state);
    inputMap.current = null;
  }, []);

  useEffect(() => {
    if (errorRef.current) {
      const name = errorRef.current;
      asyncValidator.current({ name, formState, validateInput });
      errorRef.current = "";
    }
  }, [formState]);

  const _format = (name: string, value: string) => {
    if (typeof format[name] === "function") {
      return format[name](value);
    }
    return value;
  };

  const validateInput = (name: string, value: string) => {
    const hasValue = _format(name, value) !== _format(name, "");
    if (required[name] && !hasValue)
      return { [name]: "This field is required" };

    if (typeof validate[name] === "function")
      return validate[name](value, input);
    return {};
  };

  const mergeState = (name: string, state: InputState, form = formState) => {
    return Object.entries(state).reduce((prev, [key, value]) => {
      return df.updateByPath(prev, [key, name], () => value);
    }, form);
  };

  const handleChange = (name: string, value: string) => {
    const _input = _format(name, value);
    setFormState(mergeState(name, { input: _input }));
    errorRef.current = name;
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
      value: _format(name, input[name] as string),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(name, e.target.value);
      },
      ...inputEl.props,
      className: getClassName(name, inputEl),
      name,
    };
  };

  const _initial = ({ initial, format }: Options) => {
    if (typeof format === "function") return format(initial || "");
    return initial || "";
  };

  const inputDecorator = (name: string, { label, ...options }: Options) => {
    if (inputMap.current) {
      const initial = _initial(options);
      inputMap.current = {
        ...inputMap.current,
        [name]: { ...options, initial, input: initial },
      };
    }
    return (inputEl: ReactElement) => {
      const props = getInputProps(name, inputEl);
      if (isReactElement(inputEl)) {
        const _props = { ...props, error: error[name] };
        return React.cloneElement(inputEl, _props);
      }
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

  const validateForm = () => {
    return Object.keys(input)
      .reduce((prev, name) => {
        return prev.then((acc) => {
          const result = validateInput(name, input[name] as string);
          return Promise.resolve(result).then((err) => [
            ...acc,
            [name, err[name] || ""],
          ]);
        });
      }, Promise.resolve([]))
      .then((entries: string[][]) => {
        setFormState({
          ...formState,
          error: Object.fromEntries(entries),
        });
        const _error = entries.find(([_, err]) => err);
        if (_error) throw _error[1];
        return input;
      });
  };

  return {
    formState: { input, initial, required, error },
    setInputState: (name: string, state: InputState) => {
      const _state = mergeState(name, state);
      setFormState(_state);
    },
    inputDecorator,
    validateForm,
    isFormDirty: useMemo(() => !areEqual(input, initial), [input, initial]),
  };
}

export { useFormDecorator };

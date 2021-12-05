import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FormOptions,
  FormState,
  IFormState,
  InputProps,
  Options,
  PromiseOr,
  Validate,
  ValidState,
} from "./types";
import "./index.scss";
import {
  areEqual,
  classByStatus,
  mergeFormState,
  mergeInputState,
} from "./utils";
import { InputStatus } from "./enums";
import FormInput from "./components/form-input";
import FormField from "./components/form-field";
import debounce from "lodash.debounce";

const FORM_STATE = {
  input: {},
  initial: {},
  required: {},
  status: {},
  message: {},
  validate: {},
  format: {},
};

function useFormDecorator({
  messageOnEmpty = () => "This field is required",
  valueFromEvent = (_, e: any) => e.target.value,
  customDecorator,
}: FormOptions = {}) {
  const [formState, setFormState] = useState(FORM_STATE as IFormState);
  const { input, initial, required, status, message } = formState;
  const stateRef = useRef(formState);
  const [validState, setValidState] = useState({} as ValidState);
  const counter = useRef(0);

  const validator = useRef(
    debounce((name, action, value) => {
      setValidState({ name, action, value });
    }, 200)
  );

  useEffect(() => {
    if (!counter.current) {
      setFormState(stateRef.current);
    }
    counter.current++;
  }, [formState]);

  useEffect(() => {
    const { name, action, value } = validState;
    switch (action) {
      case "validate":
        const result = validateInput(name, input[name]);
        validator.current(name, "resolve", result);
        break;
      case "resolve":
        Promise.resolve(value).then(([sts, msg, state]) => {
          const { status, message } = formState;
          setFormState(
            mergeFormState(state || {}, {
              ...formState,
              status: { ...status, [name]: sts || "" },
              message: { ...message, [name]: msg || "" },
            })
          );
        });
    }
  }, [validState]);

  const applyFormat = (name: string, value: string = "") => {
    const { format } = stateRef.current;
    if (format[name]) {
      return format[name]?.(value) as string;
    }
    return value;
  };

  const validateInput = (
    name: string,
    value: string = ""
  ): PromiseOr<Validate> => {
    const { validate } = stateRef.current;
    const isEmpty = applyFormat(name, value) === applyFormat(name, "");
    if (required[name] && isEmpty) {
      return [InputStatus.error, messageOnEmpty(name)];
    }
    return validate[name]?.(value) || [];
  };

  const handleChange = (name: string, value: string) => {
    const input = applyFormat(name, value);
    setFormState(mergeInputState(name, { input }, formState));
    validator.current(name, "validate", []);
  };

  const getInputProps = (name: string) => {
    return {
      value: applyFormat(name, input[name]),
      onChange: (event: unknown) => {
        handleChange(name, valueFromEvent(name, event));
      },
    };
  };

  const formatInitial = ({ initial = "", format }: Options) => {
    return format ? format(initial) : initial;
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
      if (customDecorator) {
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
            className={classByStatus(status[name] || "")}
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

  return useMemo(
    () => ({
      formState: { input, initial, required, status, message },
      setFormState: (state: FormState) => {
        setFormState(
          counter.current > 1
            ? mergeFormState(state, formState)
            : mergeFormState(state, stateRef.current)
        );
      },
      inputDecorator,
      validateForm,
      isFormDirty: () => !areEqual(input, initial),
    }),
    [formState]
  );
}

export { useFormDecorator };

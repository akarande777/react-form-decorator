import React, {
  FormHTMLAttributes,
  forwardRef,
  MutableRefObject,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import FormContext from "../context";
import {
  FormInstance,
  FormState,
  IFormState,
  InputDecProps,
  InputMap,
  InputState,
  PromiseOr,
  Validate,
} from "../types";
import { mergeInputMap, mergeInputState } from "../utils";
import { InputStatus } from "../enums";
import useValidator from "../hooks/useValidator";

const FORM_STATE = {
  input: {},
  initial: {},
  required: {},
  status: {},
  message: {},
  validate: {},
  format: {},
  trigger: {},
};

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  messageOnEmpty?: (name: string) => string;
  validateTrigger?: (name: string) => "onChange" | "onBlur" | "onSubmit";
  valueFromEvent?: (name: string, event: unknown) => any;
  inputDecorator?: (name: string, props: InputDecProps) => ReactElement;
}

function Form(
  {
    messageOnEmpty = () => "This field is required",
    valueFromEvent = (_, e: any) => e.target.value,
    inputDecorator,
    validateTrigger = () => "onChange",
    className,
    children,
    ...otherProps
  }: FormProps,
  formRef: MutableRefObject<FormInstance | undefined>
) {
  const [formState, setFormState] = useState(FORM_STATE as IFormState);
  const { input, required, status, message } = formState;
  const stateRef = useRef(formState);
  const counter = useRef(0);

  useEffect(() => {
    if (!counter.current) {
      setFormState(stateRef.current);
    }
    counter.current++;
  }, [formState]);

  const applyFormat = (name: string, value: any = "") => {
    const { format } = stateRef.current;
    if (format[name]) {
      return format[name]?.(value);
    }
    return value;
  };

  const validateInput = (
    name: string,
    value: any = ""
  ): PromiseOr<Validate> => {
    const { validate } = stateRef.current;
    const isEmpty = applyFormat(name, value) === applyFormat(name, "");
    if (required[name] && isEmpty) {
      return [InputStatus.error, messageOnEmpty(name)];
    }
    return validate[name]?.(value) || [];
  };

  const validateAsync = useValidator({
    formState,
    setFormState,
    validateInput,
  });

  const handleChange = (name: string, value: string) => {
    const validate = validateTrigger(name) === "onChange";
    const state = {
      input: applyFormat(name, value),
      status: validate ? InputStatus.validating : status[name],
    };
    setFormState(mergeInputState(name, state, formState));
    if (validate) validateAsync(name);
  };

  const getInputProps = (name: string) => ({
    name,
    value: applyFormat(name, input[name]),
    onChange: (event: unknown) => {
      handleChange(name, valueFromEvent(name, event));
    },
    onBlur: () => {
      if (validateTrigger(name) === "onBlur") validateAsync(name);
    },
  });

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

  const memoizedContext = useMemo(
    () => ({ stateRef, formState, getInputProps, inputDecorator }),
    [formState]
  );

  useImperativeHandle(
    formRef,
    () => ({
      formState: { input, required, status, message } as FormState,
      setInputState: (state: InputMap<InputState>) => {
        setFormState(
          counter.current > 1
            ? mergeInputMap(state, formState)
            : mergeInputMap(state, stateRef.current)
        );
      },
      validateForm,
    }),
    [formState]
  );

  return (
    <FormContext.Provider value={memoizedContext}>
      <form className={"box " + className} {...otherProps}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export default forwardRef(Form);

import React, { ReactElement, ReactNode, useContext } from "react";
import FormContext from "../context";
import { InputStatus } from "../enums";
import { InputProps, Options } from "../types";
import { classByStatus, mergeInputState } from "../utils";
import FormInput from "./FormInput";

interface FormFieldProps extends Options {
  name: string;
  addons?: [ReactElement | null, ReactElement | null];
  className?: string;
  children: (props: InputProps) => ReactElement;
}

export default function FormField({
  name,
  addons,
  className,
  children,
  ...options
}: FormFieldProps) {
  const { stateRef, formState, getInputProps, inputDecorator } =
    useContext(FormContext);
  const { initial = "", format } = options;
  const input = format ? format(initial) : initial;
  const state = { ...options, initial: input, input };
  stateRef.current = mergeInputState(name, state, stateRef.current);

  const props = { name, ...getInputProps(name) };
  const inputEl = children(props);
  const { status, message } = formState;
  if (inputDecorator) {
    return inputDecorator(name, {
      inputEl,
      status: status[name],
      message: message[name],
    });
  }

  return (
    <FieldView
      className={`rfd-${name} ${className || ""}`}
      hasAddons={Boolean(addons)}
      status={status[name] || ""}
      message={message[name] || ""}
    >
      {addons && addons[0]}
      <FormInput
        inputEl={inputEl}
        className={classByStatus(status[name] || "")}
      />
      {addons && addons[1]}
    </FieldView>
  );
}

interface FieldViewProps {
  className: string;
  hasAddons: boolean;
  status: string;
  message: string;
  children: ReactNode;
}

function FieldView({
  className,
  hasAddons,
  status,
  message,
  children,
}: FieldViewProps) {
  return (
    <div className={"field " + className}>
      <div className={`field mb-0 ${hasAddons ? "has-addons" : ""}`}>
        {children}
      </div>
      {status && status !== InputStatus.validating && (
        <p className={"help " + classByStatus(status)}>{message}</p>
      )}
    </div>
  );
}

import React, { ReactElement } from "react";

interface InputProps {
  inputEl: ReactElement;
  className: string;
}

function FormInput({ inputEl, className }: InputProps) {
  if (inputEl.type === "select") {
    return (
      <div className="control">
        <div className={"select " + className}>{inputEl}</div>
      </div>
    );
  }
  return (
    <div className="control">
      {React.cloneElement(inputEl, {
        className: `input ${className} ${inputEl.props.className || ""}`,
      })}
    </div>
  );
}

export default FormInput;

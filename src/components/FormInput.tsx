import React, { ReactElement } from "react";

interface InputProps {
  inputEl: ReactElement;
  className: string;
}

function FormInput({ inputEl, className }: InputProps) {
  if (inputEl.type === "select")
    return (
      <div className="control">
        <div className={"select " + className}>{inputEl}</div>
      </div>
    );

  const withClass = (clsname: string) => {
    const { className } = inputEl.props;
    return React.cloneElement(inputEl, {
      className: `${clsname} ${className || ""}`,
    });
  };

  switch (inputEl.props.type) {
    case "checkbox":
      return (
        <div className="control">
          <label className="checkbox">{inputEl}</label>
        </div>
      );
    case "radio":
      return (
        <div className="control">
          <label className="radio">{inputEl}</label>
        </div>
      );
    case "file":
      return <div className="file">{withClass("file-input")}</div>;
    default:
      return <div className="control">{withClass(`input ${className}`)}</div>;
  }
}

export default FormInput;

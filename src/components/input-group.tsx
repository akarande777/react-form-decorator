import React, { ReactElement, Fragment } from "react";

interface InputProps {
  inputEl: ReactElement;
  label: string;
  hasError: boolean;
}

function InputGroup({ inputEl, label, hasError }: InputProps) {
  const { type } = inputEl.props;
  const errorClass = hasError ? "is-danger" : "";

  if (inputEl.type === "select") {
    return (
      <Fragment>
        <label className="label">{label}</label>
        <div className="control">
          <div className={"select " + errorClass}>{inputEl}</div>
        </div>
      </Fragment>
    );
  }

  switch (type) {
    case "checkbox":
      return (
        <div className="control">
          <label className="checkbox">
            {inputEl} {label}
          </label>
        </div>
      );
    case "radio":
      return (
        <div className="control">
          <label className="radio">
            {inputEl} {label}
          </label>
        </div>
      );
    case "file":
      return (
        <div className="file">
          <label className="file-label">
            {inputEl}
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload" />
              </span>
              <span className="file-label">{label}</span>
            </span>
          </label>
        </div>
      );
    default:
      return (
        <Fragment>
          <label className="label">{label}</label>
          <div className="control">{inputEl}</div>
        </Fragment>
      );
  }
}

export default InputGroup;

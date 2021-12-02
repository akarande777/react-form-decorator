import React, { ReactElement, Fragment } from "react";

interface InputProps {
  inputEl: ReactElement;
  label: string;
  status: string;
}

function InputGroup({ inputEl, label, status }: InputProps) {
  const statusClass = "is-" + status;

  if (inputEl.type === "select")
    return (
      <Fragment>
        <label className="label">{label}</label>
        <div className="control">
          <div className={"select " + statusClass}>{inputEl}</div>
        </div>
      </Fragment>
    );

  const withClassName = (_class: string) => {
    const { className = "" } = inputEl.props;
    return React.cloneElement(inputEl, {
      className: `${_class} ${className}`,
    });
  };

  switch (inputEl.props.type) {
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
            {withClassName("file-input")}
            <span className="file-cta">
              <span className="file-label">{label}</span>
            </span>
          </label>
        </div>
      );
    default:
      return (
        <Fragment>
          <label className="label">{label}</label>
          <div className="control">{withClassName(`input ${statusClass}`)}</div>
        </Fragment>
      );
  }
}

export default InputGroup;

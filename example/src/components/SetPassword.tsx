import React from "react";

import { useFormDecorator } from "react-form-decorator";

const SetPassword = () => {
  const { decorate, formState, isFormValid } = useFormDecorator();
  const { input, message } = formState;

  const handleSubmit = () => {
    console.log("handleSubmit", input);
  };

  const passwordInput = decorate(
    <input type="password" placeholder="New Password" />
  );
  const confirmInput = decorate(
    <input type="password" placeholder="Confirm Password" />
  );

  return (
    <div className="form">
      <h4>Set Password</h4>
      <div className="form-input">
        {passwordInput("password", { required: true })}
        <span className="error">{message["password"]}</span>
      </div>
      <div className="form-input">
        {confirmInput("confirm", {
          required: true,
          validate: (value, { input }) => {
            // these functions should pure
            // avoid use of variables from outer scope
            if (value !== input.password) {
              return "Passwords do not match";
            }
            return "";
          },
        })}
        <span className="error">{message["confirm"]}</span>
      </div>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Set Password
      </button>
    </div>
  );
};

export default SetPassword;

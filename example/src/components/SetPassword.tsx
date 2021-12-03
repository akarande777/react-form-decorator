import React from "react";

import { useFormDecorator } from "react-form-decorator";

const SetPassword = () => {
  const { inputDecorator, validateForm, formState } = useFormDecorator();
  const { input } = formState;

  const handleSubmit = () => {
    validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <div className="box">
      {inputDecorator("password", { required: true })((props) => (
        <input type="password" placeholder="New Password" {...props} />
      ))}
      {inputDecorator("confirm", {
        required: true,
        validate: (value) => {
          if (value !== input.password) {
            return ["error", "Passwords do not match"];
          }
          return [];
        },
      })((props) => (
        <input type="password" placeholder="Confirm Password" {...props} />
      ))}
      <button className="button" onClick={handleSubmit}>
        Set Password
      </button>
    </div>
  );
};

export default SetPassword;

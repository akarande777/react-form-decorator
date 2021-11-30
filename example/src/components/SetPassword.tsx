import React from "react";

import { useFormDecorator } from "react-form-decorator";

const SetPassword = () => {
  const { inputDecorator, validateForm } = useFormDecorator();

  const handleSubmit = () => {
    validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  const password = inputDecorator("password", { required: true });
  const confirm = inputDecorator("confirm", {
    required: true,
    validate: (value, input) => {
      // these functions should be pure
      // avoid use of variables from outer scope
      if (value !== input.password) {
        return { confirm: "Passwords do not match" };
      }
      return {};
    },
  });

  return (
    <div className="box">
      {password(<input type="password" placeholder="New Password" />)}
      {confirm(<input type="password" placeholder="Confirm Password" />)}
      <button className="button" onClick={handleSubmit}>
        Set Password
      </button>
    </div>
  );
};

export default SetPassword;

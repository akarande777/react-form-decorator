import React, { FormEvent, useRef } from "react";

import { Form, FormField } from "react-form-decorator";
import { FormInstance } from "react-form-decorator/dist/types";

const SetPassword = () => {
  const formRef = useRef<FormInstance>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formRef.current!.validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <FormField name="password" required>
        {(props) => (
          <input type="password" placeholder="New Password" {...props} />
        )}
      </FormField>
      <FormField
        name="confirm"
        required
        validate={(value) => {
          const { input } = formRef.current!.formState;
          if (value !== input.password) {
            return ["error", "Passwords do not match"];
          }
          return [];
        }}
      >
        {(props) => (
          <input type="password" placeholder="Confirm Password" {...props} />
        )}
      </FormField>
      <button className="button" type="submit">
        Set Password
      </button>
    </Form>
  );
};

export default SetPassword;

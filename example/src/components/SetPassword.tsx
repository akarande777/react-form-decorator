import React, { useRef } from "react";

import { Form, FormField } from "react-form-decorator";

const SetPassword = () => {
  const formRef = useRef<any>({});

  const handleSubmit = () => {
    formRef.current.validateForm().then((values: any) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <Form ref={formRef}>
      <FormField name="password" required>
        {(props) => (
          <input type="password" placeholder="New Password" {...props} />
        )}
      </FormField>
      <FormField
        name="confirm"
        required
        validate={(value) => {
          const { input } = formRef.current.getFormState();
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
      <button className="button" onClick={handleSubmit}>
        Set Password
      </button>
    </Form>
  );
};

export default SetPassword;

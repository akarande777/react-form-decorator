import React, { FormEvent, useRef } from "react";

import { Form, FormField } from "react-form-decorator";
import { FormInstance } from "react-form-decorator/dist/types";

const GiftCard = () => {
  const formRef = useRef<FormInstance>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formRef.current!.validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <FormField
        name="amount"
        required={true}
        addons={[
          <div className="control">
            <button className="button">$</button>
          </div>,
          null,
        ]}
      >
        {(props) => <input type="number" min="1" {...props} />}
      </FormField>
      <FormField name="quantity" initial="1">
        {(props) => (
          <select {...props}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        )}
      </FormField>
      <button className="button" type="submit">
        Add Gift Card
      </button>
    </Form>
  );
};

export default GiftCard;

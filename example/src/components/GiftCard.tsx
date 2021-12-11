import React, { useRef } from "react";

import { Form, FormField } from "react-form-decorator";

const GiftCard = () => {
  const formRef = useRef<any>({});

  const handleSubmit = () => {
    formRef.current.validateForm().then((values: any) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <Form ref={formRef}>
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
      <button className="button" onClick={handleSubmit}>
        Add Gift Card
      </button>
    </Form>
  );
};

export default GiftCard;

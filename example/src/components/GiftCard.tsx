import React from "react";

import { useFormDecorator } from "react-form-decorator";

const GiftCard = () => {
  const { inputDecorator, validateForm } = useFormDecorator();

  const handleSubmit = () => {
    validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <div className="box">
      {inputDecorator("amount", {
        required: true,
        format: (value) => "$" + value.slice(1).trim(),
        validate: (value) => {
          let amount = Number(value.slice(1));
          if (isNaN(amount)) {
            return { amount: "Please enter valid amount" };
          }
          return {};
        },
      })(<input />)}
      {inputDecorator("quatity", { initial: "1" })(
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      )}
      <button className="button" onClick={handleSubmit}>
        Add Gift Card
      </button>
    </div>
  );
};

export default GiftCard;

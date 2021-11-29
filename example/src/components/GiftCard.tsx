import React from "react";

import { useFormDecorator } from "react-form-decorator";

const GiftCard = () => {
  const { inputDecorator, formState, isFormValid } = useFormDecorator();
  const { input } = formState;

  const handleSubmit = () => {
    console.log("handleSubmit", input);
  };

  return (
    <div className="box">
      {inputDecorator("amount", {
        required: true,
        format: (value) => "$" + value.slice(1).trim(),
        validate: (value) => {
          let amount = Number(value.slice(1));
          if (isNaN(amount)) {
            return "Please enter valid amount";
          }
          return "";
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
      <button className="button" onClick={handleSubmit} disabled={!isFormValid}>
        Add Gift Card
      </button>
    </div>
  );
};

export default GiftCard;

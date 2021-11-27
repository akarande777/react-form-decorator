import React from "react";

import { useFormDecorator } from "react-form-decorator";

const GiftCard = () => {
  const { decorate, formState, isFormValid } = useFormDecorator();
  const { input, message } = formState;

  const handleSubmit = () => {
    console.log("handleSubmit", input);
  };

  const dropdown = (
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
  );

  return (
    <div className="form">
      <h4>Gift Card</h4>
      <div className="form-input">
        {decorate(<input />)("amount", {
          required: true,
          format: (value) => "$" + value.slice(1).trim(),
          validate: (value) => {
            let amount = Number(value.slice(1));
            if (isNaN(amount)) {
              return "Please enter valid amount";
            }
            return "";
          },
        })}
        <span className="error">{message["amount"]}</span>
      </div>
      <div className="form-input">
        {decorate(dropdown)("quatity", { required: true, initial: "1" })}

        <span className="error">{message["quantity"]}</span>
      </div>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Create
      </button>
    </div>
  );
};

export default GiftCard;

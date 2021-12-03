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
        validate: (value) => {
          if (isNaN(Number(value))) {
            return ["error", "Please enter valid amount"];
          }
          return [];
        },
        addons: [
          <div className="control">
            <button className="button">$</button>
          </div>,
          null,
        ],
      })((props) => (
        <input {...props} />
      ))}
      {inputDecorator("quantity", { initial: "1" })((props) => (
        <select {...props}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      ))}
      <button className="button" onClick={handleSubmit}>
        Add Gift Card
      </button>
    </div>
  );
};

export default GiftCard;

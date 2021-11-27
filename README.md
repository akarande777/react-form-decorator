# react-form-decorator

> A lightweight react library for creating controlled form component.

[![NPM](https://img.shields.io/npm/v/react-form-decorator.svg)](https://www.npmjs.com/package/react-form-decorator)
[![Build Status](https://travis-ci.com/akarande777/react-form-decorator.svg?branch=master)](https://travis-ci.com/akarande777/react-form-decorator)
[![Known Vulnerabilities](https://snyk.io/test/npm/react-form-decorator/badge.svg)](https://snyk.io/test/npm/react-form-decorator)
[![npm downloads/month](https://img.shields.io/npm/dm/react-form-decorator)](https://www.npmjs.com/package/react-form-decorator)

## Install

```bash
npm install --save react-form-decorator
```

## Examples

```tsx
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
        <span className="error">{message["amount"]}</span>
      </div>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Create
      </button>
    </div>
  );
};
```

```tsx
import React from "react";
import { useFormDecorator } from "react-form-decorator";

const SetPassword = () => {
  const { decorate, formState, isFormValid } = useFormDecorator();
  const { input, message } = formState;

  const handleSubmit = () => {
    console.log("handleSubmit", input);
  };

  const passwordInput = decorate(
    <input type="password" placeholder="New Password" />
  );
  const confirmInput = decorate(
    <input type="password" placeholder="Confirm Password" />
  );

  return (
    <div className="form">
      <h4>Set Password</h4>
      <div className="form-input">
        {passwordInput("password", { required: true })}
        <span className="error">{message["password"]}</span>
      </div>
      <div className="form-input">
        {confirmInput("confirm", {
          required: true,
          validate: (value, { input }) => {
            // these functions should be pure
            // avoid use of variables from outer scope
            if (value !== input.password) {
              return "Passwords do not match";
            }
            return "";
          },
        })}
        <span className="error">{message["confirm"]}</span>
      </div>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Set Password
      </button>
    </div>
  );
};
```

> NOTE: This library does not provide styling.

## License

MIT © [akarande777](https://github.com/akarande777)

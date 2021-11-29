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

## Usage

```tsx
import React from "react";
import { useFormDecorator } from "react-form-decorator";
import "react-form-decorator/dist/index.css";
```

```tsx
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
```

```tsx
const SetPassword = () => {
  const { inputDecorator, formState, isFormValid } = useFormDecorator();
  const { input } = formState;

  const handleSubmit = () => {
    console.log("handleSubmit", input);
  };

  const password = inputDecorator("password", { required: true });
  const confirm = inputDecorator("confirm", {
    required: true,
    validate: (value, { input }) => {
      // these functions should be pure
      // avoid use of variables from outer scope
      if (value !== input.password) {
        return "Passwords do not match";
      }
      return "";
    },
  });

  return (
    <div className="box">
      {password(<input type="password" placeholder="New Password" />)}
      {confirm(<input type="password" placeholder="Confirm Password" />)}
      <button className="button" onClick={handleSubmit} disabled={!isFormValid}>
        Set Password
      </button>
    </div>
  );
};
```

## License

MIT © [akarande777](https://github.com/akarande777)

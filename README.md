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
```

```tsx
const SetPassword = () => {
  const { inputDecorator, validateForm, formState } = useFormDecorator();
  const { input } = formState;

  const handleSubmit = () => {
    validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <div className="box">
      {inputDecorator("password", { required: true })((props) => (
        <input type="password" placeholder="New Password" {...props} />
      ))}
      {inputDecorator("confirm", {
        required: true,
        validate: (value) => {
          if (value !== input.password) {
            return ["error", "Passwords do not match"];
          }
          return [];
        },
      })((props) => (
        <input type="password" placeholder="Confirm Password" {...props} />
      ))}
      <button className="button" onClick={handleSubmit}>
        Set Password
      </button>
    </div>
  );
};
```

## License

MIT © [akarande777](https://github.com/akarande777)

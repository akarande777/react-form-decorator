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
import { FormInstance } from "react-form-decorator/dist/types";
import "react-form-decorator/dist/index.css";
```

```tsx
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
```

```tsx
const SetPassword = () => {
  const formRef = useRef<FormInstance>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formRef.current!.validateForm().then((values) => {
      console.log("handleSubmit", values);
    });
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <FormField name="password" required>
        {(props) => (
          <input type="password" placeholder="New Password" {...props} />
        )}
      </FormField>
      <FormField
        name="confirm"
        required
        validate={(value) => {
          const { input } = formRef.current!.formState;
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
      <button className="button" type="submit">
        Set Password
      </button>
    </Form>
  );
};
```

## License

MIT © [akarande777](https://github.com/akarande777)

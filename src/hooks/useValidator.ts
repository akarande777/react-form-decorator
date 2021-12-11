import { useEffect, useRef, useState } from "react";
import { IValidate } from "../types";
import { mergeInputMap } from "../utils";
import debounce from "lodash.debounce";

function useValidator({ formState, setFormState, validateInput }: any) {
  const [state, setState] = useState({} as IValidate);

  const validator = useRef(
    debounce((name, action, value) => {
      setState({ name, action, value });
    }, 200)
  );

  useEffect(() => {
    const { name, action, value } = state;
    switch (action) {
      case "validate":
        const { input } = formState;
        const result = validateInput(name, input[name]);
        validator.current(name, "resolve", result);
        break;
      case "resolve":
        Promise.resolve(value).then(([sts, msg, map]) => {
          const { status, message } = formState;
          setFormState(
            mergeInputMap(map || {}, {
              ...formState,
              status: { ...status, [name]: sts || "" },
              message: { ...message, [name]: msg || "" },
            })
          );
        });
    }
  }, [state]);

  return (name: string) => {
    validator.current(name, "validate", []);
  };
}

export default useValidator;

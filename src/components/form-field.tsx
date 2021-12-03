import React, { ReactNode } from "react";
import { classByStatus } from "../utils";

interface InputProps {
  className: string;
  status: string;
  message: string;
  children?: ReactNode;
}

function FormField({ className, status, message, children }: InputProps) {
  return (
    <div className="field">
      <div className={"field mb-0 " + className}>{children}</div>
      {status && <p className={"help " + classByStatus(status)}>{message}</p>}
    </div>
  );
}

export default FormField;

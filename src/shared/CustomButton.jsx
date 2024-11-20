import React from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";

export default function CustomButton({
  label = "Submit",
  extraClassNames,
  ...props
}) {
  return (
    <Button
      className={`primary-button align-center mx-2 ${extraClassNames}`}
      label={label}
      style={{ alignSelf: "center" }}
      size="small"
      {...props}
    />
  );
}

export function CustomButtonOutlined({ label = "Submit", ...props }) {
  const isRefreshButton = label === "Refresh";
  return (
    <Button
      className={`align-center mx-2 ${isRefreshButton ? 'refresh-button' : ''}`}
      label={label}
      style={{ alignSelf: "center" }}
      outlined={!isRefreshButton}
      size="small"
      {...props}
    />
  );
}

export function CustomSplitButton({ label = "Submit", ...props }) {
  return (
    <SplitButton
      className="align-center mx-2"
      label={label}
      outlined
      size="small"
      {...props}
    />
  );
}

export function Buttonlayout({ className, position = "end", children }) {
  return (
    <div className={`flex my-2 justify-content-${position} ${className}`}>
      {children}
    </div>
  );
}

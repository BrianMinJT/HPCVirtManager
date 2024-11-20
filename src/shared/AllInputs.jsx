import React, { useEffect, useState } from "react";
import InputLayout from "./InputLayout";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { capitalizeCamelCase } from "../utils/commonFunctions";
import { Button } from "primereact/button";

export const CustomInput = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <InputText
        id={name}
        name={name}
        value={value || data?.[name] || ""}
        type={type}
        onChange={(e) =>
          onChange &&
          onChange({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`input w-full ${inputClass ? inputClass : ""} ${
          errorMessage ? "p-invalid" : ""
        }`}
        placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
};
export const CustomPassword = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 12,
  inputClass,
  disabled = false,
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <Password
        id={name}
        name={name}
        value={value || data?.[name] || ""}
        onChange={(e) =>
          onChange &&
          onChange({ ...e, name: e.target.name, value: e.target.value })
        }
        className={` ${inputClass ? inputClass : ""} ${
          errorMessage ? "p-invalid" : ""
        }`}
        disabled={disabled}
        feedback={false}
        toggleMask
        placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
        {...props}
      />
    </InputLayout>
  );
};
export const CustomDropDown = ({
  label,
  name,
  onChange,
  data,
  value,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  optionLabel = "name",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <Dropdown
        id={name}
        name={name}
        value={value || data?.[name]}
        onChange={(e) =>
          onChange && onChange({ ...e, name: e.target.name, value: e.value })
        }
        className={`w-full custom-dropdown ${errorMessage ? "p-invalid" : ""}`}
        optionLabel={optionLabel}
        placeholder={placeholder || `Select ${capitalizeCamelCase(name)}`}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomCalander = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <div className="calendar-box">
        <Calendar
          id={name}
          name={name}
          value={value || data?.[name] || ""}
          onChange={(e) => onChange && onChange({ ...e, name, value: e.value })}
          className={`w-full ${inputClass ? inputClass : ""}`}
          disabled={disabled}
          placeholder={placeholder || `Select ${capitalizeCamelCase(name)}`}
          {...props}
        />
        <i className="pi pi-calendar" />
      </div>
    </InputLayout>
  );
};

export const CustomCheckbox = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col,
  inputClass,
  template,
  ...props
}) => {
  return (
    <InputLayout
      col={col || 6}
      name=""
      extraClassName={extraClassName}
      errorMessage={data?.formErrors?.[name]}
    >
      <Checkbox
        id={name}
        name={name}
        inputId={label}
        checked={value || data?.[name]}
        onChange={(e) =>
          onChange && onChange({ ...e, name: e.target.name, value: e.checked })
        }
        className={`checkbox ${inputClass ? inputClass : ""} ${
          errorMessage ? "p-invalid" : ""
        }`}
        {...props}
      />

      {label && (
        <label htmlFor={label} className="ml-2">
          {label}
        </label>
      )}

      {template && <>{template}</>}
    </InputLayout>
  );
};
export const CustomSwitch = ({
  label,
  name,
  data,
  value,
  onChange,
  col = 6,
  ...props
}) => {
  return (
    <InputLayout col={col} name="">
      <div className="flex">
        <InputSwitch
          checked={value || data?.[name]}
          onChange={(e) => onChange && onChange({ ...e, name, value: e.value })}
          {...props}
        />
        <div htmlFor={label} className="ml-2 my-auto">
          {label ? capitalizeCamelCase(label) : label}
        </div>
      </div>
    </InputLayout>
  );
};

export const CustomMemoryInput = ({
  label,
  name,
  data,
  value,
  onChange,

  typeValue,
  typeName,
  onTypeChange,

  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <div className="p-inputgroup flex-1">
        <InputText
          id={name}
          name={name}
          value={value || data?.[name] || ""}
          type={type}
          onChange={(e) =>
            onChange &&
            onChange({ ...e, name: e.target.name, value: e.target.value })
          }
          className={`input w-full ${inputClass ? inputClass : ""} ${
            errorMessage ? "p-invalid" : ""
          }`}
          placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
          disabled={disabled}
          {...props}
        />
        <Dropdown
          id={typeName}
          name={typeName}
          value={typeValue || data?.[typeName]}
          onChange={(e) =>
            onTypeChange &&
            onTypeChange({ ...e, name: e.target.name, value: e.value })
          }
          className="custom-dropdown w-3"
          options={["Pi", "Ti", "Gi", "Mi"]}
        />
      </div>
    </InputLayout>
  );
};

export const CustomPasswordInput = ({
  label,
  name,
  data,
  value,
  onChange,

  typeValue,
  typeName,
  onTypeChange,

  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
 
  const generatePassword = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    
    return password;
  };
  const handleGeneratePassword = () => {
    const newPassword = generatePassword(10); // Generates a password of 10 characters
    onChange({ ...data, name: "password", value: newPassword })
  };
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <div className="p-inputgroup flex-1">
        <InputText
          id={name}
          name={name}
          value={value || data?.[name] || "" }
          type={type}
          onChange={(e) =>
            onChange &&
            onChange({ ...e, name: e.target.name, value: e.target.value })
          }
          className={`input w-full ${inputClass ? inputClass : ""} ${
            errorMessage ? "p-invalid" : ""
          }`}
          placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
          disabled={disabled}
          {...props}
        />
        <Button
         className="primary-button"
         onClick={handleGeneratePassword}
        >Generate</Button>
      </div>
    </InputLayout>
  );
};

//New
export const CustomSearch = ({ value = "", onChange, placeholder = "Search" }) => {
  const [search, setSearch] = useState(value);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <InputText
      className="p-inputtext-sm surface-200"
      style={{ width: '200px' }}
      value={search}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export const CustomForm = ({ children, title }) => {
  return (
    <form className="grid m-0 p-0">
      {title ? <div className="col-12 title my-auto">{title}</div> : null}
      {children}
    </form>
  );
};

export const CustomField = ({ label, name, data, value }) => {
  return (
    <div className="input-layout col-12 grid">
      <label htmlFor={name} className="text-sm font-semibold col-3">
        <div>{label ? label : capitalizeCamelCase(name)}</div>
      </label>
      <div className="col-9  overflow-x-auto">
        {value || data?.[name] || "-"}
      </div>
    </div>
  );
};

import React from "react";
import CustomButton, { CustomButtonOutlined } from "./CustomButton";
import { CustomSearch } from "./AllInputs";

export default function Page({
  title,
  description,
  children,
  search = "",
  onSearch,
  onRefresh,
  onAdd,
  addText = "Add",
  headers,
  titleAction,
}) {
  return (
    <div className="page">
      <div className="mb-4">
        <div className="flex justify-content-between align-items-center flex-wrap">
          <div className="flex-column">
            {title && <div className="page-title">{title}</div>}
            {description && <div className="page-description">{description}</div>}
          </div>
          <div className="flex align-items-center gap-2">
            {(search || onSearch) && (
              <CustomSearch
                value={search}
                onChange={onSearch}
                placeholder="Search"
              />
            )}
            {titleAction}
            {onAdd && (
              <CustomButton label={addText} icon="pi pi-plus" onClick={onAdd} />
            )}
            {onRefresh && (
              <CustomButtonOutlined
                label="Refresh"
                severity="secondary"
                icon="pi pi-sync"
                onClick={onRefresh}
              />
            )}
          </div>
        </div>
        {headers}
      </div>
      {children}
    </div>
  );
}

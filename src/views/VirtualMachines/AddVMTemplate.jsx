import React from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";

const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "Templates", url: "/#/virtual-machines/templates" },
  { label: "New Template", url: "/#/virtual-machines/templates/add" },
];

export default function AddVMTemplate() {
  return (
    <Page
      title="New VM Template"
      breadcrumb={<CustomBreadcrum items={breadcrumItems} />}
    >
      <div className="card">
        <div className="text-lg">Coming Soon</div>
        <p className="text-color-secondary mt-2">
          VM Template creation functionality will be available soon.
        </p>
      </div>
    </Page>
  );
}

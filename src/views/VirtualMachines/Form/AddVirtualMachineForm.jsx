import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNamespacesAction,
  getNodesAction,
  getPriorityClassAction,
} from "../../../store/actions/projectActions";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import Grid, { Col } from "../../../shared/Grid";
import BasicDetails from "./BasicDetails";
import Network from "./Network";
import Storage from "./Storage";
import Review from "./Review";
import UserData from "./UserData";
import { onAddVMAction } from "../../../store/actions/vmActions";
import { showFormErrors } from "../../../utils/commonFunctions";
import formValidation from "../../../utils/validations";
import {
  getDisksAction,
  getStorageClassesAction,
} from "../../../store/actions/storageActions";
import TemplateSelectionModal from './TemplateSelectionModal';
import "./AddVirtualMachineForm.scss";

export default function AddVirtualMachineForm({ onClose }) {
  const dispatch = useDispatch();
  const { priorityClassesDropdown, images } = useSelector(
    (state) => state.project
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    dispatch(getNamespacesAction());
    dispatch(getNodesAction());
    dispatch(getStorageClassesAction());
    dispatch(getPriorityClassAction());
    dispatch(getDisksAction());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTemplateModalOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const [data, setData] = useState({
    node: "",
    name: "",
    namespace: "",
    sockets: "",
    cores: "",
    threads: "",
    memory: "",
    memoryType: "Gi",
    priorityClass: "",
    storage1: "",
    networkType: "podNetwork",
    bindingMode: "bridge",
    advanced: "",
    userName: "",
    password: "",
  });

  const [disks, setDisks] = useState([
    {
      createType: "new",
      diskType: "disk",
      busType: "",
      memoryType: "Gi",
      size: "",
      storageClass: "",
      accessMode: "",
      image: "",
      disk: "",
      type: "blank",
      url: "",
      cache: "",
    },
  ]);

  useEffect(() => {
    if (priorityClassesDropdown.length) {
      setData((prev) => ({
        ...prev,
        priorityClass: priorityClassesDropdown[0],
      }));
    }
  }, [priorityClassesDropdown]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onAddVM = () => {
    if (showFormErrors(data, setData)) {
      if (validateDisk()) {
        setLoading(true);
        dispatch(
          onAddVMAction(data, disks, images, setLoading, () => {
            setLoading(false);
            if (onClose) {
              onClose();
            }
          })
        );
      } else {
        setActiveIndex(1);
      }
    } else {
      setActiveIndex(0);
    }
  };

  const validateStep = (index) => {
    switch (index) {
      case 0:
        return showFormErrors(data, setData, ["userName", "password"]);
      case 1:
        return validateDisk();
      case 2:
        return true;
      case 3:
        return showFormErrors(data, setData);
      default:
        return true;
    }
  };

  const onStepChange = (index) => {
    if (index > activeIndex) {
      // Moving forward
      if (validateStep(activeIndex)) {
        setCompletedSteps((prev) => [...new Set([...prev, activeIndex])]);
        setActiveIndex(index);
      }
    } else {
      // Moving backward
      setActiveIndex(index);
    }
  };

  const validateDisk = () => {
    return disks.every((disk, i) => {
      let ignore = ["disk", "url", "image"];
      
      if (disk?.createType === "existing") {
        ignore = ["name", "size", "storageClass", "accessMode", "url", "image"];
      } else if (disk?.createType === "new") {
        ignore = disk?.type === "blank" ? ["disk", "url", "image"] : ["disk", "image"];
      } else if (disk?.createType === "image") {
        ignore = ["disk", "url"];
      }

      // Always validate busType and cache
      const requiredFields = ["diskType", "createType", "busType", "cache"];
      const missingRequired = requiredFields.filter(field => !disk[field] && !ignore.includes(field));
      
      if (missingRequired.length > 0) {
        const setError = ({ formErrors }) => {
          setDisks((prev) => {
            let arr = [...prev];
            arr[i]["formErrors"] = {
              ...formErrors,
              ...missingRequired.reduce((acc, field) => ({
                ...acc,
                [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`
              }), {})
            };
            return arr;
          });
        };
        setError({ formErrors: {} });
        return false;
      }

      const setError = ({ formErrors }) => {
        setDisks((prev) => {
          let arr = [...prev];
          arr[i]["formErrors"] = formErrors;
          return arr;
        });
      };
      return showFormErrors(disk, setError, ignore);
    });
  };

  const onAddMoreDisk = () => {
    setDisks((prev) => [
      ...prev,
      {
        createType: "new",
        diskType: "disk",
        busType: "",
        memoryType: "Gi",
        size: "",
        storageClass: "",
        accessMode: "",
        image: "",
        disk: "",
        type: "blank",
        url: "",
        cache: "",
      },
    ]);
  };

  const onRemoveDisk = (index) => {
    setDisks((prev) => prev.filter((_, i) => i !== index));
  };

  const onMoveDisk = (index, direction) => {
    setDisks((prev) => {
      const newDisks = [...prev];
      if (direction === 'up' && index > 0) {
        [newDisks[index], newDisks[index - 1]] = [newDisks[index - 1], newDisks[index]];
      } else if (direction === 'down' && index < newDisks.length - 1) {
        [newDisks[index], newDisks[index + 1]] = [newDisks[index + 1], newDisks[index]];
      }
      return newDisks;
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // TODO: Use the selected template to pre-fill form values
  };

  const steps = [
    { label: "Basic Settings" },
    { label: "Storage" },
    { label: "Network" },
    { label: "User Data" },
    { label: "Review" },
  ];

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <BasicDetails data={data} handleChange={handleChange} />
            <Buttonlayout>
              <CustomButton
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => onStepChange(1)}
              />
            </Buttonlayout>
          </>
        );
      case 1:
        return (
          <>
            {disks.map((disk, i) => (
              <Storage
                key={i}
                disk={disk}
                setDisk={setDisks}
                index={i}
                disks={disks}
                onRemoveDisk={onRemoveDisk}
                onMoveDisk={onMoveDisk}
                data={data}
              />
            ))}
            <button className="add-disk-button" onClick={onAddMoreDisk}>
              <i className="pi pi-plus-circle"></i>
              Add More Disk
            </button>
            <Buttonlayout>
              <CustomButtonOutlined
                label="Previous"
                icon="pi pi-arrow-left"
                onClick={() => onStepChange(0)}
              />
              <CustomButton
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => onStepChange(2)}
              />
            </Buttonlayout>
          </>
        );
      case 2:
        return (
          <>
            <Network data={data} handleChange={handleChange} />
            <Buttonlayout>
              <CustomButtonOutlined
                label="Previous"
                icon="pi pi-arrow-left"
                onClick={() => onStepChange(1)}
              />
              <CustomButton
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => onStepChange(3)}
              />
            </Buttonlayout>
          </>
        );
      case 3:
        return (
          <>
            <UserData data={data} handleChange={handleChange} />
            <Buttonlayout>
              <CustomButtonOutlined
                label="Previous"
                icon="pi pi-arrow-left"
                onClick={() => onStepChange(2)}
              />
              <CustomButton
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => onStepChange(4)}
              />
            </Buttonlayout>
          </>
        );
      case 4:
        return (
          <>
            <Review data={data} disks={disks} />
            <Buttonlayout>
              <CustomButtonOutlined
                label="Previous"
                icon="pi pi-arrow-left"
                onClick={() => onStepChange(3)}
              />
              <CustomButton
                loading={loading}
                label="Create"
                icon="pi pi-check"
                onClick={onAddVM}
              />
            </Buttonlayout>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
      />
      <div className="add-vm-form">
        <ConfirmPopup />
        <div className="flex">
          <div className="steps-sidebar">
            <ul className="step-list">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`step-item ${activeIndex === index ? 'active' : ''} ${
                    completedSteps.includes(index) ? 'completed' : ''
                  }`}
                  onClick={() => onStepChange(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                  aria-current={activeIndex === index ? 'step' : undefined}
                >
                  <span className="step-number">{index + 1}</span>
                  <div className="step-content">
                    <h3 className="step-title">
                      {step.label}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="step-content">
            <Card>{renderStepContent()}</Card>
          </div>
        </div>
      </div>
    </>
  );
}

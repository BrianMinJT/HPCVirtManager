import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNamespacesAction,
  getNodesAction,
  getPriorityClassAction,
} from "../../../store/actions/projectActions";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import Grid, { Col } from "../../../shared/Grid";
import BasicDetails from "./BasicDetails";
import Network from "./Network";
// import Advanced from "./Advanced";
import formValidation from "../../../utils/validations";
import Storage from "./Storage";
import Review from "./Review";
import { onAddVMAction } from "../../../store/actions/vmActions";
import CustomCard from "../../../shared/CustomCard";
import { showFormErrors } from "../../../utils/commonFunctions";
import { ConfirmPopup } from "primereact/confirmpopup";
import UserData from "./UserData";
import {
  getDisksAction,
  getStorageClassesAction,
} from "../../../store/actions/storageActions";

export default function AddVirtualMachineForm({ onClose }) {
  const stepperRef = useRef(null);
  const dispatch = useDispatch();
  const { priorityClassesDropdown, images } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(getNamespacesAction());
    dispatch(getNodesAction());
    dispatch(getStorageClassesAction());
    dispatch(getPriorityClassAction());
    dispatch(getDisksAction());
  }, [dispatch]);

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

  useEffect(() => {
    if (priorityClassesDropdown.length) {
      setData((prev) => ({
        ...prev,
        priorityClass: priorityClassesDropdown[0],
      }));
    }
  }, [priorityClassesDropdown]);

  const [disks, setDiskes] = useState([
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

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const [loading, setLoading] = useState(false);

  const onAddVM = () => {
    if (showFormErrors(data, setData)) {
      if (validateDisk()) {
        dispatch(
          onAddVMAction(data, disks, images, setLoading, () => {
            onClose();
            setData({
              node: "",
              name: "",
              namespace: "",
              sockets: "",
              cores: "",
              threads: "",
              memory: "",
              priorityClass: "",
              storage1: "",
              networkType: "podNetwork",
              bindingMode: "bridge",
              advanced: "",
              userName: "",
              password: "",
            });
            setDiskes([
              {
                createType: "new",
                diskType: "disk",
                busType: "",
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
          })
        );
      } else {
        stepperRef.current.setActiveStep(1);
      }
    } else {
      stepperRef.current.setActiveStep(0);
    }
  };

  const onBasicDetailsNext = () => {
    if (showFormErrors(data, setData, ["userName", "password"])) {
      stepperRef.current.nextCallback();
    }
  };

  const onStorageNext = () => {
    if (validateDisk()) {
      stepperRef.current.nextCallback();
    }
  };

  const onUserDetailsNext = () => {
    if (showFormErrors(data, setData)) {
      stepperRef.current.nextCallback();
    }
  };

  const validateDisk = () => {
    return disks.every((disk, i) => {
      let ignore = ["disk"];
      if (disk?.createType === "existing") {
        ignore = ["name", "size", "storageClass", "accessMode", "url", "image"];
      }
      if (disk?.type === "blank") {
        ignore.push("url");
      }
      console.log(disk?.type);

      if (disk?.createType === "new") {
        ignore.push("image");
      }
      console.log(ignore);
      const setError = ({ formErrors }) => {
        setDiskes((prev) => {
          let arr = [...prev];
          arr[i]["formErrors"] = formErrors;
          return arr;
        });
      };
      return showFormErrors(disk, setError, ignore);
    });
  };

  const onAddMoreDisk = () => {
    setDiskes((prev) => [
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
    setDiskes((prev) => {
      let _arr = [...prev];
      _arr.splice(index, 1);
      return _arr;
    });
  };

  return (
    <div>
      <ConfirmPopup />
      <Stepper ref={stepperRef} orientation="vertical">
        <StepperPanel header="Basic Settings">
          <Grid>
            <Col>
              <CustomCard>
                <BasicDetails data={data} handleChange={handleChange} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={onBasicDetailsNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Storage">
          <Grid>
            <Col>
              {disks.map((item, i) => (
                <CustomCard key={i}>
                  <Storage
                    data={data}
                    disk={item}
                    setDisk={setDiskes}
                    index={i}
                    onRemoveDisk={onRemoveDisk}
                  />
                </CustomCard>
              ))}
              <span onClick={onAddMoreDisk} className="ml-2 cursor-pointer">
                <i className="pi pi-plus-circle"></i> Add More Disk
              </span>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={onStorageNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Network">
          <Grid>
            <Col>
              <CustomCard>
                <Network data={data} handleChange={handleChange} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </Buttonlayout>
        </StepperPanel>
        {/* <StepperPanel header="Advanced">
          <Grid>
            <Col>
              <CustomCard>
                <Advanced data={data} handleChange={handleChange} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </Buttonlayout>
        </StepperPanel> */}
        <StepperPanel header="User Data">
          <Grid>
            <Col>
              <CustomCard>
                <UserData data={data} handleChange={handleChange} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={onUserDetailsNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Review">
          <Grid>
            <Col>
              <CustomCard>
                <Review data={data} disks={disks} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton loading={loading} label="Create" onClick={onAddVM} />
          </Buttonlayout>
        </StepperPanel>
      </Stepper>
    </div>
  );
}

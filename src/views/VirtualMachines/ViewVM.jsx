import React, { useEffect, useRef, useState } from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { Link, useParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import {
  CustomButtonOutlined,
  CustomSplitButton,
} from "../../shared/CustomButton";
import CustomCard, { CustomCardField } from "../../shared/CustomCard";
import Grid, { Col } from "../../shared/Grid";
import { useDispatch } from "react-redux";
import {
  getVolumesAction,
  onChangeVmStatusAction,
  onDeleteVMAction,
  onGetVMAction,
  onPauseVMAction,
} from "../../store/actions/vmActions";
import { timeAgo } from "../../utils/date";
import CustomCodeEditor from "../../shared/CustomCodeEditor";
import { longOverlayText } from "../../shared/TableHelpers";
import { confirmDialog } from "primereact/confirmdialog";
import moment from "moment";
import constants from "../../constants";
import EditVmModal from "./Form/EditVmModal";
import MigrateModal from "./Form/MigrateModal";


export default function ViewVM() {
  const dispatch = useDispatch();
  let { name, namespace } = useParams();

  const onOpenConsole = () => {
    window.open(
      `${constants.baseUrl}/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachineinstances/${name}/vnc`,
      "mywindow",
      "menubar=1,resizable=1,width=500,height=350"
    );
  };

  const breadcrumItems = [
    { label: "Virtual Machines", url: "/#/virtual-machines/list" },
    { label: "All VMs", url: "/#/virtual-machines/list" },
    { label: name, url: `/#/virtual-machines/details/${namespace}/${name}` },
  ];

  const ref = useRef();
  const onDelete = (item) => {
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete ${item.namespace} - ${item.name} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: "primary-button",
      accept: () => {
        dispatch(onDeleteVMAction(item));
      },
    });
  };
  const [onOpenMigrate, setOpenMigrate] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const onEdit = () => {
    setEditInfo(data);
  };
  const moreActions = [
    {
      label: "Migrate",
      command: () => {
        setOpenMigrate(data);
      },
    },
    {
      label: "Edit VM",
      command: () => {
        onEdit();
      },
    },
    {
      label: "Delete VM",
      command: () => {
        onDelete({ name, namespace });
      },
    },
  ];

  useEffect(() => {
    onInitialLoad();
    // eslint-disable-next-line
  }, [name, namespace]);

  const onInitialLoad = () => {
    dispatch(
      onGetVMAction({ name, namespace }, (res, instance) => {
        setData((prev) => ({
          ...prev,
          created: res?.metadata?.creationTimestamp,
          name: res?.metadata?.name,
          namespace: res?.metadata?.namespace,
          labels: res?.metadata?.labels,
          status: res?.status?.printableStatus,

          cores: res?.spec?.template?.spec?.domain?.cpu?.cores,
          sockets: res?.spec?.template?.spec?.domain?.cpu?.sockets,
          threads: res?.spec?.template?.spec?.domain?.cpu?.threads,
          memory:
            res?.spec?.template?.spec?.domain?.resources?.requests?.memory,

          storageDisks: res?.spec?.template?.spec?.volumes,

          interfaces: res?.spec?.template?.spec?.domain?.devices?.interfaces,
          networks: res?.spec?.template?.spec?.networks,

          conditions: instance?.status?.conditions?.[0],
          ipAddress: instance?.status?.interfaces?.map(
            (item) => item?.ipAddress
          ),
          guestOS: instance?.status?.guestOSInfo?.name,
          node: instance?.status?.nodeName,
        }));
      })
    );
  };

  const [data, setData] = useState({
    status: "",
    conditions: {},
    created: "",
    uptime: "",
    labels: {},
    node: "",
    cluster: "",
    ipAddress: "",
    storageDisks: "",
    networks: [],
    interfaces: [],
    cores: "",
    model: "",
    sockets: "",
    threads: "",
    memory: "",
    yaml: "",
  });

  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    if (data?.storageDisks?.length) {
      dispatch(
        getVolumesAction(namespace, data?.storageDisks, (res) => {
          setVolumes(res);
        })
      );
    } // eslint-disable-next-line
  }, [data?.storageDisks]);

  const statusTemplate = (item) => {
    switch (item.status) {
      case "Starting":
        return (
          <span className="text-pink-400">
            <i className="pi pi-play-circle text-sm mr-1"></i>Starting
          </span>
        );
      case "Ready":
        return (
          <span className="text-green-500">
            <i className="pi pi-check-circle text-sm mr-1"></i>Ready
          </span>
        );
      case "Running":
        return (
          <span className="text-cyan-500">
            <i className="pi pi-check-circle text-sm mr-1"></i>Running
          </span>
        );
      case "Stopping":
        return (
          <span className="text-red-400">
            {" "}
            <i className="pi pi-ban text-sm mr-1"></i>Stopping
          </span>
        );
      case "Stopped":
        return (
          <span className="text-red-500">
            <i className="pi pi-ban text-sm mr-1"></i>Stopped
          </span>
        );
      case "Paused":
        return (
          <span className="text-yellow-500">
            <i className="pi pi-pause-circle text-sm mr-1"></i>Paused
          </span>
        );
      default:
        return <span>{item.status}</span>;
    }
  };

  const onStart = () => {
    dispatch(
      onChangeVmStatusAction(
        { name, namespace },
        {
          running: true,
        },
        () => {
          onInitialLoad();
        }
      )
    );
  };
  const onStop = () => {
    dispatch(
      onChangeVmStatusAction(
        { name, namespace },
        {
          running: false,
        },
        () => {
          onInitialLoad();
        }
      )
    );
  };
  const actions = [
    {
      label: "Reboot",
      disabled: data.status !== "Running",
    },
    {
      label: "Pause",
      command: () => {
        dispatch(onPauseVMAction({ name, namespace }));
      },
      disabled: data.status !== "Running",
    },
    {
      label: "Stop",
      command: () => {
        dispatch(
          onChangeVmStatusAction(
            { name, namespace },
            {
              running: false,
            }
          )
        );
      },
      disabled: data.status !== "Running",
    },
  ];
  const headers = (
    <>
      <CustomButtonOutlined
        label="Start"
        severity="secondary"
        icon="pi pi-play"
        disabled={data?.status === "Running"}
        onClick={onStart}
      />
      <CustomSplitButton
        label="Shutdown"
        icon="pi pi-power-off"
        model={actions}
        severity="danger"
        onClick={data.status === "Running" ? () => onStop() : null}
        // disabled={data.status !== "Running"}
      />
      <CustomButtonOutlined
        label="Refresh"
        severity="secondary"
        icon="pi pi-sync"
        onClick={onInitialLoad}
      />
      <CustomButtonOutlined
        label="Console"
        severity="secondary"
        icon="pi pi-code"
        onClick={onOpenConsole}
      />
      <CustomSplitButton
        label="More Actions"
        model={moreActions}
        severity="secondary"
      />
    </>
  );

  const getSource = (item) => {
    let source = item?.spec?.source;
    return source?.http || source?.registry || source?.gcs || source?.s3;
  };

  return (
    <>
      <EditVmModal visible={editInfo} setVisible={setEditInfo} />
      <MigrateModal visible={onOpenMigrate} setVisible={setOpenMigrate} />
      <CustomBreadcrum items={breadcrumItems} />
      <Page title={name} headers={headers}>
        <TabView style={{ background: "transprent" }}>
          <TabPanel header="Overview">
            <Grid>
              <Col size={8}>
                <Grid>
                  <Col size={5}>
                    <CustomCard title="Status">
                      <CustomCardField title="Name" value={name} />
                      <CustomCardField
                        title="Status"
                        value={data?.status}
                        template={statusTemplate(data)}
                      />
                      <CustomCardField
                        title="Conditions"
                        value={data?.conditions?.type}
                      />
                      <CustomCardField
                        title="Created"
                        value={data.created && timeAgo(data.created)}
                      />
                      <CustomCardField
                        title="Uptime"
                        value={
                          data?.conditions?.lastTransitionTime &&
                          moment(data?.conditions?.lastTransitionTime).fromNow()
                        }
                      />
                    </CustomCard>
                    {/* <CustomCard title="Labels">
                      {data?.labels &&
                        Object.entries(data?.labels).map(([key, value]) => (
                          <CustomChip value={`${key}: ${value}`} />
                        ))}
                    </CustomCard> */}
                  </Col>
                  <Col size={7}>
                    <CustomCard title="Details">
                      <CustomCardField title="Namespace" value={namespace} />
                      <CustomCardField
                        title="Node"
                        template={<Link>{data?.node}</Link>}
                      />
                      <CustomCardField
                        title="Cluster"
                        value={data?.cluster}
                        template={<Link>{data?.cluster}</Link>}
                      />
                      <CustomCardField
                        title="IP Address"
                        value={data?.ipAddress}
                      />
                    </CustomCard>
                    <CustomCard title="Mounted Components">
                      <CustomCardField
                        title="Storage Disks"
                        value={volumes?.length}
                        // value={data?.storageDisks?.length}
                      />
                      <CustomCardField
                        title="Networking (NIC)"
                        value={data?.networks?.length}
                      />
                    </CustomCard>
                    <CustomCard title="Allocated Resources">
                      <CustomCardField title="Cores" value={data?.cores} />
                      <CustomCardField title="Sockets" value={data?.sockets} />
                      <CustomCardField title="Threads" value={data?.threads} />
                      <CustomCardField title="Memory" value={data?.memory} />
                    </CustomCard>
                  </Col>
                </Grid>
              </Col>
            </Grid>
          </TabPanel>
          <TabPanel header="YAML">
            <CustomCodeEditor value={data?.yaml} />
          </TabPanel>
          <TabPanel header="Disk">
            <Grid>
              {volumes &&
                volumes?.map((item) => (
                  <Col size={6}>
                    <CustomCard title={item.name}>
                      <CustomCardField
                        title="Name"
                        value={item?.metadata?.name}
                      />
                      <CustomCardField title="Type" value={item?.kind} />
                      <CustomCardField
                        title="Size"
                        value={item?.spec?.pvc?.resources?.requests?.storage}
                      />
                      <CustomCardField
                        title="Status"
                        value={item?.status?.phase}
                      />
                      <CustomCardField
                        title="Storage Class"
                        value={item?.spec?.pvc?.storageClassName}
                      />
                      <CustomCardField
                        title="Source"
                        value={longOverlayText(getSource(item), "url", 40)}
                      />
                      <CustomCardField
                        title="Access Mode"
                        value={item?.spec?.pvc?.accessModes}
                      />
                      <CustomCardField title="PVC" />
                    </CustomCard>
                  </Col>
                ))}
            </Grid>
          </TabPanel>
          <TabPanel header="Network Interfaces">
            <Grid>
              {data?.networks?.map((item) => (
                <Col size={4}>
                  <CustomCard title={item?.name}>
                    <CustomCardField
                      title="Network Type"
                      value={item?.pod && "podNetwork"}
                    />
                    <CustomCardField
                      title="Network Mode"
                      value={
                        data.interfaces.find((int) => int.name === item.name)
                          ?.masquerade
                          ? "masquerade"
                          : "bridge"
                      }
                    />
                  </CustomCard>
                </Col>
              ))}
            </Grid>
          </TabPanel>
        </TabView>
      </Page>
    </>
  );
}

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  vms: [],
  nodes: [],
  nodeDetail:{},
  nodesDropdown: [],
  namespaces: [],
  namespacesDropdown: [],
  storageClasses: [],
  storageClassesDropdown: [],
  disks: [],
  disksDropdown: [],
  accessModeDropdown: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"],
  bindingModeDropdown: ["bridge", "masquerade"],
  priorityClassesDropdown: [],
};

export const projectSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setVMs: (state, action) => {
      state.vms = action.payload;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
      state.nodesDropdown = action.payload.map((item) => item?.name);
    },
    setNodeDetail: (state, action) => {
      state.nodeDetail = action.payload;
    },
    setNamespaces: (state, action) => {
      state.namespaces = action.payload;
      state.namespacesDropdown = action.payload.map(
        (item) => item?.metadata?.name
      );
    },
    setStorageClasses: (state, action) => {
      state.storageClasses = action.payload;
      state.storageClassesDropdown = action.payload.map((item) => item?.name);
    },
    setDisks: (state, action) => {
      state.disks = action.payload;
      state.disksDropdown = action.payload.map((item) => item?.name);
    },
    setPriorityClasses: (state, action) => {
      state.priorityClassesDropdown = action.payload
        .map((item) => item?.metadata?.name)
        .reverse();
    },
  },
});
export const {
  setVMs,
  setNodes,
  setNodeDetail,
  setNamespaces,
  setStorageClasses,
  setDisks,
  setPriorityClasses,
} = projectSlice.actions;
export default projectSlice.reducer;

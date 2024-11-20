export const sidebarItems = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "pi pi-home",
  },
  {
    title: "Virtual Machines",
    link: "/virtual-machines",
    icon: "pi pi-server",
    items: [
      {
        title: "All VMs",
        link: "/list",
      },
      {
        title: "Templates",
        link: "/templates",
      },
      {
        title: "Live Migrations",
        link: "/live-migrations",
      },
    ],
  },
  {
    title: "Storage",
    link: "/storage",
    icon: "pi pi-database",
    items: [
      {
        title: "Storage Disks",
        link: "/disk",
      },
      {
        title: "Storage Classes",
        link: "/classes",
      },
    ],
  },
  {
    title: "Images",
    link: "/images",
    icon: "pi pi-save",
  },
  {
    title: "Clusters",
    link: "/clusters",
    icon: "pi pi-sitemap",
  },
  {
    title: "Nodes",
    link: "/nodes",
    icon: "pi pi-circle",
  },
  {
    title: "Users (RBAC)",
    link: "/users",
    icon: "pi pi-users",
  },
];

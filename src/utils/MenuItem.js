const menuItems = [
  {
    label: "DASHBOARD",
    path: "/dashboard",
    activeLink: ["/", "/dashboard"],
    roles: ["SUPER_ADMIN", "ADMIN", "USER","VOLUNTEER"],
  },
  {
    label: "ADMIN",
    path: "/admin",
    activeLink: ["/admin" , "/admin/add" , "/admin/[id]"],
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "AREA",
    path: "/area",
    activeLink: ["/area", "/area/add" ,"/area/[id]"],
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "VOLUNTEER",
    path: "/volunteer",
    activeLink: ["/volunteer", "/volunteer/add", "/volunteer/[id]"],
    roles: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER" ],
  },
  {
    label: "DONOR",
    path: "/donor",
    activeLink: ["/donor", "/donor/add", "/donor/[id]"],
    roles: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  },
  {
    label: "EVENT",
    path: "/event",
    activeLink: [
      "/event",
      "/event/add",
      "/event/[id]",
      "/event/[id]/edit",
      "/event/[id]/register",
       "/event/[id]/update",
       "/admin/[id]"
    ],
    roles: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  },
];


export const getMenuItems = (role) => {
  if (!role) return [];

  return menuItems.filter((item) =>
    item.roles.includes(role)
  );
};

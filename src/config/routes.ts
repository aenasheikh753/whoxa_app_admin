import type { ReactNode } from "react";

export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  SETTINGS: "/settings",
  CMS: "/cms-pages",
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  USERS: {
    LIST: "/users/user-list",
    COUNTRY_WISE: "/users/countrywise-user-list",
    BLOCKED_USERS: "/users/block-list",
  },
  GROUP: {
    LIST: "/groups/group-list",
    // COUNTRY_WISE: "/users/countrywise-user-list",
    // BLOCKED_USERS: "/users/block-list",
  },
  CALLS: {
    AUDIO_CALL_LIST: "/calls/audio-call-list",
    VIDEO_CALL_LIST: "/calls/video-call-list",
  },
  NOTIFICATIONS: {
    LIST: "/notifications/notification-list",
  },
  AVATARS: {
    LIST: "/avatar/avatar-list",
    ADD: "/avatar/add-avatar",
  },
  REPORTS: {
    USERS: "/reports-list/users",
    REPORTTYPES: "/reports-list/report-types",
    GROUPS: "/reports-list/groups",
  },
  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    ROLES: "/admin/roles",
    SETTINGS: "/admin/settings",
  },
  LANGUAGE: {
    LIST: "/language/language-list",
    TRANSLATED_WORD_LIST: "/language/translated-words/:id"
  },

  // Error pages
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",
  ERROR: "/error",
} as const;

type RoutePath = (typeof ROUTES)[keyof typeof ROUTES] extends string
  ? (typeof ROUTES)[keyof typeof ROUTES]
  : {
      [K in keyof typeof ROUTES]: (typeof ROUTES)[K] extends string
        ? (typeof ROUTES)[K]
        : (typeof ROUTES)[K][keyof (typeof ROUTES)[K]];
    }[keyof typeof ROUTES];

interface RouteMeta {
  title: string;
  description?: string;
  roles?: string[];
  permissions?: string[];
  layout?: "auth" | "dashboard" | "public";
  isPublic?: boolean;
  hideFromMenu?: boolean;
  icon?: ReactNode;
  breadcrumb?: string | ((params: any) => string);
}

export const ROUTE_CONFIG: Partial<Record<RoutePath, RouteMeta>> = {
  // Auth routes
  [ROUTES.LOGIN]: {
    title: "Login",
    layout: "auth",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.REGISTER]: {
    title: "Create an Account",
    layout: "auth",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.FORGOT_PASSWORD]: {
    title: "Reset Password",
    layout: "auth",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.RESET_PASSWORD]: {
    title: "Set New Password",
    layout: "auth",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.VERIFY_EMAIL]: {
    title: "Verify Email",
    layout: "auth",
    isPublic: true,
    hideFromMenu: true,
  },

  // Public routes
  [ROUTES.HOME]: {
    title: "Home",
    layout: "public",
    isPublic: true,
  },
  [ROUTES.ABOUT]: {
    title: "About Us",
    layout: "public",
    isPublic: true,
  },
  [ROUTES.PRIVACY]: {
    title: "Privacy Policy",
    layout: "public",
    isPublic: true,
  },
  [ROUTES.TERMS]: {
    title: "Terms of Service",
    layout: "public",
    isPublic: true,
  },

  // Dashboard routes
  [ROUTES.DASHBOARD]: {
    title: "Dashboard",
    layout: "dashboard",
    icon: "grid",
  },
  [ROUTES.PROFILE]: {
    title: "My Profile",
    layout: "dashboard",
    icon: "user",
  },
  [ROUTES.SETTINGS]: {
    title: "Settings",
    layout: "dashboard",
    icon: "settings",
  },

  // Admin routes
  [ROUTES.ADMIN.DASHBOARD]: {
    title: "Admin Dashboard",
    layout: "dashboard",
    roles: ["admin", "superadmin"],
    icon: "shield",
  },
  [ROUTES.ADMIN.USERS]: {
    title: "User Management",
    layout: "dashboard",
    roles: ["admin", "superadmin"],
    permissions: ["manage_users"],
    icon: "users",
  },
  [ROUTES.ADMIN.ROLES]: {
    title: "Role Management",
    layout: "dashboard",
    roles: ["superadmin"],
    permissions: ["manage_roles"],
    icon: "key",
  },
  [ROUTES.ADMIN.SETTINGS]: {
    title: "System Settings",
    layout: "dashboard",
    roles: ["superadmin"],
    permissions: ["manage_settings"],
    icon: "settings",
  },

  // Error pages
  [ROUTES.NOT_FOUND]: {
    title: "Page Not Found",
    layout: "public",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.UNAUTHORIZED]: {
    title: "Unauthorized",
    layout: "public",
    isPublic: true,
    hideFromMenu: true,
  },
  [ROUTES.ERROR]: {
    title: "Error",
    layout: "public",
    isPublic: true,
    hideFromMenu: true,
  },
} as const;

// Navigation menu items
export const NAVIGATION = {
  main: [
    { path: ROUTES.HOME, title: "Home" },
    { path: ROUTES.ABOUT, title: "About" },
  ],
  dashboard: [
    { path: ROUTES.DASHBOARD, title: "Dashboard" },
    { path: ROUTES.PROFILE, title: "Profile" },
    {
      title: "Admin",
      icon: "shield",
      roles: ["admin", "superadmin"],
      children: [
        { path: ROUTES.ADMIN.DASHBOARD, title: "Dashboard" },
        { path: ROUTES.ADMIN.USERS, title: "Users" },
        { path: ROUTES.ADMIN.ROLES, title: "Roles" },
        { path: ROUTES.ADMIN.SETTINGS, title: "Settings" },
      ],
    },
  ],
  footer: [
    { path: ROUTES.ABOUT, title: "About Us" },
    { path: ROUTES.PRIVACY, title: "Privacy Policy" },
    { path: ROUTES.TERMS, title: "Terms of Service" },
  ],
} as const;

// Helper functions
export const getRouteConfig = (path: string): RouteMeta | undefined => {
  // Handle nested routes (e.g., admin routes)
  if (path.startsWith("/admin/")) {
    const adminPath = path.replace(/^\/admin/, "");
    const adminRoute = `ADMIN.${adminPath
      .replace(/^\//, "")
      .toUpperCase()}` as keyof typeof ROUTES.ADMIN;

    if (adminRoute in ROUTES.ADMIN) {
      const fullPath = ROUTES.ADMIN[adminRoute as keyof typeof ROUTES.ADMIN];
      return ROUTE_CONFIG[fullPath as keyof typeof ROUTE_CONFIG];
    }
  }

  return ROUTE_CONFIG[path as keyof typeof ROUTE_CONFIG];
};

export const getPageTitle = (path: string): string => {
  const config = getRouteConfig(path);
  return config?.title || "Page Not Found";
};

export const isPublicRoute = (path: string): boolean => {
  const config = getRouteConfig(path);
  return config?.isPublic || false;
};

export const getLayoutType = (
  path: string
): "auth" | "dashboard" | "public" => {
  const config = getRouteConfig(path);
  return config?.layout || "public";
};

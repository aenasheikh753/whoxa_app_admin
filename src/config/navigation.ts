import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart2,
  Folder,
  File,
  FileCheck,
  User,
  Group,
  UsersRound,
  UserRoundX,
  Flag,
  Bell,
  Settings2,
  SettingsIcon,
  PhoneCall,
} from "lucide-react";
import type { ComponentType } from "react";
import { MdOutlineGroups2 } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { LuListX } from "react-icons/lu";
import { RiUserForbidLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { FaPager } from "react-icons/fa6";
import DashboardUserListPage from "@/pages/user/UserListPage";
import { AvatarForm } from "@/components/forms/AvatarForm";
import { ROUTES } from "./routes";
import { AddNotification } from "@/pages/Notification/AddPushNotification";
import { AddReportType } from "@/components/forms/AddReportType";
import { AddLanguage } from "@/components/forms/AddLanguageForm";
import React from "react";

import Dashboard1 from "/Images/dashboard1.png";
import PostList1 from "/Images/Reel.png";
import PostList2 from "/Images/relld.png";
import PostListh from "/Images/PostListh.png";
import StoriesList1 from "/Images/gift.png";
import StoriesList2 from "/Images/giftd.png";
import StoriesListh from "/Images/StoriesListh.png";

import giftc from "/Images/list12121212.png";
import giftcd from "/Images/giftcd.png";
import ReportList1 from "/Images/ReportList1.png";
import ReportList2 from "/Images/ReportList2.png";
import UserList1 from "/Images/userlisrrr.png";
import UserList2 from "/Images/UserList2.png";
import CountryWise1 from "/Images/flag12.png";
import CountryWise2 from "/Images/CountryWise2.png";
import CountryWiseh from "/Images/Flagh.png";
import HashtagList1 from "/Images/hashtag12.png";
import HashtagList2 from "/Images/HashtagList2.png";
import HashtagListh from "/Images/HashtagListh.png";
import LanguageList1 from "/Images/language12.png";
import LanguageList2 from "/Images/LanguageList2.png";
import LanguageListh from "/Images/LanguageListh.png";
import BlockList1 from "/Images/block12.png";
import BlockList2 from "/Images/BlockList2.png";
import BlockListh from "/Images/BlockListh.png";
import AvatarList1 from "/Images/empty-wallet.png";
import AvatarList2 from "/Images/empty-walletd.png";
import Settings1 from "/Images/setttingrrrr.png";
import Settings2 from "/Images/settings2.png";
import cms1 from "/Images/cms121.png";
import cms2 from "/Images/cms2.png";
import cmsh from "/Images/cmsh.png";
import R2l from "/Images/recharge12.png";
import R2d from "/Images/R2d.png";
import Ml from "/Images/live12.png";
import Md from "/Images/muscid.png";
import ll from "/Images/1121.png";
import ld from "/Images/md.png";
import Arrow from "/Images/Arrow.png";
import noty1 from "/Images/notify12.png";
import noty2 from "/Images/noty2.png";

export interface NavItem {
  title: string;
  path?: string;
  icon?: ComponentType<{ className?: string }>;
  children?: NavItem[];
  isOpen?: boolean;
  badge?: number;
  roles?: string[];
  permissions?: string[];
  modal?: {
    id: string;
    component: React.ComponentType<any>;
    props?: Record<string, any>;
  };
}

// Helper function to create an image component
const img = (src: string, alt: string) => {
  return function ImgComponent({ className }: { className?: string }) {
    return React.createElement("img", { src, alt, className });
  };
};

export const NAVIGATION: NavItem[] = [
  // {
  //   title: "Modals",
  //   icon: FaPager,
  //   children: [
  //     {
  //       title: "Open Example Modal",
  //       icon: Settings,
  //       modal: {
  //         id: "add-avatar-modal",
  //         component: DashboardUserListPage,
  //         props: {
  //           title: "Welcome to the Example Modal",
  //           message: "This is a full-screen modal that can be opened from the sidebar navigation."
  //         }
  //       }
  //     }
  //   ]
  // },
  {
    title: "DASHBOARD",
    children: [
      {
        title: "Dashboard",
        icon: img(Dashboard1, "Dashboard"),
        path: "/dashboard",
      },
    ],
    // path: "/dashboard",
    // icon: LayoutDashboard,
  },
  {
    title: "LIST",
    // icon: FileText,
    isOpen: true,
    children: [
      {
        title: "Report List",
        icon: img(StoriesList1, "Report List"),
        children: [
          {
            title: "Report Types List",
            path: "/reports-list/report-types",
            icon: UserRoundX,
            // badge: 12,
          },
          {
            title: "Add Report Type",
            modal: {
              id: "add-report-type-modal",
              component: AddReportType,
              props: {
                title: "Add Report Type",
                message:
                  "This is a full-screen modal that can be opened from the sidebar navigation.",
              },
            },
            // badge: 12,
          },
          {
            title: "User Report List",
            path: "/reports-list/users",
            icon: UserRoundX,
            // badge: 12,
          },
          {
            title: "Group Report List",
            path: "/reports-list/groups",
            icon: MdOutlineGroups2,
            // badge: 12,
          },
        ],
      },
      {
        title: "User List",
        path: "/users/user-list",
        icon: img(UserList1, "User List"),
      },
      {
        title: "Countrywise User List",
        path: "/users/countrywise-user-list",
        icon: img(CountryWise1, "Countrywise User List"),
      },
      {
        title: "Group List",
        path: ROUTES.GROUP.LIST,
        icon: Users,
      },
      {
        title: "Language",
        icon: img(LanguageList1, "Language"),
        children: [
          {
            title: "Language List",
            path: "/language/language-list",
            icon: UserRoundX,
            // badge: 12,
          },
          {
            title: "Language add",
            icon: MdOutlineGroups2,
            modal: {
              id: "add-avatar-modal",
              component: AddLanguage,
              props: {
                title: "Add Language",
                message:
                  "This is a full-screen modal that can be opened from the sidebar navigation.",
              },
            },
            // badge: 12,
          },
        ],
      },
      {
        title: "Block List",
        icon: img(UserList1, "Block List"),
        path: "/users/block-list",
      },
      {
        title: "Avatar",
        icon: img(UserList1, "Avatar"),
        children: [
          {
            title: "Avatar List",
            path: "/avatar/avatar-list",
            icon: UserRoundX,
            // badge: 12,
          },
          {
            title: "Avatar add",
            icon: MdOutlineGroups2,
            modal: {
              id: "add-avatar-modal",
              component: AvatarForm,
              props: {
                title: "Add Avatar",
                message:
                  "This is a full-screen modal that can be opened from the sidebar navigation.",
              },
            },
            // badge: 12,
          },
        ],
      },
    ],
  },
  {
    title: "CALLS",
    // icon: FileText,
    isOpen: true,
    children: [
      {
        title: "Calls",
        icon: PhoneCall,
        children: [
          {
            title: "Audio Call List",
            path: "/calls/audio-call-list",
            // icon: bell,
            // badge: 12,
          },
          {
            title: "Video Call List",
            path: "/calls/video-call-list",
            // icon: bell,
            // badge: 12,
          },
        ],
      },
    ],
  },
  {
    title: "NOTIFICATION",
    // icon: FileText,
    isOpen: true,
    children: [
      {
        title: "Notification",
        icon: img(noty1, "Notification"),
        children: [
          {
            title: "Push Notification List",
            path: "/notifications/notification-list",
            // icon: bell,
            // badge: 12,
          },
          {
            title: "Push Notification add",
            modal: {
              id: "add-notifiaction-modal",
              component: AddNotification,
              props: {
                title: "Send Notification",
                message:
                  "This is a full-screen modal that can be opened from the sidebar navigation.",
              },
            }, // icon: bell,
            // badge: 12,
          },
        ],
      },
    ],
  },
  {
    title: "SETTING",
    // icon: FileText,
    isOpen: true,
    children: [
      {
        title: "Settings",
        icon: img(Settings1, "Settings"),
        path: "/settings",
      },
      {
        title: "CMS Pages",
        icon: img(cms1, "CMS Pages"),
        path: "/cms-pages",
      },
    ],
  },
];

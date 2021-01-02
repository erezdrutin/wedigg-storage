/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Device from 'views/Device/Device.js';
import Warehouse from 'views/Warehouse/Warehouse.js';
import Supplier from 'views/Suppliers/Supplier.js';
import Site from 'views/Sites/Site.js';
import Product from 'views/Product/Product.js';
import Storage from 'views/Storage/Storage.js';
import TrackChanges from 'views/TrackChanges/TrackChanges.js';
import SettingsPage from 'views/SettingsPage/SettingsPage.js';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "לוח",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/storage",
    name: "Storage",
    rtlName: "אחסון",
    icon: "storage",
    component: Storage,
    layout: "/admin",
  },
  {
    path: "/site",
    name: "Sites",
    rtlName: "אתרים",
    icon: "place",
    component: Site,
    layout: "/admin",
  },
  {
    path: "/supplier",
    name: "Suppliers",
    rtlName: "ספקים",
    icon: "local_shipping",
    component: Supplier,
    layout: "/admin",
  },
  {
    path: "/track",
    name: "Track Changes",
    rtlName: "מעקב שינויים",
    icon: "assignment",
    component: TrackChanges,
    layout: "/admin",
  },
  {
    path: "/Settings",
    name: "Settings",
    rtlName: "הגדרות",
    icon: "settings",
    component: SettingsPage,
    layout: "/admin",
  },
  // {
  //   path: "/warehouse",
  //   name: "Warehouse",
  //   rtlName: "אחסון",
  //   icon: "storage",
  //   component: Warehouse,
  //   layout: "/admin",
  // },
  // {
  //   path: "/product",
  //   name: "Products",
  //   rtlName: "מוצרים",
  //   icon: "devices_other",
  //   component: Product,
  //   layout: "/admin",
  // },
];

export default dashboardRoutes;
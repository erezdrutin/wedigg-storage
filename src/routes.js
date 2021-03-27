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
import Supplier from 'views/Suppliers/Supplier.js';
import Site from 'views/Sites/Site.js';
import Storage from 'views/Storage/Storage.js';
import Product from 'views/Products/Product.js';
import TrackChanges from 'views/TrackChanges/TrackChanges.js';
import SettingsPage from 'views/SettingsPage/SettingsPage.js';
import Management from 'views/Management/Management.js';
import TableTestsView from 'views/TableTests/TableTestsView.js';

const dashboardRoutes = [
  {
    path: "/storage",
    name: "Storage",
    rtlName: "אחסון",
    icon: "storage",
    component: Storage,
    layout: "/admin",
  },
  {
    path: "/management",
    name: "Management",
    rtlName: "ניהול",
    icon: "business_center",
    component: Management,
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
    path: "/product",
    name: "Products",
    rtlName: "מוצרים",
    icon: "desktop_windows",
    component: Product,
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
    path: "/settings",
    name: "Settings",
    rtlName: "הגדרות",
    icon: "settings",
    component: SettingsPage,
    layout: "/admin",
  },
];

export default dashboardRoutes;
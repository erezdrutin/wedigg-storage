/*eslint-disable*/
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const [managementItems, setManagementItems] = useState(["/site", "/supplier", "/product"]);
  const [managementToggle, setManagementToggle] = useState(false);
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  /**
   * A function which will help us determine whether we should show the management sub-items or not.
   * Basically checking if the received value is false, and if so then checking if we should allow the menu
   * to have the "sub-management" items closed (meaning we're not on any of them) or not.
   */
  const handleToggleManagement = (value) => {
    var actRoute = value;
    if (!actRoute){
      managementItems.map((itemPath, index) => {
        var curProp = routes.filter(r => r.path === itemPath)[0];
        actRoute = !actRoute ? activeRoute(curProp.layout + curProp.path) : actRoute;
      })
    }
    setManagementToggle(actRoute);
  }

  // A function which will run as soon as the page loads:
  useEffect(() => {
    // If we're on a "sub-management" page, we would like to display it:
    handleToggleManagement(false);
  }, []);

  const { color, logo, image, logoText, routes } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        // console.log("PROP | KEYYY ====> ", prop, " | ", key)
        var activePro = " ";
        const listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.layout + prop.path)
        });
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
        });

        return (
          <div key={key}>
          {
            ![...managementItems, "/management"].includes(prop.path) ? (
              <NavLink
                to={prop.layout + prop.path}
                className={activePro + classes.item}
                activeClassName="active"
                key={key}
              >
                <ListItem button className={classes.itemLink + listItemClasses}>
                  {typeof prop.icon === "string" ? (
                    <Icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    />
                  )}
                  <ListItemText
                    primary={props.rtlActive ? prop.rtlName : prop.name}
                    className={classNames(classes.itemText, whiteFontClasses, {
                      [classes.itemTextRTL]: props.rtlActive
                    })}
                    disableTypography={true}
                  />
                </ListItem>
              </NavLink>
            ) : 
            (
              prop.path === "/management" ?
              (
                <ListItem button className={classes.itemLink + listItemClasses} onClick={() => handleToggleManagement(!managementToggle)}>
                  {typeof prop.icon === "string" ? (
                    <Icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    />
                  )}
                  <ListItemText
                    primary={props.rtlActive ? prop.rtlName : prop.name}
                    className={classNames(classes.itemText, whiteFontClasses, {
                      [classes.itemTextRTL]: props.rtlActive
                    })}
                    disableTypography={true}
                  />

                  {
                    managementToggle ? (
                    managementItems.map((itemPath, index) => {
                    var curProp = routes.filter(r => r.path === itemPath)[0];
                    const curListItemsClasses = classNames({
                      [" " + classes[color]]: activeRoute(curProp.layout + curProp.path)
                    });
                    const curWhiteFontClasses = classNames({
                      [" " + classes.whiteFont]: activeRoute(curProp.layout + curProp.path)
                    });
                    return (
                      <NavLink
                        to={curProp.layout + curProp.path}
                        className={activePro + classes.item}
                        activeClassName="active"
                        key={routes.indexOf(curProp)}
                      >
                        <ListItem button className={classes.itemLink + curListItemsClasses}>
                          <Icon className={classNames(classes.itemIcon, curWhiteFontClasses, {[classes.itemIconRTL]: props.rtlActive })}>{curProp.icon}</Icon>
                          <ListItemText
                            primary={curProp.name}
                            className={classNames(classes.itemText, curWhiteFontClasses, {[classes.itemTextRTL]: props.rtlActive})}
                            disableTypography={true}
                          />
                        </ListItem>
                      </NavLink>
                    );
                    }))
                    : ('')
                    }
                </ListItem>
              ) : ('')
            )
          }
          </div>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href="/admin/dashboard"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive
        })}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool
};

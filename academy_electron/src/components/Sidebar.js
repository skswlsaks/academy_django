import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import { Badge, Collapse } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import { Box } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import routes from "../routes/index";
import avatar from "../assets/img/avatars/avatar.jpg";

const SidebarCategory = withRouter(
    ({
        name,
        badgeColor,
        badgeText,
        icon: Icon,
        isOpen,
        children,
        onClick,
        location,
        to
    }) => {
        const getSidebarItemClass = path => {
            return location.pathname.indexOf(path) !== -1 ||
                (location.pathname === "/" && path === "/dashboard")
                ? "active"
                : "";
        };

        return (
            <li className={"sidebar-item " + getSidebarItemClass(to)}>
                <span
                    data-toggle="collapse"
                    className={"sidebar-link " + (!isOpen ? "collapsed" : "")}
                    onClick={onClick}
                    aria-expanded={isOpen ? "true" : "false"}
                >
                    <Icon size={18} className="align-middle mr-3" />
                    <span className="align-middle">{name}</span>
                    {badgeColor && badgeText ? (
                        <Badge color={badgeColor} size={18} className="sidebar-badge">
                            {badgeText}
                        </Badge>
                    ) : null}
                </span>
                <Collapse isOpen={isOpen}>
                    <ul id="item" className={"sidebar-dropdown list-unstyled"}>
                        {children}
                    </ul>
                </Collapse>
            </li>
        );
    }
);

const SidebarItem = withRouter(
    ({ name, badgeColor, badgeText, icon: Icon, location, to }) => {
        const getSidebarItemClass = path => {
            return location.pathname === path ? "active" : "";
        };

        return (
            <li className={"sidebar-item " + getSidebarItemClass(to)}>
                <NavLink to={to} className="sidebar-link" activeClassName="active">
                    {Icon ? <Icon size={18} className="align-middle mr-3" /> : null}
                    {name}
                    {badgeColor && badgeText ? (
                        <Badge color={badgeColor} size={18} className="sidebar-badge">
                            {badgeText}
                        </Badge>
                    ) : null}
                </NavLink>
            </li>
        );
    }
);

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toggle = index => {
        this.setState(state => ({
            [index]: !state[index]
        }));
    };

    componentWillMount() {
        /* Open collapse element that matches current url */
        const pathName = this.props.location.pathname;

        routes.forEach((route, index) => {
            const isActive = pathName.indexOf(route.path) === 0;
            const isOpen = route.open;
            const isHome = route.containsHome && pathName === "/" ? true : false;

            this.setState(() => ({
                [index]: isActive || isOpen || isHome
            }));
        });
    }

    render() {
        const { sidebar, auth } = this.props;

        return (
            <nav className={"sidebar sidebar-sticky" + (!sidebar.isOpen ? " toggled" : "")}>
                <div className="sidebar-content">
                    <PerfectScrollbar>
                        <a className="sidebar-brand" href="/">
                            <Box className="align-middle text-primary mr-2" size={24} />{" "}
                            <span className="align-middle">AppStack</span>
                        </a>

                        <ul className="sidebar-nav">
                            {routes.map((category, index) => {
                                if (category.isTeacher != auth.user.profile.isTeacher) {
                                    return null;
                                }
                                
                                return (
                                    <React.Fragment key={index}>
                                        {category.header ? (
                                            <li className="sidebar-header">{category.header}</li>
                                        ) : null}

                                        {category.children ? (
                                            <SidebarCategory
                                                name={category.name}
                                                badgeColor={category.badgeColor}
                                                badgeText={category.badgeText}
                                                icon={category.icon}
                                                to={category.path}
                                                isOpen={this.state[index]}
                                                onClick={() => this.toggle(index)}
                                            >
                                                {category.children.map((route, index) => (
                                                    <SidebarItem
                                                        key={index}
                                                        name={route.name}
                                                        to={route.path}
                                                        badgeColor={route.badgeColor}
                                                        badgeText={route.badgeText}
                                                    />
                                                ))}
                                            </SidebarCategory>
                                        ) : (
                                                <SidebarItem
                                                    name={category.name}
                                                    to={category.path}
                                                    icon={category.icon}
                                                    badgeColor={category.badgeColor}
                                                    badgeText={category.badgeText}
                                                />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        );
    }
}

export default withRouter(
    connect(state => ({
        sidebar: state.sidebar,
        auth: state.auth
    }))(Sidebar)
);
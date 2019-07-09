import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import {
    landingRoutes,
    teacherRoutes,
    studentRoutes,
    auth as authRoutes
} from "./index";

import LandingLayout from "../layouts/Landing";
import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import SignIn from "../pages/auth/SignIn";
import ScrollToTop from "../components/ScrollToTop";
import history from "../helpers/history";

class Routes extends React.Component {
    render() {
        const { auth } = this.props;

        let routesToRender = null;

        if (auth.isAuthenticated) {
            if(auth.user && auth.user.profile.isTeacher){
                routesToRender = teacherRoutes;
            }
            if(auth.user && !auth.user.profile.isTeacher){
                routesToRender = studentRoutes;
            }
        }

        const childRoutes = (Layout, routes) =>
            routes.map(({ children, path, component: Component }, index) =>
                children ? (
                    // Route item with children
                    children.map(({ path, component: Component }, index) => (
                        <Route
                            key={index}
                            path={path}
                            exact
                            render={props => (
                                <Layout>
                                    <Component {...props} />
                                </Layout>
                            )}
                        />
                    ))
                ) : (
                        // Route item without children
                        <Route
                            key={index}
                            path={path}
                            exact
                            render={props => (
                                <Layout>
                                    <Component {...props} />
                                </Layout>
                            )}
                        />
                )
            );

        return (
            <Router history={history}>
                <ScrollToTop>
                    <Switch>
                        {childRoutes(LandingLayout, landingRoutes)}
                        {(routesToRender!==null) ? childRoutes(DashboardLayout, routesToRender) : ''}
                        {childRoutes(AuthLayout, authRoutes)}
                        <Route render={() => (
                                <AuthLayout>
                                    <SignIn />
                                    {/* <Page404 /> */}
                                </AuthLayout>
                            )} 
                        />
                    </Switch>
                </ScrollToTop>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Routes);
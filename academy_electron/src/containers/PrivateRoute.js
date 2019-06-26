import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import * as reducers from '../reducers'

const PrivateRoute = ({ component: Component, auth, teacherOnly, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (auth.isLoading) {
                return <h2>Loading...</h2>;
            } else if (!auth.isAuthenticated) {
                return <Redirect to="/login" />;
            } else {
                //check if access restricted to teachers
                if(!teacherOnly || (teacherOnly && auth.user.profile.isTeacher)){
                    return <Component {...props} />;
                }else{
                    return <Redirect to="/student" />;
                }
            }
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
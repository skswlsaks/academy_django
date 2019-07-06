import React from "react";
import { connect } from 'react-redux';
import { register } from '../../redux/actions/auth';
import AlertMessage from '../../components/AlertMessage';
import * as alert_actions from '../../redux/actions/alert';
import { Link, Redirect } from 'react-router-dom';

import {
    Button,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";


class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            password2: "",
            profile: { classroom: "" }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeProf = this.handleChangeProf.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        if (this.props.errors) {
            this.props.clear_errors_dispatch();
        }
    }

    handleChangeProf(e) {
        const { name, value } = e.target;
        this.setState({ profile: { [name]: value } });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.register_dispatch(this.state);
    }

    render() {
        const { auth, show_alert, hide_alert, alert_msg, alert_type } = this.props;
        if (auth.isAuthenticated) {
            return (auth.user && auth.user.profile.isTeacher) ? (
                <Redirect to='/teacher/classroom' />
            ) : (
                    <Redirect to='/student/classroom' />
            )
        }

        return (
            <React.Fragment>
                <div className="text-center mt-4">
                    <h1 className="h2">Get started</h1>
                    <p className="lead">
                        Start creating the best possible user experience for you customers.
                    </p>
                </div>

                <Card>
                    <CardBody>
                        <AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} hideAlert={hide_alert} />
                        <div className="m-sm-4">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label>First Name</Label>
                                    <Input
                                        bsSize="lg"
                                        type="text"
                                        name="first_name"
                                        placeholder="Enter your first name" 
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Last Name</Label>
                                    <Input
                                        bsSize="lg"
                                        type="text"
                                        name="last_name"
                                        placeholder="Enter your last name" 
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Classroom</Label>
                                    <Input
                                        bsSize="lg"
                                        type="text"
                                        name="classroom"
                                        placeholder="Enter your classroom" 
                                        onChange={this.handleChangeProf}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input
                                        bsSize="lg"
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username" 
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input
                                        bsSize="lg"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password" 
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirm Password</Label>
                                    <Input
                                        bsSize="lg"
                                        type="password"
                                        name="password2"
                                        placeholder="Enter your password again" 
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <div className="text-center mt-3">
                                    <Button type="submit" color="primary" size="lg">Sign up</Button>
                                </div>
                            </Form>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    show_alert: state.alert.show,
    alert_msg: state.alert.msg,
    alert_type: state.alert.type
});

const mapDispatchToProps = (dispatch) => ({
    register_dispatch: (formData) => dispatch(register(formData)),
    hide_alert: () => dispatch(alert_actions.hide_alert())
})

const connectedSignUp = connect(mapStateToProps, mapDispatchToProps)(SignUp);
export default connectedSignUp;

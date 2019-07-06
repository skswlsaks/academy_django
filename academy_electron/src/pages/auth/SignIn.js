import React from "react";
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth';
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
    Input,
    CustomInput
} from "reactstrap";

import avatar from "../../assets/img/avatars/avatar.jpg";

class SignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillUnmount() {
		if(this.props.errors){
			this.props.clear_errors_dispatch();
		}
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.login_dispatch(this.state.username, this.state.password);
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
                        <h2>Welcome back, Chris</h2>
                        <p className="lead">Sign in to your account to continue</p>
                    </div>

                    <Card>
                        <CardBody>
					        <AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} hideAlert={hide_alert} />
                            <div className="m-sm-4">
                                <div className="text-center">
                                    <img
                                        src={avatar}
                                        alt="Chris Wood"
                                        className="img-fluid rounded-circle"
                                        width="132"
                                        height="132"
                                    />
                                </div>
                                <Form onSubmit={this.handleSubmit}>
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
                                        <small>
                                            <Link to="/auth/reset-password">Forgot password?</Link>
                                        </small>
                                    </FormGroup>
                                    <div>
                                        <CustomInput
                                            type="checkbox"
                                            id="rememberMe"
                                            label="Remember me next time"
                                            defaultChecked
                                        />
                                    </div>
                                    <div className="text-center mt-3">
                                        <Button color="primary" size="lg" type="submit">Sign in</Button>
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

const mapDispatchToProps = dispatch => ({
    login_dispatch: (username, password) => dispatch(login(username, password)),
	hide_alert: () => dispatch(alert_actions.hide_alert())
})

const connectedSignIn = connect(mapStateToProps, mapDispatchToProps)(SignIn);
export default connectedSignIn;

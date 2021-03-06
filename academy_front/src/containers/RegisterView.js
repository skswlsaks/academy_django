import React from 'react';
import { connect } from "react-redux";
import { register } from '../actions/auth';
import AlertMessage from '../components/AlertMessage';
import { Redirect } from 'react-router-dom';

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../style/Form.css';

class RegisterView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			first_name: "",
			last_name: "",
			username: "",
			password: "",
			password2: "",
			profile: {classroom: ""}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeProf = this.handleChangeProf.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillUnmount() {
		if(this.props.errors){
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
		const { isAuthenticated, show_alert, alert_msg, alert_type } = this.props;
		if (isAuthenticated) {
			return (
				<Redirect to='/' />
			)
		}

		return (
			<Container>
				<Row>
					<Col md={{ span: 8, offset: 2 }}>
						<AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} />
						<Card>
							<Card.Header>
								<h3>Register</h3>
							</Card.Header>
							<Card.Body>
								<Form onSubmit={this.handleSubmit}>
									<Form.Group controlId="formFirstName">
										<Form.Label>First Name</Form.Label>
										<Form.Control type="text" name="first_name" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formLastName">
										<Form.Label>Last Name</Form.Label>
										<Form.Control type="text" name="last_name" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formUsername">
										<Form.Label>Username</Form.Label>
										<Form.Control type="text" name="username" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" name="password" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formPassword2">
										<Form.Label>Confirm Password</Form.Label>
										<Form.Control type="password" name="password2" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formClassroom">
										<Form.Label>Classroom</Form.Label>
										<Form.Control type="text" name="classroom" onChange={this.handleChangeProf} required={true} />
									</Form.Group>
									<Button variant="primary" type="submit">
										Register
									</Button>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	show_alert: state.alert.show,
	alert_msg: state.alert.msg,
	alert_type: state.alert.type
});

const mapDispatchToProps = (dispatch) => ({
	register_dispatch: (formData) => dispatch(register(formData))
})

const connectedRegisterView = connect(mapStateToProps, mapDispatchToProps)(RegisterView);
export default connectedRegisterView;
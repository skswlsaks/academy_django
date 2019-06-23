import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/auth'
import AlertMessage from '../components/AlertMessage';
import { Link, Redirect } from 'react-router-dom';

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import '../style/Form.css';

class LoginView extends React.Component {
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
		const { isAuthenticated, show_alert, alert_msg, alert_type } = this.props;
		if (isAuthenticated) {
			return (
				<Redirect to='/' />
			)
		}

		return (
			<Container>
				<Row>
					<Col md={{ span: 6, offset: 3 }}>
						<AlertMessage msg={alert_msg} type={alert_type} showAlert={show_alert} />
						<Card>
							<Card.Header>
								<h3>Login</h3>
							</Card.Header>
							<Card.Body>
								<Form onSubmit={this.handleSubmit}>
									<Form.Group controlId="formUsername">
										<Form.Label>Username</Form.Label>
										<Form.Control type="text" name="username" onChange={this.handleChange} required={true} />
									</Form.Group>
									<Form.Group controlId="formPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" name="password" onChange={this.handleChange} required={true}/>
									</Form.Group>
									<Button variant="primary" type="submit">
										Login
									</Button>
									<div>Don't have an account? <Link to="/register">Register</Link></div>
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

const mapDispatchToProps = dispatch => ({
	login_dispatch: (username, password) => dispatch(login(username, password))
})

const connectedLoginView = connect(mapStateToProps, mapDispatchToProps)(LoginView);
export default connectedLoginView;
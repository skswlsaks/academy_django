import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/auth'
import { clear_errors } from '../actions/errors'
import { Link, Redirect } from 'react-router-dom';
import { errorAlert } from "../helpers/errorAlert";

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
		if (this.props.isAuthenticated) {
			return (
				<Redirect to='/' />
			)
		}
		const errors = this.props.errors;

		return (
			<Container>
				<Row>
					<Col md={{ span: 6, offset: 3 }}>
						{ (errors.status) ? errorAlert(errors) : '' }
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
	errors: state.errors
});

const mapDispatchToProps = dispatch => ({
	login_dispatch: (username, password) => dispatch(login(username, password)),
	clear_errors_dispatch: () => dispatch(clear_errors())
})

const connectedLoginView = connect(mapStateToProps, mapDispatchToProps)(LoginView);
export default connectedLoginView;
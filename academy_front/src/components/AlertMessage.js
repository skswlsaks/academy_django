import React from 'react';
import { Alert } from 'react-bootstrap';
import '../style/AlertMessage.css';

class AlertMessage extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return this.props.showAlert ? (
        <Alert className='mb-4 alert-shown' variant={this.props.type}>{this.props.msg}</Alert>
      ) : (
        <Alert className='mb-4 alert-hidden' variant={this.props.type}>{this.props.msg}</Alert>
      );
    }
  }

export default AlertMessage;
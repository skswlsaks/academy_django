import React from 'react';
import { UncontrolledAlert } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import '../assets/css/AlertMessage.css';

class AlertMessage extends React.Component {
    onDismiss = () => {
        this.props.hideAlert();
    }

    render() {
        const alertClass = (this.props.showAlert) ? 'alert-shown' : 'alert-hidden';
        return (
            <UncontrolledAlert className={alertClass} color={this.props.type} toggle={this.onDismiss}>
                <div className="alert-icon">
                    <FontAwesomeIcon icon={faBell} fixedWidth />
                </div>
                <div className="alert-message">{this.props.msg}</div>
            </UncontrolledAlert>
        );
    }
}

export default AlertMessage;
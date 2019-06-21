import React from 'react';
import { connect } from 'react-redux';
import '../style/UserThumbNail.css';

class UserThumb extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.callUser(this.props.username);
    }

    render() {
        return (
            <div className="thumb_nail" onClick={this.handleClick}>
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

export default UserThumb;
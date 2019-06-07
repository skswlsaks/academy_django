import React from 'react';
import './UserThumbNail.css';

class UserThumb extends React.Component {

    constructor(props) {
        super(props);
        this.onHandleClick = this.onHandleClick.bind(this);

        this.state = {

        }
    }

    onHandleClick() {
        // TODO: change remote user
    }

    render() {
        return (
            <div className="thumb_nail">
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

export default UserThumb;
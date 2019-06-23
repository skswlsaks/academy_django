import React from 'react';
import '../style/UserThumbNail.css';

class StudentThumbnail extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.callUser(this.props.username);
    }

    render() {
        return (
            <div className={this.props.connected ? "connected thumb_nail" : "thumb_nail"} onClick={this.handleClick}>
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

export default StudentThumbnail;
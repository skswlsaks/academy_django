import React from 'react';
import '../style/UserThumbNail.css';

class TeacherThumbnail extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.notifyTeacher(this.props.username);
    }

    render() {
        return (
            <div className={this.props.connected ? "connected thumb_nail" : "thumb_nail"} onClick={this.handleClick}>
                <div className="username"> Teacher {this.props.username} </div>
            </div>
        );
    }   
}

export default TeacherThumbnail;
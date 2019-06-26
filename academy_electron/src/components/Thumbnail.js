import React from 'react';
import '../style/UserThumbNail.css';

class Thumbnail extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        try {
            if (this.props.notifyTeacher) {
                this.props.notifyTeacher(this.props.username);
            } else if (this.props.callUser) {
                this.props.callUser(this.props.username);
            }
        } catch {

        }
    }

    render() {
        return (
            <div className={this.props.connected ? "connected thumb_nail" : "thumb_nail"} onClick={this.handleClick}>
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

export default Thumbnail;
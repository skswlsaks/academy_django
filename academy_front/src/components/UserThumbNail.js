import React from 'react';
import { connect } from 'react-redux';
import '../style/UserThumbNail.css';

class UserThumb extends React.Component {

    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(user) {
        console.log(this.props.my_peer);
        console.log("Calling this user: " + user);
        const socket = this.props.socket;
        var msg = JSON.stringify({
            'call': this.props.all_peers[user],
            'becalled': this.props.my_peer
        });
        socket.send(msg);
    }


    render() {
        return (
            <div className="thumb_nail" onClick={this.handleClick.bind(this, this.props.username)}>
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

const mapStateToProps = (state) => {
	return {
		all_peers: state.peers,
        my_peer: state.my_peer,
        peercreation: state.peercreation,
        socket: state.socket
	};
};

const ConnectedUserThumb = connect(mapStateToProps, undefined)(UserThumb);

export default ConnectedUserThumb;
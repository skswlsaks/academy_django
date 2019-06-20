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
            <div className="thumb_nail" onClick={this.handleClick(this.props.username)}>
                <div className="username"> {this.props.username} </div>
            </div>
        );
    }   
}

const mapStateToProps = (state) => {
	return {
		all_peers: state.peer_manager.peers,
        my_peer: state.peer_manager.my_peer,
        peercreation: state.peer_manager.peercreation,
        socket: state.peer_manager.socket
	};
};

const ConnectedUserThumb = connect(mapStateToProps)(UserThumb);

export default ConnectedUserThumb;
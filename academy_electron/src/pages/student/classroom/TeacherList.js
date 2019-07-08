import React from "react";

import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Media
} from "reactstrap";

import { Mic, MicOff, VolumeX, Volume2 } from "react-feather";

import avatar1 from "../../../assets/img/avatars/avatar.jpg";
import avatar4 from "../../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../../assets/img/avatars/avatar-5.jpg";

import { countOnlineUsers } from "../../../helpers/countOnlineUsers";

class TeacherList extends React.Component {
    render() {
        const { online_users, currentUsername, connectedTo, connectingTo, notifyTeacher, deaf, muted, muteSound, muteVoice } = this.props;
        const count = countOnlineUsers(online_users, true);
        const users_list = (
            <div>
                {
                    Object.keys(online_users).map((username, index) => {
                        if (username != currentUsername && online_users[username].isTeacher == true) {
                            let status_badge = null;
                            if (connectingTo==username){
                                status_badge = <Badge color="warning" className="float-right">연결중</Badge>
                            }else if(connectedTo==username){
                                status_badge = <Badge color="info" className="float-right">연결됨</Badge>
                            }
                            return (
                                <div key={index}>
                                    <Media>
                                        <img
                                            src={avatar1}
                                            width="84"
                                            height="84"
                                            className="rounded-circle mr-2"
                                            alt={username}
                                            onClick={()=>{notifyTeacher(username)}}
                                        />
                                        <Media body>
                                            {status_badge}
                                            <strong>{online_users[username].first_name + ' ' + online_users[username].last_name}</strong>
                                            <br />
                                            <small className="text-muted">Some teacher info</small>
                                            <br />
                                        </Media>
                                    </Media>
                                    <hr />
                                </div>
                            );
                        }
                    })
                }
            </div>
        );

        return (
            <Card className="flex-fill w-100">
                <CardHeader>
                    {/* <Badge color="primary" className="float-right">3</Badge> */}
                    <CardTitle tag="h5" className="mb-0">Online Teachers</CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        (count > 0) ? users_list : <div><p>No online teachers</p><hr /></div>
                    }
                   
                    { deaf ? <VolumeX onClick={() => { muteSound(false) }} className="feather-md text-info float-right" />
                    : <Volume2 onClick={() => { muteSound(true) }} className="feather-md text-info float-right" /> }
                    { muted ? <MicOff onClick={() => { muteVoice(false) }} className="feather-md text-danger float-right mr-3" />
                    : <Mic onClick={() => { muteVoice(true) }} className="feather-md text-success float-right mr-3" /> }
                </CardBody>
            </Card>
        );
    }
}

export default TeacherList;

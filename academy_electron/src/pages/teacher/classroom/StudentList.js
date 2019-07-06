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

import avatar1 from "../../../assets/img/avatars/avatar.jpg";

import { countOnlineUsers } from "../../../helpers/countOnlineUsers";

class StudentList extends React.Component {
    render() {
        const { online_users, currentUsername, connectedTo, callUser } = this.props;
        const count = countOnlineUsers(online_users, false);
        const users_list = (
            <div>
                {
                    Object.keys(online_users).map((username, index) => {
                        if (username != currentUsername && online_users[username] == false) {
                            return (connectedTo == username) ? (
                                <div key={index}>
                                    <Media>
                                        <img
                                            src={avatar1}
                                            width="84"
                                            height="84"
                                            className="rounded-circle mr-2"
                                            alt={username}
                                            onClick={()=>{callUser(username)}}
                                        />
                                        <Media body>
                                            <Badge color="info" className="float-right">연결됨</Badge>
                                            <strong>{username}</strong>
                                            <br />
                                            <small className="text-muted">Python | Level 4 | Inheritence</small>
                                            <br />
                                        </Media>
                                    </Media>
                                    <hr />
                                </div>
                            ) : (
                                <div key={index}>
                                    <Media>
                                        <img
                                            src={avatar1}
                                            width="84"
                                            height="84"
                                            className="rounded-circle mr-2"
                                            alt={username} 
                                            onClick={()=>{callUser(username)}}
                                        />
                                        <Media body>
                                            <strong>{username}</strong>
                                            <br />
                                            <small className="text-muted">Python | Level 4 | Inheritence</small>
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
                    <CardTitle tag="h5" className="mb-0">Online Students</CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        (count > 0) ? users_list : <div><p>No online students</p><hr /></div>
                    }
                    <Button color="success" block>Send Task</Button>
                </CardBody>
            </Card>
        );
    }
}

export default StudentList;

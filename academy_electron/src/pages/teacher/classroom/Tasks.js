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

import docs from '../../../documents/docs';

class Tasks extends React.Component {
    render() {
        //const { online_users, currentUsername, connectedTo, connectingTo, callUser } = this.props;
        const task_list = (
            <div>
                {
                    Object.keys(docs).map((taskLabel, index) => {
                        return (
                            <div key={index}>
                                <Media>
                                    <Media body>
                                        <strong>{taskLabel}</strong>
                                        <br />
                                    </Media>
                                </Media>
                                <hr />
                            </div>
                        );
                    })
                }
            </div>
        );

        return (
            <Card className="flex-fill w-100">
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0">Tasks</CardTitle>
                </CardHeader>
                <CardBody>
                    { task_list }
                </CardBody>
            </Card>
        );
    }
}

export default Tasks;

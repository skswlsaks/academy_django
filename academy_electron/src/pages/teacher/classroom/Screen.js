import React from "react";
import { Maximize, Mic, MicOff, VolumeX, Volume2 } from "react-feather";
import "../../../assets/css/Screen.css";

import { Badge, Card, CardBody, CardHeader, CardTitle, CardFooter } from "reactstrap";

const Screen = (props) => {
    return (
        <Card className="flex-fill w-100">
            <CardHeader>
                {/* <Badge color="primary" className="float-right">LIVE</Badge> */}
                <CardTitle tag="h5" className="mb-0">Student Screen</CardTitle>
            </CardHeader>
            <CardBody>
                <audio id="localAudio" autoPlay muted ref={audio => (props.setLocalAudio(audio))} />
                <video className="student-screen" id="remoteVideo" autoPlay playsInline 
                    ref={video => (props.setRemoteVideo(video))}
					onClick={props.handleMouseClick}
					onMouseMove={props.handleMouseMoveThrottled} controls={false} 
                    muted={props.deaf} />
            </CardBody>
            <CardFooter>
                <Maximize onClick={props.openFullscreen} className="feather-md text-primary float-right" />
                { props.muted ? <MicOff onClick={() => { props.muteVoice(false) }} className="feather-md text-danger float-left" />
                : <Mic onClick={() => { props.muteVoice(true) }} className="feather-md text-success float-left" /> }
                { props.deaf ? <VolumeX onClick={() => { props.muteSound(false) }} className="feather-md text-info float-left ml-3" />
                : <Volume2 onClick={() => { props.muteSound(true) }} className="feather-md text-info float-left ml-3" /> }
            </CardFooter>
        </Card>
  );
};

export default Screen;
import React, {  useState, useRef } from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {loginActionCreator, login_action_creator} from '../redux/login_action';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'



const socket = io.connect("http://localhost:3001");

function VoiceModal(props) {

    const recorderControls = useAudioRecorder();
    const [url, setUrl] = useState("");
    const audio = useRef(null);

    const addAudioElement = (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            setUrl(reader.result);
        }
        audio.current.controls = true;
    };

    const deleteAudio = (e) => {
        e.preventDefault();
        setUrl("");
        
    }

    const uploadAudio = (e) => {
        e.preventDefault();
        socket.emit("send_mess", {name: props.user.name, text: null, room_code: props.roomSelected.room_code, img: null, voice: url});
        props.closeVoiceModal();
        
    }

    return (
        <div className='z-10 w-full h-full bg-black absolute bg-opacity-50'>
            <div className='bg-gray-300 w-2/6 min-w-fit max-h-fit rounded-sm absolute left-1/3 flex flex-col top-1/3'>
                <div className="flex p-2">
                    <div className="flex-1"></div>
                    <button onClick={props.closeVoiceModal}>&#10006;</button>
                </div>
                <div className='px-5 pb-5'>
                    <div className='mb-2 flex flex-col justify-center items-center'>
                        <AudioRecorder 
                            onRecordingComplete={(blob) => addAudioElement(blob)}
                            recorderControls={recorderControls}
                        /><br/>
                        <audio style={{display: !url && "none"}} src={url} ref={audio}/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <button className="border border-slate-700 text-gray-700 p-2 rounded-md" onClick={deleteAudio}>Delete</button>
                        <button className="rounded-md bg-slate-700 border border-slate-700  text-white p-2" onClick={uploadAudio}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = state => {
    return {
        user: state.login_reducers.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: user => dispatch(login_action_creator(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceModal);

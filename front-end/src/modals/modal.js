import React, {useState} from 'react';
import {connect} from 'react-redux';
import axios from '../axios/axios';
import {loginActionCreator, login_action_creator} from '../redux/login_action';
import {room_config_action_creator} from '../redux/room_action';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function Modal(props) {

    const [input, setInput] = useState("");
    const [mess, setMess] = useState("");

    const handleCreateButton = async () => {
        let tempUser = {
            _id: props.user._id,
            name: props.user.name,
            password: props.user.password,
            status: true
        }
        await axios.post("/room/createroom", {room_name: input, 
            user: tempUser});
        const req = await axios.post("/room/rooms", {userid: props.user._id});
        props.config_room(req.data);
        props.closeModal();
    }

    const handleJoinButton = async() => {
        let tempUser = {
            _id: props.user._id,
            name: props.user.name,
            password: props.user.password,
            status: true
        }
        const res = await axios.post("/room/joinroom", {room_code: input.toUpperCase(), user: tempUser});
        if(res.data.mess !== "") {
            setMess(res.data.mess);

        }
        else {
            socket.emit("joinroom", {room_code: input.toUpperCase()});
            const req = await axios.post("/room/rooms", {userid: props.user._id});
            props.config_room(req.data);
            props.closeModal();
        }
    }

    return (
        <div className='z-10 w-full h-full bg-black absolute bg-opacity-50'>
            <div className='bg-gray-300 rounded-sm absolute top-1/2 left-1/2 flex flex-col p-3'>
                <div className='flex mb-2'>
                    <div className='flex-1'></div>
                    <button onClick={props.closeModal}>&#10006;</button>
                </div>
                <div className='flex flex-col'>
                    {mess !== "" && (<p className='text-sm text-red-600 font-semibold mb-1'>{mess}</p>)}
                    <input type="text" onChange={(e) => setInput(e.target.value)} value={input} required className="border border-gray-500 rounded-sm p-1 mb-2 bg-gray-200" placeholder={props.type === "create" ? 'Room Name' : 'Room Code'}/>
                    {props.type === "create" ? (<button onClick={handleCreateButton} className='bg-gray-600 text-white font-semibold p-2 rounded-sm'>Create Room</button>) :
                    (<button className='bg-gray-600 text-white font-semibold p-2 rounded-sm'onClick={handleJoinButton}>Join Room</button>)}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        user: state.login_reducers.user,
        rooms: state.room_reducers.rooms
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: user => dispatch(login_action_creator(user)),
        config_room: rooms => dispatch(room_config_action_creator(rooms))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
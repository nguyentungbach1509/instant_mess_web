import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from './axios/axios';
import './messpage_animation.css';
import {connect} from 'react-redux';
import {loginActionCreator, login_action_creator} from'./redux/login_action';
import {room_config_action_creator} from './redux/room_action';
import logo from './icons/logo.png';
import join_icon from './icons/join.png';
import add_icon from './icons/add.png';
import logout_icon from './icons/logout.png';
import addimg_icon from './icons/add-image.png';
import voicemess_icon from './icons/voice-message.png';
import Modal from './modals/modal';
import UploadImgModal from './modals/upload_img_modal';


const socket = io.connect("http://localhost:3001");

function MessPage(props) {

    const [mess, setMess] = useState([]);
    const [text, setText] = useState("");
    const scrollBottom = useRef(null);
    const [hide, setHide] = useState(true);
    const [openModal, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [roomSelected, setRoomSelected] = useState(false);
    const [members, setMemebers] = useState([]);
    const [typing, setTyping] = useState([]);
    const [addimg, setAddImg] = useState(false);
    

    const sendMess = (e) => {
        e.preventDefault();
        setText("");
        socket.emit("send_mess", {name: props.user.name, text: text, room_code: roomSelected.room_code});
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        socket.emit("mess_typing", {room_code: roomSelected.room_code, name: props.user.name});

    }

    const selectRoom = async (room) => {
        socket.emit("joinroom", {room_code: room.room_code});
        setRoomSelected(room);
        const mess_res = await axios.post("/mess", {room_code: room.room_code});
        setMess(mess_res.data);
        const mem = await axios.post("/members", {roomid: room._id});
        setMemebers(mem.data);
    }

    const closeModal = () => {
        setOpen(false);
    }

    const createModal = () => {
        setOpen(true);
        setType("create");
    }

    const closeModalImg = () => {
        setAddImg(false);
    }

    const openModalImg = (e) => {
        e.preventDefault();
        setAddImg(true);
    }
    
    const joinModal = () => {
        setOpen(true);
        setType("join");
    }

    const logoutHandle = async () => {
        const req = await axios.post("/user/logout", {user: props.user});
        setHide(true);
        socket.emit("status_change", props.user);
        props.login(null);
    }

    useEffect(() => {
        socket.on("return_mess", (data) => {
         setTyping(data.typing_users);
            setMess(data.messages);

        });
        scrollBottom.current?.scrollIntoView({behavior: 'smooth'});
    },[mess]);

    useEffect(() => {
        async function getRooms() {
            const req = await axios.post("/room/rooms", {userid: props.user._id});
            props.config_room(req.data);

        }

        getRooms();

    }, [props.user]);

    useEffect(() => {
        socket.on("update_room_members", (data) => {
         setMemebers(data.members);
        });
    }, [socket]);

    useEffect(() => {
        socket.on("room_status_update", (data) => {
            if(roomSelected){
                const tempRoom = data.rooms.filter((room) => room.room_code === roomSelected.room_code);
                setMemebers(tempRoom[0]?.members);
            }
        })
    }, [socket, roomSelected]);

    useEffect(() => {
        socket.on("typing", (data) => {
            setTyping(data.typing_users);
        });
        scrollBottom.current?.scrollIntoView({behavior: 'smooth'});
    }, [typing]);

    return (
        <div className='flex h-full w-full '>
            <div className='flex-none bg-gray-700 h-full w-16 p-2'>
                <div className='w-full bg-gray-600 p-1 rounded-md'>
                        <img src={logo} className='w-full'/>
                </div>
                
                <div className='flex-grow overflow-y-auto h-4/6 mt-2'>
                    {props.rooms.map((room) => (
                        <div key={room.room_code} onClick={() => selectRoom(room)} style={{backgroundColor: room.room_code === roomSelected.room_code ? "#4b5563" : "#6b7280", border: room.room_code===roomSelected.room_code && "1px solid white" }} title={room.room_name} className='w-full text-center h-max rounded-md p-1.5 my-2 cursor-pointer'>
                            <p style={{color: room.room_code===roomSelected.room_code ? "white" : "#9ca3af"}} className='font-extrabold text-3xl m-0 transition-all'>{room.room_name[0]}</p>
                        </div>
                    ))}
                </div>
                <div className='border-t-2 border-t-gray-500 h-max flex-col items-center'>
                    <div className='rounded-md p-0.5 bg-gray-500 mt-2 cursor-pointer' onClick={createModal}>
                        <img src={add_icon} title='Create Room'/>
                    </div>
                    <div className='rounded-md p-0.5 bg-gray-500 mt-2 cursor-pointer' onClick={joinModal}>
                        <img src={join_icon} title='Join Room'/>
                    </div>
                    <div className='rounded-md p-0.5 bg-gray-500 mt-2 cursor-pointer' onClick={logoutHandle}>
                        <img src={logout_icon} title='Logout'/>
                    </div>
                </div>
            </div>
            {roomSelected ? (<><div className='w-full h-full ' style={{transition: "margin-right .5s"}}>
                <div style={{height: "8%"}} className='border-b-2 border-b-gray-800 items-center flex px-4'>
                    <h2 className='flex-1 text-slate-200 font-bold text-xl'>{roomSelected.room_name}</h2>
                    <button className='text-lg' onClick={() => setHide(false)}>&#9776;</button>
                </div>
                <div style={{height:"92%"}}>
                    <div className='w-full h-5/6 p-4 overflow-y-auto'>
                        {
                            mess.map((m, i) => (
                                <div key={i} style={{width:"max-content", marginLeft: props.user.name === m.name && "auto", marginBottom:"10px"}}>
                                    <p className='text-gray-800 font-medium text-sm'style={{textAlign: props.user.name === m.name && "right"}}>{m.name}</p>
                                    <div style={{backgroundColor: props.user.name === m.name ? "greenyellow" : "blue", borderRadius:"8px", width:"fit-content", 
                                    padding:"10px 15px"}}>
                                        {!m.text ?  (<img src={m.img}/>) : m.text}
                                    </div>
                                </div>
                            ))
                        }
                        {typing.filter(e => e.room_code === roomSelected.room_code).length > 0 && 
                            typing.filter(e => e.room_code === roomSelected.room_code && e.name !== props.user.name).map((m, i) => (
                                <div key={i} className='w-max mb-2.5'>
                                    <p className='text-gray-800 font-medium text-sm'style={{textAlign: props.user.name === m.name && "right"}}>{m.name}</p>
                                    <div className="typing__mess__container"><div></div><div></div><div></div></div>
                                </div>
                            ))
                        }
                        <div ref={scrollBottom}/>
                    </div>
                    <div className='p-2 h-1/6 bg-gray-600'>
                        <form className='flex items-center h-full '>
                            <div className=' h-full border rounded-sm border-gray-800' style={{flexGrow: "15"}}>
                                <textarea className='resize-none w-full h-full bg-gray-600 rounded-sm focus:outline-none' type="text" onChange={handleTyping} value={text}/><br/>
                            </div> 
                            <div className="h-full ml-1.5" style={{flexGrow:"0.25"}}>
                                <button className='h-full w-full p-0.5 text-gray-800 bg-slate-400 border border-gray-800 rounded-sm' type="submit" onClick={sendMess}>
                                   Send
                                </button>
                            </div>
                            <div className="h-full ml-1.5 flex flex-col" style={{flexGrow:"0.25"}}>
                                <button className='p-0.5 rounded-sm text-gray-800  flex justify-center h-1/2' onClick={openModalImg} title="Upload Image">
                                    <img className="object-cover h-10 w-10 aspect-square" src={addimg_icon}/>
                                </button>
                                <button className='p-0.5 rounded-sm text-gray-800  flex justify-center h-1/2' title="Voice Chat">
                                    <img className="object-cover h-10 w-10 aspect-square" src={voicemess_icon}/>
                                </button>
                            </div> 
                            
                        </form>
                    </div>
                </div>
            </div>
            <div className='h-full overflow-hidden z-10 bg-gray-600 border-l-2 border-l-gray-800' 
            style={{transition:"0.5s", width: hide ? "0" : "500px"}}>
                <div className='flex items-center px-4 ' style={{height: "8%"}}>
                    <button className='text-lg' onClick={() => setHide(true)}>&#10006;</button>
                    <div className='flex-1 text-center'>
                        <h2 className='text-slate-200 font-bold text-3xl' >Room Members</h2>
                    </div>
                </div>
                <div style={{height:"92%"}}>
                    <div className='h-5/6 overflow-y-auto m-5'>
                        {
                            members.map((m) => (
                                <div key={m._id} className='flex mb-1 items-center justify-between rounded-md p-3 text-white'style={{backgroundColor: m.status ? "#22c55e" : "#6b7280"}}>
                                    <h2>Name: {m.name}</h2>
                                    <h2>Status: {m.status ? (<span>Online</span>): (<span>Offline</span>)}</h2>
                                </div>
                            ))
                        }
                    </div>
                    <div className='h-1/6 flex justify-center'>
                        <h2 className='text-slate-200 font-bold text-2xl'>ROOM CODE: {roomSelected.room_code}</h2>
                    </div>
                </div>
            </div></>) : (<div className='w-full h-full border-l-2 border-l-gray-900 flex items-center justify-center px-2'>
                <h2 className='text-gray-300 text-2xl font-semibold'>To start chatting, create a room, join a room or select a room please</h2>
            </div>)}
            
            {openModal && (<Modal type={type} closeModal={closeModal}/>)}
            {addimg && (<UploadImgModal closeModalImg={closeModalImg} roomSelected={roomSelected}/>)}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.login_reducers.user,
        rooms: state.room_reducers.rooms
    }
};

const mapDispatchToProps = dispatch => {
    return {
        config_room: rooms => dispatch(room_config_action_creator(rooms)),
        login: user => dispatch(login_action_creator(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessPage);
import React,{useState} from "react";
import io from 'socket.io-client';
import axios from '../axios/axios';
import {connect} from 'react-redux';
import {loginActionCreator, login_action_creator} from '../redux/login_action';

const socket = io.connect("http://localhost:3001");

function Login(props) {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    
    const [warning, setWarning] = useState();
    const [isRegister, setIsRegister] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault();
        const req = await axios.post("/user/login", {name:name, password:password});
        if(req.data.name) {
            socket.emit("status_change", req.data);
            props.login(req.data);
            setWarning({alert:"Successful", type:1});
        }
        else {
            setWarning(req.data);
        }

    };

    const onSignup = async (e) => {
        e.preventDefault();
        const req = await axios.post("/user/signup", {name: name, password: password});
        if(req.data.type === 1) {
            setIsRegister(false);
            setName("");
            setPassword("");
        }
        setWarning(req.data);
    }



    return(
        <div className="absolute bg-white top-10 left-1/2 -translate-x-1/2 translate-y-1/2 border border-slate-500 rounded-sm p-5 max-h-max shadow-xl">
            <form>
                <h2 className="text-2xl font-bold text-center mb-5">{isRegister ? "Sign-up" : "Login"}</h2>
                {warning && (<p className="text-sm text-teal-500 mb-1">{warning.alert}</p>)}
                <div>
                    <input className="border-slate-300 border rounded-sm p-2 mb-3 w-full" placeholder="Username" type="text"onChange={(e) => setName(e.target.value)} value={name}/><br/>
                    <input className="border-slate-300 border rounded-sm p-2 mb-3 w-full" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                </div>
                {!isRegister &&  (<div className="text-right mb-2">
                    <a className="text-sm text-sky-600 underline cursor-pointer" onClick={() => setIsRegister(true)}>Register</a>
                </div>)}
                <div>
                    {isRegister ? (
                        <button className="w-full bg-gray-800 text-white p-2 rounded-sm font-bold hover:bg-transparent hover:bg-gray-700 hover:transition-colors" onClick={onSignup}>Signup</button>
                    ) : (
                        <button className="w-full bg-gray-800 text-white p-2 rounded-sm font-bold hover:bg-transparent hover:bg-gray-700 hover:transition-colors" onClick={onLogin}>Login</button>
                    )}
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.login_reducers.user,
        rooms: state.room_reducers.rooms
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: user => dispatch(login_action_creator(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
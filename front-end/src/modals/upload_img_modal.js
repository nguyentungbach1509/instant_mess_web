import React, {  useState, useRef } from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {loginActionCreator, login_action_creator} from '../redux/login_action';
import Resizer from "react-image-file-resizer";

const socket = io.connect("http://localhost:3001");
const resizeImage = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 400, 400, 'JPEG', 90, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
});

function UploadImgModal(props) {

    const [file, setFile] = useState(null);
    const [originImg, setORiginImg] = useState(null);
    const fileInput = useRef(null);

    const selectImage = (e) => {
        if(e.target.files[0]){
            setORiginImg(e.target.files[0]);
            let readerFile = new FileReader();
           

            readerFile.onload = async function(){
                setFile(readerFile.result);
               
            }

            readerFile.readAsDataURL(e.target.files[0]);
        }
        
    }


    const chooseFileClick = (e) => {
        e.preventDefault();
        fileInput.current.click();
    }

    const closeImageSelection = () => {
        setFile(null);
        props.closeModalImg();
    }

    const uploadImg = async (e) => {
        e.preventDefault();
        const img = await resizeImage(originImg);
        socket.emit("send_mess", {name: props.user.name, text: null, room_code: props.roomSelected.room_code, img: img});
        closeImageSelection();
    }


    return(
        <div className='z-10 w-full h-full bg-black absolute bg-opacity-50'>
            <div className='bg-gray-300 w-2/6 min-w-fit h-4/5 rounded-sm absolute flex left-1/3 flex-col' style={{top: "10%"}}>
                <div className='flex justify-between items-center p-1'>
                    <div className='flex-1 text-center p-1'>
                        <h2 className='text-lg font-semibold'>Image Selection</h2>
                    </div>
                </div>
                <div className='flex flex-col px-2 justify-center items-center h-full'>
                    <div className="h-fit py-2">
                        <form>
                            <input className='hidden' type="file" onChange={selectImage} ref={fileInput}/>
                            <button className='h-full w-fit text-gray-100 bg-slate-500 p-2 border border-slate-500 rounded-md hover:text-gray-500 hover:bg-slate-50 hover:border hover:border-slate-500' onClick={chooseFileClick}>Choose Image</button>
                        </form>
                    </div>
                    <div className='w-96  flex-1' style={{display: !file && "flex", justifyContent: !file && "center", alignItems: !file && "center"}}>
                        {file ? (<div className='object-contain'>
                             <img src={file} className='aspect-square' accept="image/*"/>
                        </div>) : (<h2 className="text-gray-700 font-bold text-3xl">No selected images</h2>)}
                    </div>
                    <div className="h-1/4 w-full flex justify-between items-center px-3">
                        <button className="border border-slate-700 text-gray-700 p-2 rounded-md" onClick={closeImageSelection}>Cancel</button>
                        <button className="rounded-md bg-slate-700 border border-slate-700  text-white p-2" onClick={uploadImg}>Upload</button>
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


export default connect(mapStateToProps, mapDispatchToProps)(UploadImgModal);
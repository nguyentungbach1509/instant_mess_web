import React, { useEffect, useState} from 'react';
import './App.css';
import Login from './loginform/login';
import MessPage from './messpage';
import LoadingPage from './loading/loadingpage';
import {connect} from 'react-redux';
import axios from './axios/axios';
import {loginActionCreator, login_action_creator} from'./redux/login_action';

//

function App(props) {

  axios.defaults.withCredentials = true;
  const[count, setCount] = useState(0);

  useEffect(() => {
    async function reloadPage() {
      const req = await axios.get("/user");
      props.login(req.data);
    };

    reloadPage();

  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if(!props.user) {
        setCount(count => count+0.25);
      }
      else {
        setCount(1);
        clearInterval(interval);
        return;
      }

    }, 1000);
    return () => clearInterval(interval);
  }, [count])

  return (
    <div className='h-screen w-full relative bg-gray-600'>
        {!props.user && count <= 0.25 ? (<LoadingPage/>) : props.user ? (<MessPage/>) : (<Login/>)}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.login_reducers.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      login: user => dispatch(login_action_creator(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

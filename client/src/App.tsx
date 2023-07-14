import React, { useEffect, useContext, useState } from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/response/IUser";
import UserService from "./service/UserService";

function App() {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])


  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (!store.isAuth) {
    return  (
      <LoginForm />
    )
  }

  if (store.isLoading) {
    return  (
      <div>Loading...</div>
    )
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? 'Authorized' : 'Not Authorized'}</h1>
      <h1>{store.user.isActivated ? 'Account approved' : 'Not activated'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      {users.map(user => <div key={user.email}>{user.email}</div>)}
    </div>
  );
}

export default observer(App);

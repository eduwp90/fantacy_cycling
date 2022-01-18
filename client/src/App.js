import './App.scss';
import League from './Pages/League/league';
import Login from './Pages/Login/login';
import Home from './Pages/Home/home';
import { useState, useEffect } from 'react';
import { getAllRiders, changeNameOfTeam, addRider, removeRider, fetchUserRoster, fetchUserData, getTheUsers} from './Services/apiService.js';
// import { io } from "socket.io-client";

import {
  Routes,
  Route,
} from "react-router-dom";


function App() {
  const [riderList, setRiderList] = useState([]);
  const [myRoster, setMyRoster] = useState([]);
  const [userData, setUserData] = useState({});
  const [userList, setUserList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  // const [socket, setSocket] = useState(null);

  // const socket = io();
  // socket.on("connect", () => {
  //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  // });

  // useEffect(() => {
  //   const newSocket = io(`http://${window.location.hostname}:3000`);
  //   setSocket(newSocket);
  //   return () => newSocket.close();
  // }, [setSocket]);

  useEffect(() => {
    getTheUsers().then(result => setUserList(result));
    getAllRiders().then(result => {
      setSearchList(result);
      setRiderList(result);
    });
    fetchUserData(1) //hard-coded userId => {id: 3, name: 'natashajv', team_name: 'aCoolTeam', score: 0, money: 490}
    .then(result => {
      setUserData(result)
      return fetchUserRoster(result.id) })
    .then(result => setMyRoster(result));
  }, []);


  //new use Effect to get REAL user info!
  // const [userMetadata, setUserMetadata] = useState(null);
  // useEffect(() => {
  //   const getUserMetadata = async () => {
  //     const domain = "dev-874owraq.us.auth0.com";
  //     try {
  //       const accessToken = await getAccessTokenSilently({
  //         audience: `https://${domain}/api/v2/`,
  //         scope: "read:current_user",
  //       });
  //       const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       const { user_metadata } = await metadataResponse.json();
  //       setUserMetadata(user_metadata);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   };
  // getUserMetadata();

  // }, [getAccessTokenSilently, user?.sub]);
  //------------end of use effect


  async function changeTeamName (userId, newName) {
    setUserData((prev) => {
      return {id: userId, name: prev.name, team_name: newName, score: prev.score, money: prev.money}
    });
    changeNameOfTeam();
  }

  async function addToRoster (userId, riderId) {
    addRider(userId, riderId)
      .then(result => fetchUserRoster(userId))
      .then(result => setMyRoster(result))
      .then(result => fetchUserData(userId))
      .then(result => setUserData((prev) => {
        return {id: userId, name: prev.name, team_name: prev.team_name, score:prev.score, money: result.money}
      }));
  };

  async function removeFromRoster (userId, riderId) {
    removeRider(userId, riderId)
      .then(result => fetchUserRoster(userId))
      .then(result => setMyRoster(result))
      .then(result => fetchUserData(userId))
      .then(result => setUserData((prev) => {
        return {id: userId, name: prev.name, team_name: prev.team_name, score:prev.score, money: result.money}
      }));
  }



  return (
    <div className="routes_div">
      <Routes >
        <Route path="/login" element={<Login />} />
        <Route path="/home" className="routes_div" element={<Home 
          setSearchList={setSearchList}
          riderList={riderList}
          userData={userData}
          searchList={searchList}
          changeTeamName={changeTeamName}
          myRoster={myRoster}
          addToRoster={addToRoster}
          removeFromRoster={removeFromRoster}
        />} />
        <Route path="league" element={<League 
          userList={userList}
          userData={userData}
        />} />
      </Routes>
    </div>
  );
}

export default App;

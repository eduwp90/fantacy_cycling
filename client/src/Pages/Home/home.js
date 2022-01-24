import './home.scss';
import List from '../../Components/list/list';
import Header from '../../Components/header/header';
import Form from '../../Components/form/form';
import { useState, useEffect } from 'react';
import {
  fetchUserRoster,
  //changeNameOfTeam,
  addRider,
  fetchUserData,
  removeRider,
} from '../../Services/apiService.js';

import { useAuth0 } from '@auth0/auth0-react';

function Home({
  riderList,
  setSearchList,
  searchList,
  booleanObj,
  setBooleanObj,
}) {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [token, setToken] = useState(null);
  const [myRoster, setMyRoster] = useState([]);
  const [userData, setUserData] = useState({});

  const filterList = (query) => {
    if (query) {
      const filteredList = riderList.filter((rider) =>
        rider.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchList(filteredList);
    }
  };

  // useEffect(() => {
  //   console.log(user);
  //   fetchUserData(user.nickname) //hard-coded userId => {id: 3, name: 'natashajv', team_name: 'aCoolTeam', score: 0, money: 490}
  //   .then(result => {
  //     setUserData(result)
  //     return fetchUserRoster(result.id) })
  //   .then(result => setMyRoster(result));
  // }, [])

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.REACT_APP_AUTH0_DOMAIN;
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: 'read:current_user',
        });
        setToken(accessToken);
        fetchUserData(user)
          .then((response) => {
            setUserData(response);
            return fetchUserRoster(response.id);
          })
          .then((result) => {
            setMyRoster(result);
          });
      } catch (err) {
        console.log(err);
      }
    };
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  // async function changeTeamName(userId, newName) {
  //   setUserData((prev) => {
  //     return {
  //       id: userId,
  //       name: prev.name,
  //       team_name: newName,
  //       score: prev.score,
  //       money: prev.money,
  //     };
  //   });
  //   changeNameOfTeam();
  // }

  async function addToRoster(userId, riderId) {
    const res = await addRider(userId, riderId, token);
    fetchUserData(userData).then((result) =>
      setUserData((prev) => {
        return {
          id: prev.id,
          nickname: prev.nickname,
          email: prev.email,
          score: prev.score,
          money: result.money,
        };
      })
    );
    fetchUserRoster(userData.id).then((result) => {
      setMyRoster(result);
    });
    return res;
  }

  async function removeFromRoster(userId, riderId) {
    await removeRider(userId, riderId, token);
    fetchUserData(userData).then((result) =>
      setUserData((prev) => {
        return {
          id: prev.id,
          nickname: prev.nickname,
          email: prev.email,
          score: prev.score,
          money: result.money,
        };
      })
    );
    fetchUserRoster(userData.id).then((result) => {
      setMyRoster(result);
    });
  }

  return (
    <>
      {isLoading ? <>loading...</> : null}

      {isAuthenticated ? (
        <div className='home_page'>
          <>
            <Header userData={userData} link_route={'league'} />
          </>
          <div className='body_home_page'>
            <div className='my_rider_list'>
              <h1 className='list_title'>{user.nickname}</h1>
              <List
                mine={true}
                riderList={myRoster}
                addToRoster={addToRoster}
                removeFromRoster={removeFromRoster}
                user={user}
                userData={userData}
                booleanObj={booleanObj}
                setBooleanObj={setBooleanObj}
              />
            </div>

            <div className='full_rider_list_heading'>
              <h1 className='list_title'>pro cycling riders</h1>
              <Form filterList={filterList} />
            </div>
            <div className='full_rider_list'>
              <List
                mine={false}
                riderList={searchList}
                addToRoster={addToRoster}
                removeFromRoster={removeFromRoster}
                user={user}
                userData={userData}
                booleanObj={booleanObj}
                setBooleanObj={setBooleanObj}
              />
            </div>
          </div>
        </div>
      ) : (
        !isLoading && !isAuthenticated && <h2>User not authenticated</h2>
      )}
    </>
  );
}

export default Home;

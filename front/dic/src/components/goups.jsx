import styles from  './goup.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom'

const Card = ({ name }) => {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <span>{name}</span>
      </div>
    </div>
  );
};

const Group = () => {

  const [groups, setGroups] = useState([]);
useEffect(()=>{

  const fetchGroups = async () => {
    const token = localStorage.getItem('token');
    if(token){ 
    try {
      const response = await  axios.get('http://localhost:1111/AllGroup', { headers:  { Authorization: `Bearer ${token}` }  });
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о группах:', error);
    }
  }
  };
  fetchGroups();
}, [])
  return (
  <>
    <div className={styles.container}>
      {groups.map((group) => (
      <NavLink to = {`/words/${group._id}`}>   <Card key={group._id} name={group.name} />   </NavLink> 
      ))}
    </div>
  <NavLink to = '/createGroup'>        <button className = {styles.btn}>Создать группу слов</button>   </NavLink>
    </>
  );
};

export default Group;

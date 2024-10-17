import styles from './Header.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useLocation } from 'react-router-dom';
const Header = () => {
  const [activeItem, setActiveItem] = useState('');
  const [userName, setUserName] = useState('');
  const location = useLocation(); // Использование useLocation для отслеживания текущего пути

  useEffect(() => {
    // Функция для установки активного элемента на основе текущего пути
    const setActiveItemBasedOnLocation = () => {
      const path = location.pathname; // Получение текущего пути
      // Условия для установки активного элемента на основе path
      if (path.includes('/addWords')) {
        setActiveItem('Добавить Слова');
      } else if (path === '/rules') {
        setActiveItem('Правила');
      } else if (path === '/groups') {
        setActiveItem('Группы');
      } else if (path === '/addRules') {
        setActiveItem('Добавить правила');
      } else if (path === '/profile') {
        setActiveItem('Профиль');
      } else if (path === '/game') 
      {
        setActiveItem('Игра');
      } 
      else if (path === '/Allusers') 
      {
        setActiveItem('Другие пользователи');
      }
      else {
        setActiveItem('Группы'); // Установите по умолчанию или оставьте пустым, если URL не совпадает
      }
    };

    setActiveItemBasedOnLocation();
  }, [location]); // Добавьте location в массив зависимостей, чтобы useEffect запускался при каждом изменении пути

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:1111/user', { headers: { Authorization: `Bearer ${token}` } });
          setUserName(response.data.name);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя', error);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menu}>
          {/* Используйте Link или NavLink для навигации */}
        <Link to = "/main">    <div onClick={() => setActiveItem('Группы')} className={activeItem === 'Группы' ? styles.active : ''}>Группы</div>    </Link>
          <div onClick={() => setActiveItem('Правила')} className={activeItem === 'Правила' ? styles.active : ''}>Правила</div>
          <div onClick={() => setActiveItem('Добавить правила')} className={activeItem === 'Добавить правила' ? styles.active : ''}>Добавить правила</div>
          <div onClick={() => setActiveItem('Профиль')} className={activeItem === 'Профиль' ? styles.active : ''}>Профиль</div>
        <Link to = "/game">        <div onClick={() => setActiveItem('Игра')} className={activeItem === 'Игра' ? styles.active : ''}>Игра</div>   </Link>
          <div onClick={() => setActiveItem('Другие пользователи')} className={activeItem === 'Другие пользователи' ? styles.active : ''}>Другие пользователи</div>
        </div>
        <div className={styles.userName}>{userName}</div>
      </header>
    </>
  );
};

export default Header;
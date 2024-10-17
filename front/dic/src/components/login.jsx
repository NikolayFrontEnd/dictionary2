import styles from './a.module.css'
import  './cards.css';
import React, { useState} from 'react';
import axios from 'axios';
import {NavLink, useNavigate} from 'react-router-dom'
import { FiAlertTriangle } from "react-icons/fi";
const Login = () => {

  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
console.log( 'Почта:', formData.email, "." ,"Пароль:", formData.password);
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:1111/login', formData);
    console.log('Login successful', response.data);
    localStorage.setItem('token', response.data.token);
    navigate("/main");
  } catch (error) {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
    console.error('Login failed', error.response.data);
  }
};
return(
<div className = {styles.cont}> 
<div className = {styles.block}>
<div className = {styles.rightBlock}>
Добро пожаловать снова!
</div>
<form className = {styles.leftBlock}onSubmit={handleSubmit}>   
<input 
        type = "email"
  placeholder='Почта'
  name="email"
  value={formData.email}
  onChange={handleChange}
  required
/> 
<input 
          type="password"
          placeholder="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
/> 
  <button className = {styles.btn} type = 'submit'> Вход  </button>
 <NavLink to = "/" className = {styles.link}> Вы еще не зарегистрировались? </NavLink> 
</form> 
</div>


<div className={styles.bottonBlock}>
      {showError && (
        <div className="toast error">
          <FiAlertTriangle className="iconError" />
          <p>
            <span>Ошибка!</span> Вы ввели неправильный логин или пароль!
          </p>
        </div>
    
      )}
    </div>
</div>
);
};
export default Login;
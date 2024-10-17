
import styles from './a.module.css'
import React, { useState} from 'react';
import axios from 'axios';
import {NavLink, useNavigate} from 'react-router-dom'
const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
console.log('Имя:',formData.name, "." , 'Почта:', formData.email, "." ,"Пароль:", formData.password);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:1111/register', formData);
    console.log('Registration successful', response.data);
    localStorage.setItem('token', response.data.token);
      navigate("/main"); 

  } catch (error) {
    console.error('Registration failed', error.response.data);
 
  }
};
return(

  <div>     
    <div className = {styles.cont}>   
<div className = {styles.block}>
<div className = {styles.rightBlock}>
 Пожалуйста зарегистрируйтесь!
</div>
<form className = {styles.leftBlock}onSubmit={handleSubmit}>   
<input 
  type = "text"
  placeholder='Имя'
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
/> 
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
  <button className = {styles.btn} type = 'submit'> Регистрация  </button>
  <NavLink to = "/login"  className = {styles.link}> Вы уже  зарестирировались? </NavLink>
</form> 
</div>
</div>
</div>
);
};
export default SignUpForm;
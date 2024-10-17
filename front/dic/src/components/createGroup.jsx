import { NavLink,useNavigate } from 'react-router-dom';
import styles from './createGroupStyle.module.css';
import axios from 'axios';
import Header from './header';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useState } from 'react';
const CreateGroup = () => {
const navigate = useNavigate();
const [name, setName] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await axios.post('http://localhost:1111/addGroup', { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Семестр успешно добавлен');
            setName(''); 
            navigate("/main");
        } catch (error) {
            console.error('Ошибка при добавлении семестра', error);
        }
    }
};

    return (
      <>
        <Header />
        <NavLink to='/main'> <button className={styles.btn2}><FaLongArrowAltLeft className="arrow-icon" /> Вернуться на главную</button> </NavLink>
        <div className={styles.container}>
          <div className={styles.frame}>
            <form className={styles.form} onSubmit={handleSubmit} >
              <input className={styles.input} type="text" placeholder="Введите название группы..." 
                   name="name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
              />
              <button className={styles.btn} type = 'submit'>Создать группу слов</button>
              
            </form>
          </div>
        </div>
      
      </>
    );
  }
  
  export default CreateGroup;
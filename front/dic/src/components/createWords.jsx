
import {useNavigate,useParams} from 'react-router-dom';
import styles from './createGroupStyle.module.css';
import axios from 'axios';
import Header from './header';
import { useState } from 'react';
const CreateWord = () => {
  const { groupId } = useParams();
const navigate = useNavigate();
const [name, setName] = useState('');
const [translate, settranslate] = useState('');
const handleSubmit = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await axios.post('http://localhost:1111/addWord', { name, translate,groupId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Слово успешно добавлено');
            setName(''); 
            settranslate('');
            navigate(`/words/${groupId}`);
        } catch (error) {
            console.error('Ошибка при добавлении слова', error);
        }
    }
};
    return (
      <>
        <Header />
        
        <div className={styles.container}>
          <div className={styles.frame}>
            <form className={styles.form} onSubmit={handleSubmit} >
              <input className={styles.input} type="text" placeholder="Слово" 
                   name="name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
              />
                           <input className={styles.input} type="text" placeholder="Перевод" 
                   name="translate"
                   value={translate}
                   onChange={(e) => settranslate(e.target.value)}
                   required
              /> 
              <button className={styles.btn} type = 'submit'>Добавить слово</button>
            </form>
          </div>
        </div>
      </>
    );
  }
  export default CreateWord;
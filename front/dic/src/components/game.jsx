import Header from "./header";
import styles from "./game.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";



const GameEnglishWords = () =>{
  const [words, setWords] = useState([]);


  const [start,setStart] = useState(false);
const [result, setResult] = useState(false);

  const [translations, setTranslations] = useState({});
  const [buttonVisibility, setButtonVisibility] = useState({});
  const translationsArray = useRef([]);

  const StartGame = () => {
    setResult(false);
    if (start) {
      setWords([]);
    }
    setStart(!start);
    // Сброс состояния при завершении игры
    if (!start) {
  
      setTranslations({});
      setButtonVisibility({});
      translationsArray.current = [];
    }
  };
 
useEffect(()=>{

  if(start === true) { 

const fetchData = async() =>{
const token = localStorage.getItem('token');
if(token){
  try{
    const response = await axios.get("http://localhost:1111/allWords", {headers: {Authorization: `Bearer ${token}`}});
    setWords(response.data)
  }catch(err){
    console.log("Ошибки при получении слов!!",err)
  }
}
}
fetchData();



}



},[start])


/* useEffect(()=>{

const checkAnswer = async ()=>{
const token = localStorage.getItem('token');
if(token){
  try{
const response = await axios.post("http://localhost:1111/checkAnswers",translationsArray ,{header:{Authorization:`Bearer ${token}`}});

  }catch(err){
    console.log("Ошибки при проверки слов!!",err)
  }
}
}
checkAnswer();
}) */

const handleChange = (wordId, e) => {
  const { value } = e.target;
  setTranslations(prev => ({
    ...prev,
    [wordId]: value,
  }));
};

const handleSubmit = (wordId, e) => {
  e.preventDefault();
  const userTranslation = translations[wordId] || '';
  translationsArray.current.push({ wordId, userTranslation });
  setButtonVisibility(prev => ({
    ...prev,
    [wordId]: false,
  }));
};

/* const checkTranslations = () => {
  console.log(translationsArray.current);
  setStart(false);
  setTimeout(()=>{
    setResult(false);
  },10000)
  setResult(true);
  setWords([]);
}; */

const [score, setScore] = useState(null);
const [mistake, setMistake] = useState(null);
const [incorrectWords, setIncorrectWords] = useState([]);
const checkTranslations = async () => {
  const token = localStorage.getItem('token');
  setStart(false);
  setTimeout(()=>{
    setResult(false);
  },10000)
  setResult(true);
  setWords([]);
  console.log(translationsArray.current);
  if (token) {
    try {
      // Подготовка данных для отправки
      const payload = {
        answers: translationsArray.current,
      };

      // Отправка данных с токеном
      const response = await axios.post("http://localhost:1111/checkAnswers", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Ответ сервера:", response.data);
      setMistake(response.data.mistake);
      setScore(response.data.score);
      setIncorrectWords(response.data.words);
    } catch (err) {
      console.log("Ошибки при проверке слов:", err);
    }
  }
};


    return (
      <>
      <Header />
      <div>
        <button className={styles.btnCircle} onClick={StartGame}>{start ? 'Завершить игру' : 'Начать игру'}</button>
      </div>

<div 
 style = {{display: result ? "flex" : "none"}} 
className = {styles.Blockcard}
>  
<div className = {styles.cardResult}>    
<div>  Правильных ответов:  {score}</div>  
<div className = {styles.mist}>  Ошибок: {mistake}</div> 
<div>Слова, в которых были допущены ошибки:</div> 
          <div>
            {incorrectWords.map((word, index) => (
              <div key={index}>
              <p className = {styles.trans}>Ваш перевод: {word.incorrectTranslation}</p>
              <p className = {styles.Righttrans}>Правильный перевод: {word.correctTranslation}</p>
              </div>
            ))}
          </div>
          </div>
</div>

      <div className={styles.container}>
        {words.map((word) => (
          <form key={word._id} className={styles.mainBlok} onSubmit={(e) => handleSubmit(word._id, e)}>
            <div className={styles.leftBlok}></div>
            <div className={styles.rightBlok}>
              <div className={styles.wordR}>Слово: {word.name}</div>
              <input
                className={styles.inputTranslate}
                placeholder="Перевод:"
                onChange={(e) => handleChange(word._id, e)}
                value={translations[word._id] || ''}
              />
              <button className = {styles.btn30}
                type="submit"
                style={{ display: buttonVisibility[word._id] === false ? 'none' : 'block' }}
              >
                ОТВЕТИТЬ
              </button>
            </div>
          </form>
        ))}
        {start && (
          <button className = {styles.btn21} onClick={checkTranslations}>
            Проверить правильность
          </button>
        )}
      </div>
        </>
    )
}
export default GameEnglishWords;

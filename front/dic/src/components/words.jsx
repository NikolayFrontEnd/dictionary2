import './cards.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import { useParams, Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";

const Cards = () => {

    const { groupId } = useParams();
    console.log(groupId);
    const [words, setWords] = useState([]);

    useEffect(() => {
        const fetchWords = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:1111/words/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
                setWords(response.data);
            } catch (error) {
                console.error('Ошибка при получении слов', error);
            }
        };
        fetchWords();
    }, [groupId]);

    return (
        <>
            <Header />
            <div className="maincontainer">
                {words.map((word) => (
                    <div key={word._id} className="thecard">
                        <div className="thefront"><h1>{word.name}</h1></div>
                        <div className="theback"><h1>{word.translate}</h1></div>
                    </div>
                ))}
            </div>
        <div className = "lastsection">     
         <Link to = "/main">         <button className="custom-button">
      <FaLongArrowAltLeft className="arrow-icon" />
      Вернуться
    </button>   </Link> 

    <Link to = {`/addWords/${groupId}`}><button className="custom-button2">
     Добавить слово
    </button></Link> 
    </div>   

   
 

        </>
    );
};

export default Cards;
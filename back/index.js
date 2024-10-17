

import express from "express";
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import {registerValidator} from './checkAuth.js';
import UserModel from './models/user.js';
import GroupModel from './models/group.js';
import WordModel from './models/words.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import {authMiddleware} from './Authmiddleware.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb+srv://nick:donetsk2@cluster0.cjmncrr.mongodb.net/dictionary')
        .then(()=>console.log('we have connect with our data of base'))
        .catch((err)=>console.log('we have error with our connection', err));

app.post('/register', registerValidator, async (req,res)=>{
try{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json(errors.array());
  } 

  const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt); 
      
    
    const doc = new UserModel({
        email: req.body.email,
        name: req.body.name,
        passwordHash:hash
    });
  
    const user = await doc.save();
    const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',
    {
      expiresIn: '30d',
    },
    
    );
    
    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token,
    });

}catch(err){

  console.log(err);
  res.status(500).json({
message: "Не удалось зарегистрирвоаться",
  });
}
})

app.post('/login', async (req,res)=>{

  try{
    const user = await UserModel.findOne({
email:req.body.email
    });

    if(!user){
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass=await bcrypt.compare(req.body.password, user._doc.passwordHash);
if(!isValidPass){
  return res.status(404).json({
    message: 'Неверный логин или пароль',
  });
}

const token = jwt.sign({
  _id: user._id,
}, 
'secret123',
{
  expiresIn: '30d',
},

);

const {passwordHash, ...userData} = user._doc;


    res.json({
      ...userData,
      token,
    });

  }catch(err){
    res.status(500).json({
      message: "Не удалось авторизоваться",
         });
  }

})

app.get('/user', authMiddleware, async (req, res)=>{
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
} catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить данные пользователя" });
}
});

app.post('/addGroup', authMiddleware ,async (req,res)=>{
  try{

    const token = req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка
        const decoded = jwt.verify(token, 'secret123');

        const group = new GroupModel({
            name: req.body.name,
            user: decoded._id, // ID пользователя из токена
        });

        const savedGroup = await group.save();
        res.json(savedGroup);


  }

catch(err){
  console.log(err);
  res.status(500).json({
    message: "Не удалось добавить группу слов!",
       });
}
})


app.get('/AllGroup', authMiddleware ,async(req,res)=>{
  try {
    // извлекаю пользователя из запроса
    const userId = req.user._id;

    // ищу все группы, принадлежащие данному пользователю
    const groups = await GroupModel.find({ user: userId });

    res.json(groups);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка при получении групп пользователя" });
}
})

app.post('/addWord', authMiddleware ,async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'secret123');

      const word = new WordModel({
          name: req.body.name,
          translate:req.body.translate,
          group: req.body.groupId, // ID группы, куда добавляем слово
      });
      const savedWord = await word.save();
      res.json(savedWord);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Не удалось добавить слово!",
      });
  }
});


app.get('/words/:groupId', authMiddleware ,async (req, res) => {
  try {
      const words = await WordModel.find({ group: req.params.groupId }).exec();
      res.json(words);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Не удалось получить слова!",
      });
  }
});

app.get('/word/:userId', authMiddleware,  async (req,res)=>{
  try{
const groups = await GroupModel.find({
user:req.params.userId
}).exec();
res.json(groups);
  }
catch(err){
  console.log(err);
  res.status(500).json({
    message:"Не удалось получить группы!",
  });
}
});


app.get('/allWords', authMiddleware, async (req, res) => {
  try {
    // Получаем ID текущего пользователя из middleware
    const userId = req.user._id;

    // Находим все группы, принадлежащие пользователю
    const userGroups = await GroupModel.find({ user: userId }).exec();
    const groupIds = userGroups.map(group => group._id);

    // Находим все слова, принадлежащие этим группам
    const userWords = await WordModel.find({ group: { $in: groupIds } }).exec();

    // Формируем массив слов с использованием только необходимых данных
    const wordsToSend = userWords.map(word => ({
      _id: word._id,
      name: word.name,
    }));
    // Перемешиваем массив слов
    wordsToSend.sort(() => Math.random() - 0.5);
    // Отправляем отфильтрованные слова
    res.json(wordsToSend);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить все слова пользователя!",
    });
  }
});



app.get('/startGame/:groupId', authMiddleware, async (req, res) => {
  try {
      const groupId = req.params.groupId;
      const words = await WordModel.find({ group: groupId }).exec();
      
      // Перемешиваем массив слов
      const shuffledWords = words.sort(() => 0.5 - Math.random());

      // Отправляем только слова без перевода
      const wordsToSend = shuffledWords.map(word => ({ _id: word._id, name: word.name }));
      
      res.json(wordsToSend);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Не удалось начать игру!",
      });
  }
});

app.get('/startGame2/:groupId', authMiddleware, async (req,res) =>{
try{
  const groupId = req.params.groupId;
  const words = await WordModel.find({ group: groupId }).exec();
  const shuffledWords = words.sort(() => 0.5 - Math.random());
  const wordsToSend = shuffledWords.map(word=>({ _id: word._id, translate: word.translate }));
  res.json(wordsToSend);
}
catch(err){
  console.log(err);
  res.status(500).json({
      message: "Не удалось начать игру!",
  });
}
})



app.post('/checkAnswers', authMiddleware, async (req, res) => {
  try {
    const answers = req.body.answers; // Ожидается, что answers будет массивом объектов {wordId: '...', userTranslation: '...'}
    console.log(answers);
    const results = [];
    const words = []; // Массив слов с ошибками

    for (const answer of answers) {
      const word = await WordModel.findById(answer.wordId).exec();

      if (word.translate === answer.userTranslation) {
        results.push({ wordId: answer.wordId, correct: true });
      } else {
        // Добавляем слово с неправильным и правильным переводом
        results.push({ wordId: answer.wordId, correct: false, correctTranslation: word.translate });
        words.push({
          incorrectTranslation: answer.userTranslation,
          correctTranslation: word.translate
        });

        // Увеличиваем счетчик ошибок
        word.mistakesCount += 1;
        await word.save();
      }
    }

    // Подсчет баллов
    const score = results.filter(result => result.correct).length;
    const mistake = answers.length - score;

    // Отправка результата клиенту
    res.json({ score, results, mistake, words });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось проверить ответы!"
    });
  }
});


app.post('/checkAnswers2', authMiddleware, async (req, res) => {
  try {
      const answers = req.body.answers; 
      const results = [];
      
      for (const answer of answers) {
          const word = await WordModel.findById(answer.wordId).exec();
          
          if (word.name === answer.call) {
              results.push({wordId: answer.wordId, correct: true});
          } else {
              results.push({wordId: answer.wordId, correct: false, correctTranslation: word.name});
              
              // Увеличиваем счетчик ошибок
              word.mistakesCount += 1;
              await word.save();
          }
      }
      
      const score = results.filter(result => result.correct).length;
      const mistake = answers.length - score;
      res.json({score, results, mistake});
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Не удалось проверить ответы!",
      });
  }
});

app.get('/mostMistakes', authMiddleware, async (req, res) => {
  try {
      const words = await WordModel.find({}).sort({ mistakesCount: -1 }).exec(); // Получаем слова, отсортированные по убыванию ошибок
      res.json(words);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Не удалось получить список слов с наибольшим количеством ошибок!",
      });
  }
});



app.listen(1111, (err)=>{
    if(err){
      return  console.log(err);
    }
console.log("Server is working brilliant now!");
})



import { Routes, Route } from "react-router-dom";
import './App.css';
import SignUpForm from './components/registration'
import MainPage from './components/main';
import Login from'./components/login';
import Cards from './components/words'
import CreateGroup from './components/createGroup';

import CreateWord from "./components/createWords"
import GameEnglishWords from "./components/game";
function App() {
  return(
    <>
      

      <Routes> 
 <Route path ="/" element =   {<SignUpForm/>}/>
 <Route path = "/login" element = {<Login/>}/>
 <Route path = "/main" element = {< MainPage />}/>
 <Route path = "/words/:groupId" element = {<Cards/>}/>
 <Route path = "/createGroup" element = {< CreateGroup />}/>
 <Route path = "/addWords/:groupId" element = {< CreateWord />}/>
 <Route path = "/game" element = {<GameEnglishWords/>}/>
      </Routes>
    </>
  )
}

export default App;

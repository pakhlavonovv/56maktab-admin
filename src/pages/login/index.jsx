import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../firbase.config';
import '../../index.css';

const Index = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(false);

  const email = login; 

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("login", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(usersRef, { login: email, password });

      localStorage.setItem("user", email);

      navigate("/main");
    } else {
      const userDoc = querySnapshot.docs[0];
      if (userDoc.data().password === password) {

        localStorage.setItem("user", email);

        navigate("/main");
      } else {
        setError(true);
      }
    }

  } catch (err) {
    console.error(err);
    setError(true);
  }
};

  return (
    <div className='flex flex-col gap-[30px] bg-white h-[100vh]'>
      <div className="container flex justify-center items-start md:justify-start lg:w-[70%]">
        <img src="https://static.emaktab.uz/img/logotypes/uzlogotype.png" className='w-[150px] md:w-[180px] lg:mt-[30px] ml-[10px]' alt="Kundalik com logo" />
      </div>
      <div className="h-[50vh] w-[100%] flex flex-col items-center gap-3 sm:gap-5 md:gap-7 lg:justify-center lg:gap-0">
        <div className="w-full flex flex-col items-center md:items-start md:w-[70%] gap-6">
        <div className="bg-[#303C84] h-[76px] w-full flex items-center justify-center md:justify-start p-2 md:p-8">
          <h1 className='text-[22px] text-start text-white font-semibold sm:text-[28px] md:text-[32px]'>Kirish eMaktab</h1>
        </div>
          <form onSubmit={handleSubmit} className='w-[90%] pl-4 sm:w-[65%] md:w-[70%] lg:w-[45%] xl:w-[40%] flex flex-col gap-4 sm:gap-3'>
            <p className='font-bold'>Login</p>
            <input 
              onChange={e => setLogin(e.target.value)} 
              className='w-[100%] h-[46px] p-4 border-[1px] text-[15px] sm:text-[20px] rounded-md outline-none' 
              type="text" 
              value={login}
              required
            />
            <p className='font-bold'>Parol</p>
            <input  
              onChange={e => setPassword(e.target.value)} 
              className='w-[100%] h-[46px] p-4 border-[1px] text-[15px] sm:text-[20px] rounded-md outline-none' 
              type="text" 
              value={password}
              required
            />
            <button type='submit' className='bg-[#A8D35B] text-white font-bold text-[16px] lg:text-[18px] transition-all w-[100%] h-[49px] lg:w-[50%] rounded-md shadow-lg hover:bg-[#88ac49] hover:text-white'>
              Tizimga kiring
            </button>
            {error && <span className='text-center text-red-500'>Login yoki parol xato!</span>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;

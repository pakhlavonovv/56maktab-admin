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
    <div className='flex flex-col gap-[30px] bg-[#F4F4F4] h-[100vh]'>
      <div className="container items-start">
        <img src="https://static.emaktab.uz/img/logotypes/uzlogotype.png" className='w-[150px] md:w-[180px] lg:mt-[30px] ml-[10px]' alt="Kundalik com logo" />
      </div>
      <div className="h-[50vh] w-[97%] flex flex-col items-center gap-3 sm:gap-5 md:gap-7 lg:justify-center lg:gap-0">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className='text-[25px] text-start text-black font-semibold sm:text-[28px] md:text-[32px] lg:text-[35px] xl:text-[40px]'>Kirish</h1>
          <form onSubmit={handleSubmit} className='w-[95%] sm:w-[65%] md:w-[50%] lg:w-[45%] xl:w-[40%] flex flex-col gap-2 sm:gap-3'>
            <input 
              onChange={e => setLogin(e.target.value)} 
              className='w-[100%] h-[45px] p-4 border-[1px] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] rounded-md outline-none' 
              type="text" 
              placeholder='Login' 
              value={login}
              required
            />
            <input  
              onChange={e => setPassword(e.target.value)} 
              className='w-[100%] h-[45px] p-4 border-[1px] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] rounded-md outline-none' 
              type="password" 
              placeholder='Parol' 
              value={password}
              required
            />
            <button type='submit' className='border-[2px] border-[#00B9E5] text-[#00B9E5] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] transition-all w-[100%] h-[45px] rounded-md shadow-lg hover:bg-[#00B9E5] hover:text-white'>
              Kirish
            </button>
            {error && <span className='text-center text-red-500'>Login yoki parol xato!</span>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;

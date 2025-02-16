import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firbase.config'
import '../../index.css'

const Index = () => {
  const [error, setError] = useState(false)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleLogin = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, login, password).then((userCredential)=> {
      const user = userCredential.user
      console.log(user)
      if(login === "56maktab_zam_direktor@gmail.com"){
        navigate('/main')
        window.localStorage.setItem("log", "zam_direktor")
      } else if(login === "abdullokh@gmail.com"){
           navigate('/main')
      } else {
        navigate('/')
      }
   
    }).catch(error => {
      setError(true)
      console.log(error)
    })
  }
  return (
    <div className="bg-[#2C3E50] h-[100vh] w-[100%] flex flex-col items-center gap-3 sm:gap-5 md:gap-7 lg:justify-center lg:gap-0">
        <div className="flex flex-col items-center justify-center p-2">
        <h2 className='text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[35px] font-bold text-white'>56 ШКОЛА</h2>
        <span className='text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-center min-[1250px]:w-[500px] font-bold text-[#3498DB]'>Современные знания – успешное будущее</span>
        </div>
      <div className="flex flex-col items-center justify-center w-[70%]">
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <h1 className='text-[20px] text-white sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]'>Авторизоваться</h1>
        <form onSubmit={handleLogin} className='w-[90%] sm:w-[65%] md:w-[50%] lg:w-[45%] xl:w-[40%] flex flex-col gap-2 sm:gap-3'>
          <input onChange={e => setLogin(e.target.value)} className='w-[100%] h-[35px] p-4 border-[1px] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] border-gray-400 rounded-md' type="text" placeholder='Login'/>
          <input  onChange={e => setPassword(e.target.value)} className='w-[100%] h-[35px] p-4 border-[1px] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] border-gray-400 rounded-md' type="password" placeholder='Password'/>
          <button type='submit' className='bg-[#27AE60] border-[1px] text-[14px] sm:text-[16px] sm:h-[40px] lg:text-[18px] border-[#226160] transition-all w-[100%] h-[35px] rounded-md text-white shadow-lg hover:bg-[#27ae5fb0] hover:text-white'>Login</button>
    {error &&<span className='text-center text-red-500'>Неправильный логин или пароль!</span>}
        </form>
        </div>
      </div>
  )
}

export default Index
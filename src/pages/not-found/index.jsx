import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full h-[100vh] bg-gradient-to-r from-orange-400 to-orange-600">
       <i><h1 className="text-[70px] sm:text-[100px] md:text-[110px] lg:text-[120px] xl:text-[130px] text-black font-bold">404</h1></i>
       <div className="flex flex-col items-center mb-1">
       <p className="text-[12px] md:text-[17px] font-light">This is not found page!</p>
       <p className="w-[80%] text-[12px] md:text-[17px] text-center font-light">We couldn't find the page you're looking for. Maybe go back to the main menu?</p>
        </div> 
       <Link to={'/'} className="flex items-center justify-center w-[160px] h-[28px] text-orange-500 text-[14px] sm:text-[16px] md:h-[40px] border-[1px] border-black rounded-md transition-all bg-black hover:bg-transparent hover:text-black">GO BACK</Link>
    </div>
  )
}

export default Index
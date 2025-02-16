import { useState, useEffect } from "react";
import { db } from "../../firbase.config";
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";

const NewsPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [nameCourse, setNameOfCourse] = useState("");
  const [nameTeacher, setNameTeacher] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [imageOfTeacher, setImageOfTeacher] = useState(null);
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [price, setPrice] = useState("")
  const [news, setNews] = useState([]);
  const [courses, setCourses] = useState([])
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [courseModalType, setCourseModalType] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState(null);
  const [loading, setLoading] = useState(false)
  const [loadingCourse, setLoadingCourse] = useState(false)

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.success ? data.data.url : null;
    } catch (error) {
      alert("Ошибка загрузки изображения:", error)
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Пожалуйста, загрузите фотографию!");
  
    setLoading(true); 
  
    try {
      const imageUrl = await uploadToImgBB(file);
      if (!imageUrl) throw new Error("Изображение не удалось загрузить!");
      await addDoc(collection(db, "posts"), {
        title,
        description,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setDescription("");
      setFile(null);
      fetchNews();
    } catch (error) {
      alert("❌ Ошибка:", error)
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!imageOfTeacher) return alert("Пожалуйста, загрузите фотографию преподавателя!");
  
    setLoadingCourse(true); 
  
    try {
      const imageUrl = await uploadToImgBB(imageOfTeacher);
      if (!imageUrl) throw new Error("Изображение не удалось загрузить!");
  
      await addDoc(collection(db, "courses"), {
        courseName: nameCourse,
        description: courseDescription,
        startTime,
        endTime,
        price,
        imageUrl, 
        teacherName: nameTeacher,
      });
      
  
      setNameOfCourse("");
      setCourseDescription("");
      setStartTime("");
      setEndTime("");
      setPrice("");
      setImageOfTeacher(null);
      fetchNews();
    } catch (error) {
      console.error("❌ Xatolik:", error);
      alert(error.message);
    } finally {
      setLoadingCourse(false); 
    }
  };
  

  const fetchNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const newsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setNews(newsArray);
    } catch (error) {
      alert("Ошибка получения данных из Firestore:", error)
    }
  };
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setCourses(coursesArray); 
    } catch (error) {
      alert("Ошибка получения данных из Firestore:", error)
    }
  };
  
  

  useEffect(() => {
    fetchNews();
    fetchCourses();
  }, []);


  const deleteImageFromImgBB = async (deleteUrl) => {
    try {
      await fetch(deleteUrl, { method: "DELETE" });
    } catch (error) {
     alert("Ошибка удаления изображения из ImgBB:", error)
    }
  };

  const handleDelete = async (id, deleteUrl) => {
    if (deleteUrl) {
      await deleteImageFromImgBB(deleteUrl);
    }
    await deleteDoc(doc(db, "posts", id));
    setModalType(null);
    fetchNews();
  };

  const handleEdit = async () => {
    if (!selectedNews) return;
    await updateDoc(doc(db, "posts", selectedNews.id), {
      title: selectedNews.title,
      description: selectedNews.description,
    });
    setModalType(null);
    fetchNews();
  };

  const handleCourseDelete = async (id, deleteUrl) => {
    if (deleteUrl) {
      await deleteImageFromImgBB(deleteUrl);
    }
    await deleteDoc(doc(db, "courses", id));
    setCourseModalType(null);
    fetchCourses(); 
  };
  

  const handleCourseEdit = async () => {
    if (!selectedCourses) return; 
    await updateDoc(doc(db, "courses", selectedCourses.id), {
      courseName: selectedCourses.courseName,
      description: selectedCourses.description,
      price: selectedCourses.price,
    });
    setCourseModalType(null);
  };
  

  return (
    
    <div className="w-[100%] mx-auto p-3">
         <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-center mb-6">📢 Панель новостей и внеклассная деятельность</h1>

      <div className="flex flex-col items-start sm:flex-row gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      <div className="bg-white w-[100%] p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">📝 Добавить новость</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
          <textarea placeholder="Текст новости" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none h-[150px] sm:h-[200px] p-2 border rounded" required />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded" required />
          <button disabled={loading} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{loading ? 'Добавляется...' : 'Добавить новость'}</button>
        </form>
      </div>
      <div className="bg-white w-[100%] p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">📋 Добавить курс</h2>
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <input type="text" placeholder="Заголовок" value={nameCourse} onChange={(e) => setNameOfCourse(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Имя учителя" value={nameTeacher} onChange={(e) => setNameTeacher(e.target.value)} className="w-full p-2 border rounded" required />

          <textarea placeholder="Комментарий к курсу" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} className="w-full resize-none h-[150px] sm:h-[200px] p-2 border rounded" required />
          <input type="text" placeholder="Время начала курса" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Время окончания курса" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border rounded" required />

          <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="file" accept="image/*" onChange={(e) => setImageOfTeacher(e.target.files[0])} className="w-full p-2 border rounded" required />
          <button disabled={loadingCourse} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{loadingCourse ? 'Добавляется...' : 'Добавить новость'}</button>
        </form>
      </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">📜 Последние новости</h2>
      <div className="space-y-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white w-full p-4 rounded-lg shadow-md">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
            <p className="text-sm text-gray-500">🕒 {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</p>
            <div className="flex space-x-2 mt-3">
              <button onClick={() => { setSelectedNews(item); setModalType('delete'); }} className="bg-red-500 text-white px-3 py-1 rounded">Удалить</button>
              <button onClick={() => { setSelectedNews(item); setModalType('edit'); }} className="bg-yellow-500 text-white px-3 py-1 rounded">Редактировать</button>
            </div>
          </div>
        ))}
      </div>
      <br /><br /> <hr />
       <h2 className="text-lg font-semibold mt-4 mb-4">📜 Курсы</h2>
      <div className="space-y-6">
        {courses.map((item) => (
          <div key={item.id} className="bg-white w-full p-4 rounded-lg shadow-md">
            <img src={item.imageUrl} alt={item.courseName} className="w-full h-48 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold">{item.courseName}</h3>
            <p className="text-gray-700">{item.description}</p>
            <p className="text-gray-700">{item.startTime} - {item.endTime}</p>
            <p className="text-gray-700 text-[20px]">{item.price} 000 UZS</p>
            <div className="flex space-x-2 mt-3">
              <button onClick={() => { setSelectedCourses(item); setCourseModalType('delete'); }} className="bg-red-500 text-white px-3 py-1 rounded">Удалить</button>
              <button onClick={() => { setSelectedCourses(item); setCourseModalType('edit'); }} className="bg-yellow-500 text-white px-3 py-1 rounded">Редактировать</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {courseModalType === 'delete' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 rounded-lg shadow-md">
            <p>Вы уверены, что хотите удалить эту новость?</p>
            <div className="flex space-x-4 mt-4">
              <button onClick={() => handleCourseDelete(selectedCourses.id)} className="bg-red-500 text-white px-4 py-2 rounded">Да</button>
              <button onClick={() => setCourseModalType(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Нет</button>
            </div>
          </div>
        </div>
      )}

      {courseModalType === 'edit' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Изменить новость</h2>
            <input type="text" value={selectedCourses?.title} onChange={(e) => setSelectedCourses({ ...selectedCourses, courseName: e.target.value })} className="w-full p-2 border rounded mt-2" />
            <textarea value={selectedCourses?.description} onChange={(e) => setSelectedCourses({ ...selectedCourses, description: e.target.value })} className="w-full p-2 border rounded mt-2" />
            <div className="flex space-x-4 mt-4">
              <button onClick={handleCourseEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Изменить</button>
              <button onClick={() => setCourseModalType(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Отмена</button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'delete' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 rounded-lg shadow-md">
            <p>Вы уверены, что хотите удалить эту новость?</p>
            <div className="flex space-x-4 mt-4">
              <button onClick={() => handleDelete(selectedNews.id)} className="bg-red-500 text-white px-4 py-2 rounded">Да</button>
              <button onClick={() => setModalType(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Нет</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'edit' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Изменить новость</h2>
            <input type="text" value={selectedNews?.title} onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })} className="w-full p-2 border rounded mt-2" />
            <textarea value={selectedNews?.description} onChange={(e) => setSelectedNews({ ...selectedNews, description: e.target.value })} className="w-full p-2 border rounded mt-2" />
            <div className="flex space-x-4 mt-4">
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Изменить</button>
              <button onClick={() => setModalType(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default NewsPage;

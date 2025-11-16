import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firbase.config';

const Index = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (err) {
        console.error("Ошибка получения данных из Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-gray-100 md:py-10">
      <div className="container mx-auto md:px-4">
        <h1 className="text-[20px] sm:text-4xl font-bold mb-6 text-center text-gray-800">Faoliyat yuritayotgan o'qituvchilar</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Login</th>
                <th className="py-3 px-6 text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.login}</td>
                  <td className="py-3 px-6">{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;

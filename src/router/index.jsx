import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from '../App';
import { LazyLogin, LazyMain, LazyNotFound } from "../pages";
import RequireAuth from "../components/prottected-route";  

const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<LazyLogin />} />
        <Route path="main" element={<RequireAuth><LazyMain /></RequireAuth>} />
        <Route path="*" element={<LazyNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Index;

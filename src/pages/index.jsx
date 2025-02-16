import { lazy, Suspense } from 'react';
import Loading from '../components/loading';

const Login = lazy(() => import('./login'));
const NotFound = lazy(() => import('./not-found'));
const Main = lazy(() => import('./main'));


const LazyLogin = () => (
  <Suspense fallback={<Loading/>}>
    <Login />
  </Suspense>
);

const LazyMain = () => (
  <Suspense fallback={<Loading/>}>
    <Main />
  </Suspense>
);
const LazyNotFound = () => (
  <Suspense fallback={<Loading/>}>
    <NotFound />
  </Suspense>
);
export {LazyMain, LazyLogin, LazyNotFound }

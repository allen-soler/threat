import './App.css';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { fetchThreats } from './features/userSlice/userSlice';
import Main from './Components/Sections/Main';
import DashBoard from './Components/dashboard/Dashboard';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchThreats());
}, []); // Empty dependency array ensures this runs only once when the component mounts.

  // const isDashboardSubdomain = window.location.hostname.startsWith('dashboard.');
//and more to fix
  // if (isDashboardSubdomain) {
  //   return <DashBoard />;
  // } else {
    return (
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/DashBoard' element={<DashBoard />} />
        <Route path='*' element={<Main />} />
      </Routes>
    );
  // }
};

export default App;

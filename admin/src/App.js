import logo from './logo.svg';
import './App.css';
// import Appbar from './Components/Appbar';
import AdminRoute from './Admin/Routes/AdminRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompanyRoute from './Company/Routes/CompanyRoute';
function App() {
  return (
    <div className="App">
     {/* <Appbar/> */}
     <BrowserRouter>

<Routes>
<Route exact path="/*"  element={<AdminRoute />}/>
<Route exact path="/Company/*"  element={<CompanyRoute />}/>

</Routes>
</BrowserRouter>
    </div>
  );
}

export default App;

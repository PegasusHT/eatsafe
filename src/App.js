import './App.css';
import MainNavbar from './components/navBar/navbar';
import ListView from './components/listview/listview';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import MapView from './components/mapview/mapView';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <MainNavbar/>
      </div>

      <Routes>
          <Route exact path='/listview' element={<ListView/>}/>
          <Route exact path='/' element={<MapView/>}/>
          <Route exact path='/mapview' element={<MapView/>}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;

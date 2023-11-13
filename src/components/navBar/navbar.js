import Nav from 'react-bootstrap/Nav';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"; 
import Navbar from 'react-bootstrap/Navbar';
import ListView from '../listview/listview';

function MainNavbar() {
  return (
    <BrowserRouter>
        <Navbar expand="lg" className="flex items-center border-b border-gray-200 bg-indigo-500 px-3 py-2">
            <div className="flex items-center space-x-10">
                <Navbar.Brand className='text-lg font-bold text-green-300' href="#home">EatSafe Surrey</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="flex items-center space-x-5">
                        <Nav.Link className='text-white' href="#home">Map View</Nav.Link>
                        <NavLink className='text-white' to="/listview">List View</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
        
        <Routes>
            <Route exact path='/listview' element={<ListView/>}/>
        </Routes>
    </BrowserRouter>
    
  );
}

export default MainNavbar;
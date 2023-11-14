import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom"; 
import Navbar from 'react-bootstrap/Navbar';

function MainNavbar() {
  return (
        <Navbar expand="lg" className="flex items-center border-b border-gray-200 bg-indigo-500 px-5 py-6">
            <div className="flex items-center space-x-10">
                <Navbar.Brand className='text-3xl font-bold text-green-300' href="#home">EatSafe Surrey</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="flex items-center text-xl space-x-5">
                        <Nav.Link className='text-sm sm:text-md md:text-lg lg:text-xl text-white' href="/">Map View</Nav.Link>
                        <NavLink className='text-sm sm:text-md md:text-lg lg:text-xl text-white' to="/listview">List View</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
        
   
    
  );
}

export default MainNavbar;
import React, { ChangeEvent, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {FaSearch} from 'react-icons/fa';

import logo from '../../images/pokeball.png';
import text from '../../images/logo.png';
import eevees from '../../images/eevees.png';

interface Props {
    setSearchValue: ((searchValue: string) => void),
}

const Header:React.FC<Props> = (props) => {
    const [search, setSearch] = useState<string>("");

    function handleSearch(event: MouseEvent<HTMLButtonElement>) {
        props.setSearchValue(search);        
    }

    function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);        
    }

return (
    <Navbar bg="white" expand="lg" className="sticky-top border-bottom shadow-sm justify-content-between p-0">
        <Navbar.Brand color='#ff0088' className='p-0 pl-3'>          
            <Link to='/'>
                    <Image src={logo} height="100" />  
                    <Image src={text} height="100" />
            </Link>
        </Navbar.Brand>
 
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav ">
         
                <InputGroup    className="mx-auto col-sm-4">
                    <FormControl
                    placeholder="Pesquisar"   
                    value={search}    size="lg"   
                    onChange={handleSearchInput}    
                    />
                    <InputGroup.Append>
                    <Button size="lg" onClick={handleSearch} color="#003A70"><FaSearch/></Button>
                    </InputGroup.Append>
                </InputGroup>  
        
            
        </Navbar.Collapse>
        <Nav className="ml-auto pr-3">
        <Image src={eevees} height="100" />  
        </Nav>   
    </Navbar>
);
}

export default Header;



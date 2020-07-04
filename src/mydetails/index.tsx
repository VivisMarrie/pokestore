import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { GiWhiteCat } from 'react-icons/gi';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaCode, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyDetails = () => {
 return (
    <div className="float-right my-3 icons-right">   
        <h2><Link to={{pathname: 'https://www.linkedin.com/in/vivribeiro/'}} target="_blank" ><FaLinkedinIn color='#5c32a8'/></Link></h2>
        <h2><Link to={{pathname: 'https://github.com/VivisMarrie/'}} target="_blank"><FaGithub color='#5c32a8'/></Link></h2>
        <h2><Link to={{pathname: 'https://www.instagram.com/vivismarrie/'}} target="_blank"><FaInstagram color='#5c32a8'/></Link></h2>

        <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip">Desenvolvido por Viviane</Tooltip>}>
        {// eslint-disable-line 
        }
        <span className="d-inline-block">
            <h1><GiWhiteCat/></h1>
        </span>
        </OverlayTrigger>
                    
        <h2><Link to={{pathname: 'https://github.com/VivisMarrie/pokestore'}} target="_blank"><FaCode color='#5c32a8' /></Link></h2>
    </div>
 )
}

export default MyDetails;
import React, {useEffect, useState, useRef} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Pagination from 'react-js-pagination';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

import axios, { AxiosResponse } from 'axios'
import Header from '../../components/header';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaInstagram, FaCode, FaStar, FaCartPlus, FaOpencart } from 'react-icons/fa';
import { GiWhiteCat } from 'react-icons/gi';
import Button from 'react-bootstrap/Button';
import './styles.css'

interface JsonReq {
    next: string,
    count: number,
    previous: string,
    results: {
        name: string,
        url: string
    }[]
}

interface Pokemon {
    id: number,
    is_default: boolean,
    name: string;
    stats: {
        base_stat: 45,
        effort: 0,
        stat: {
            name: string,
        }
    }[],
    types: {
        type: {
            name: string
        }
    }[]
}

const Home = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    const [activePage, setActivePage] = useState<number>(1);
    const [totalItens, setTotalItens] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
    const prevSearchValue = usePrevious(searchValue);
    const itemsPerPage = 12;

    function usePrevious(value: any) {
        const ref = useRef();
        useEffect(() => {
            if(value)
                ref.current = value;
        });
        return ref.current;
        }

    useEffect(() => {        
        if(searchValue && searchResults.length > 0){
            return;
        } 
        if(!searchValue) {
            setSearchResults([]);
        }

        const indexOfLast = activePage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        axios
        .get<JsonReq>(
            `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${indexOfFirst}`
        )
        .then(({data}) => {   
            
            setTotalItens(data.count);
            const pokemonsReq = data;   
             
            let pokemonsList: Pokemon[] = [];           
            const getPokemonDetail= pokemonsReq.results.map(pokemon => 
                axios.get<Pokemon>(pokemon.url));
            /*const getPokemonSpecies= pokemonsReq.results.map(pokemon => 
                axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon-species/1/`));*/

            Promise.all(getPokemonDetail)               
            .then((results) => { 
                console.log("result2", results);
                
                results.map(res => pokemonsList.push(res.data));

                setPokemons(pokemonsList);                
            });        

        }).catch((Error) => {
            console.error(Error);
        });
    },[searchValue, activePage]);

    useEffect(() => {
        if(!searchValue){
            setSearchResults([]);
            return;
        }
            
        if(searchValue === prevSearchValue && searchResults.length > 0){
            const indexOfLast = activePage * itemsPerPage;
            const indexOfFirst = indexOfLast - itemsPerPage;
            setPokemons(searchResults.slice(indexOfFirst, indexOfLast));
        } else {
            axios
            .get<JsonReq>(
                `https://pokeapi.co/api/v2/pokemon`
            )
            .then(({data}) => {    
                setActivePage(1);
                const indexOfLast = 1 * itemsPerPage;
                const indexOfFirst = indexOfLast - itemsPerPage; 
                        
                setTotalItens(data.count);
                const pokemonsReq = data.results;   
                
                let pokemonsList: Pokemon[] = []; 

                Promise.all(pokemonsReq.map(pokemon => 
                    axios.get<Pokemon>(pokemon.url)))               
                    .then((results) => { 
                        results.map(res => pokemonsList.push(res.data));
                        
                        if(searchValue)
                            pokemonsList = pokemonsList.filter(pokemon => pokemon.name.includes(searchValue.toLowerCase()));
                        setSearchResults(pokemonsList);     
                        setTotalItens(pokemonsList.length);

                        setPokemons(pokemonsList.slice(indexOfFirst, indexOfLast));
                    });
                    

            }).catch((Error) => {
                console.error(Error);
            });
        }
    },[searchValue, activePage]);


    const handlePageChange = (pageNumber:number) => {
        setActivePage(pageNumber);
    }    

    return (
        <>
            <Header setSearchValue={setSearchValue} /> 

            <Container fluid>
                <div className="float-right my-3 cart">    
                    <Card >
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <b><h2><FaOpencart/> Carrinho</h2></b>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Datas <span className="float-right">Dias</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Hóspedes <span className="float-right">Hóspedes</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                noites<span className="float-right"></span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {/* Total { placeModal.total ? 
                                <span className="float-right">
                                {placeModal.priceCurrency}{placeModal.total}
                                </span> : <></> } */}
                            </ListGroup.Item>
                            <ListGroup.Item><Button variant="danger" block>Finalizar</Button></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>
                <div className="float-right my-3 icons-right">   
                    <h2><Link to={{pathname: 'https://www.linkedin.com/in/vivribeiro/'}} target="_blank" ><FaLinkedinIn color='#5c32a8'/></Link></h2>
                    <h2><Link to={{pathname: 'https://github.com/VivisMarrie/'}} target="_blank"><FaGithub color='#5c32a8'/></Link></h2>
                    <h2><Link to={{pathname: 'https://www.instagram.com/vivismarrie/'}} target="_blank"><FaInstagram color='#5c32a8'/></Link></h2>
                
                    <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip">Desenvolvido por Viviane</Tooltip>}>
                    <span className="d-inline-block">
                        <h1><GiWhiteCat/></h1>
                    </span>
                    </OverlayTrigger>
                
                    <h2><Link to={{pathname: 'https://github.com/VivisMarrie/pokestore'}} target="_blank"><FaCode color='#5c32a8' /></Link></h2>
                </div>
                
     
           
                <Container >
                    {/* <PokemonCard /> */}
                    <Row className="mt-2 pr-3">
                        {                    
                            pokemons.length > 0 ?    
                            pokemons.map((pokemon) => (
                                <span key={pokemon.id} className='col-sm-3 my-2 pr-0' >
                                <Card className={`h-100 card-link  ${pokemon.types[0].type.name}`}>    
                                     <Card.Text>
                                        <h4>
                                            {pokemon.name} Nº {pokemon.id}
                                        </h4>
                                    </Card.Text >                                
                                    <Card.Img className="p-1" variant="top" src={`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`} />
                                    <Card.Body>
                                        <Card.Text>
                                            {/* <Badge className={`badge-${ColorsBadges[place.tag as keyof typeof ColorsBadges]}`} >{place.tag}</Badge> */}
                                            {/* <small className="text-muted"> {place.propertyType}</small> */}
                                            {/* <small><span className="float-right"><FaStar color='#FF5A5F' />{place.score}</span></small> */}
                                        </Card.Text >
                                     
                                            <small className="text-muted">With faded secondary text</small>
                                        

                                        <Card.Text>
                                            {/* <small><b>{place.priceCurrency} {place.price}</b>/Noite</small>
                                            { place.total ? 
                                                <span className="float-right">
                                                <small className="text-muted">Total: <b>{place.priceCurrency}  {place.total}</b></small>
                                            </span> : <></> } */}
                                            Content
                                        </Card.Text>
                                        {/* <a id="cardlink-" data-toggle="modal" data-target="#modalCard" href="/" onClick={(event) => handleShowModal(event, place)} className="stretched-link">{null}</a> */}
                                    </Card.Body>
                                    </Card>
                                </span>
                            ))     
                            : <Col className="d-flex justify-content-center my-3"><Spinner animation="border" /></Col>                
                        }
                    </Row>
                    <span className="justify-content-center d-flex">
                        <Pagination
                        itemClass="page-item"
                        linkClass="page-link"   
                        activePage={activePage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={totalItens}
                        hideNavigation
                        onChange={handlePageChange}
                        />
                    </span> 
                                
                </Container>
            {/* <Footer/> */}
            </Container>
        </>
    )
}

export default Home;
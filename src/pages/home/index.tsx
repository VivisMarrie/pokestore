import React, {useEffect, useState, useRef, MouseEvent} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-js-pagination';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

import axios from 'axios'
import Header from '../../components/header';
import { FaOpencart } from 'react-icons/fa';
import { MdAddShoppingCart, MdRemoveShoppingCart } from 'react-icons/md';

import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';

import './styles.css'
import Image from 'react-bootstrap/Image';
import MyDetails from '../../mydetails';

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

interface Cart {
    pokevalues: {pokemon:Pokemon, qtd: number, total: number}[],
    total: number
}

enum PokemonTypes {
    normal ="Normal",
    fire = "Fire",
    water = "Water",
    grass = "Grass",
    flying = 'Flying',
    fighting = "Fighting",
    poison = "Poison",
    electric = "Electric", 
    ground = "Ground",
    rock = "Rock",
    psychic = 'Psychic', 
    ice = "Ice", 
    bug = "Bug", 
    ghost = 'Ghost', 
    steel = "Steel", 
    dragon = "Dragon", 
    dark ='Dark',
    fairy ='Fairy'
}

const Home = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [typeSearch, setTypeSearch] = useState<string>("");

    const [cartValues, setCartValues] = useState<Cart>();

    const [activePage, setActivePage] = useState<number>(1);
    const [totalItens, setTotalItens] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<Pokemon[]>([]);

    const prevSearchValue = usePrevious(searchValue);
    const prevTypeSearch = usePrevious(typeSearch);
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
             
        if((searchValue || typeSearch)){
            return;
        } 
        if(!searchValue) {
            setSearchResults([]);
        }
        setPokemons([]);
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

            Promise.all(pokemonsReq.results.map(pokemon => 
                axios.get<Pokemon>(pokemon.url)))               
            .then((results) => {                
                results.map(res => pokemonsList.push(res.data));
                setPokemons(pokemonsList);                
            });        

        }).catch((Error) => {
            console.error(Error);
        });
    },[searchValue, activePage, typeSearch]);

    useEffect(() => {      
        if(!searchValue && !typeSearch){
            setSearchResults([]);
            return;
        }
     
        if(((searchValue === prevSearchValue) || (typeSearch === prevTypeSearch)) && searchResults.length > 0){
            
            const indexOfLast = activePage * itemsPerPage;
            const indexOfFirst = indexOfLast - itemsPerPage;
            setPokemons(searchResults.slice(indexOfFirst, indexOfLast));
        } else {
            setPokemons([]);
            axios
            .get<JsonReq>(
                `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000`
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
        
                        if(typeSearch)
                            pokemonsList = pokemonsList.filter(pokemon => pokemon.types[0].type.name.includes(typeSearch));
                        setSearchResults(pokemonsList);     
                        setTotalItens(pokemonsList.length);

                        setPokemons(pokemonsList.slice(indexOfFirst, indexOfLast));
                    });
                    

            }).catch((Error) => {
                console.error(Error);
            });
        }
    },[searchValue, activePage, typeSearch]);

    const handlePageChange = (pageNumber:number) => {
        setActivePage(pageNumber);
    }

    const handleSearchByType = (event: MouseEvent<HTMLElement>, key:string) => {     
        event.preventDefault();  
        setTypeSearch(key);
    }

    const addToCart = (event: MouseEvent<HTMLElement>, pokemon:Pokemon) => {
     
        event.preventDefault();
        let pokevalues;
        let newItem = true;
        if(!cartValues)
            pokevalues = [{pokemon:pokemon, qtd: 0, total: 0}]
        else        
            pokevalues =  cartValues.pokevalues;

        pokevalues.map(pokevalue => {
            if(pokevalue.pokemon.id === pokemon.id){
                newItem = false;
                pokevalue.qtd++;
                pokevalue.total = ( pokevalue.pokemon.stats[0].base_stat * pokevalue.qtd);
            }
        })    
        if(newItem) pokevalues.push({pokemon, qtd: 1, total: pokemon.stats[0].base_stat});
        const total:number = pokevalues.reduce((prev, cur) => {return prev + cur.total}, 0);

        setCartValues({pokevalues, total})  
    }    

    const removeFromCart = async (pokemon:Pokemon) => {
        if(cartValues){
            let pokevalues =  cartValues.pokevalues;      
            pokevalues.map((pokevalue) => {
                if(pokevalue.pokemon.id === pokemon.id){
                    pokevalue.qtd--;
                    pokevalue.total = ( pokevalue.pokemon.stats[0].base_stat * pokevalue.qtd);
                }
                return pokevalue;
            })
            pokevalues = pokevalues.filter(pokevalue => pokevalue.qtd !==0)
            const total:number = pokevalues.reduce((prev, cur) => {return prev + cur.total}, 0);
            setCartValues({pokevalues, total})  
        }    
    }


    const [show, setShow] = useState(false);
    const handleClose = () => {
        setCartValues(undefined);
        setShow(false)
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <Header setSearchValue={setSearchValue} /> 

            <Container fluid>
            <div className="float-left my-3 types">
                {
                    Object.keys(PokemonTypes).map(key => (
                        <p key={key} className='m-1'>
                            <a href="/" onClick={(event) => handleSearchByType(event, key)} >
                            <Badge className={`${key} ${typeSearch === key ? 'active' : ''}`} >
                            {PokemonTypes[key as keyof typeof PokemonTypes]}</Badge>
                            </a>
                        </p>
                    ))
                }
            </div>

                <div className="float-right my-3 cart">    
                    <Card className="p-1">
                        <ListGroup variant="flush">
                            <ListGroup.Item className="mx-auto p-1" >
                                <b><h2><FaOpencart/> Carrinho</h2></b>
                            </ListGroup.Item >
                            {
                                cartValues?     
                                cartValues.pokevalues.map(pokevalue => (
                                    <ListGroup.Item key={pokevalue.pokemon.id} className='align-middle p-1'>
                                        <Image height={32} className="pr-1 pl-1" src={`https://pokeres.bastionbot.org/images/pokemon/${pokevalue.pokemon.id}.png`} />  
                                        <span className="text-capitalize">{pokevalue.pokemon.name}
                                        <span className="float-right align-top"><small >R$ {pokevalue.pokemon.stats[0].base_stat} x {pokevalue.qtd} = {pokevalue.total}</small>
                                        <Button className="px-1 pb-1 pt-0 m-0" onClick={() => removeFromCart(pokevalue.pokemon)} variant={"link"}>
                                            <MdRemoveShoppingCart className="p-0" size={15}  /></Button>
                                            </span>
                                            </span>
                                    </ListGroup.Item>
                                ))
                               
                                : <></>
                            }
                                <ListGroup.Item className='p-1'>
                                    Total { cartValues ? 
                                    <span className="float-right">
                                    R$ {cartValues.total}
                                    </span> : <></> }
                                </ListGroup.Item>                         
                            <ListGroup.Item className='p-1 pt-2'><Button variant="danger" onClick={handleShow} block>Finalizar</Button></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>
                
                <MyDetails/>
                
                <Container >
                    <Row className="mt-2 pr-3">
                        {                    
                            pokemons.length > 0 ?    
                            pokemons.map((pokemon) => (
                                <span key={pokemon.id} className='col-sm-6 col-md-4 col-lg-3 my-2 pr-0' >
                                <Card className={`h-100 card-link pokecard  ${pokemon.types[0].type.name}`}>    
                                        <span className="text-capitalize m-0 h4">
                                            {pokemon.name}                                        
                                             <span className="float-right m-0 h5">Nº {pokemon.id}</span></span>
                                        
                                    <Card.Img className="pr-1 pl-1" variant="top" src={`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`} />
                                    <Card.Body className='py-0 px-1'>
                                        <Card.Text>
                                            {
                                                pokemon.stats.map(stat => (
                                                    <Badge key={stat.stat.name} className={stat.stat.name}><span>{stat.stat.name}: {stat.base_stat}</span></Badge>
                                                ))
                                            }
                                        </Card.Text >      
                                        <Card.Text>                              
                                        <span className="float-left">R$ {pokemon.stats[0].base_stat}</span>
                                        <span className="float-right my-1 cart-add"><Button className="py-1 px-2"><MdAddShoppingCart size={20}/></Button></span>
                                        </Card.Text > 
                                        <a id="cardlink-{pokemon.id}" href="/" onClick={(event) => addToCart(event, pokemon)} className="stretched-link">{null}</a>

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

            <Modal
                size="sm"
                centered show={show}
                onHide={handleClose}
                >
                <Modal.Body className="text-center">
                <h2 >Parabéns</h2>  
                <h4 >Compra Realizada</h4>  
                     
                </Modal.Body>    
                </Modal>
            </Container>
        </>
    )
}

export default Home;
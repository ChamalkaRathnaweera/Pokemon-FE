import axios from "axios";
import { useState,useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useRef } from "react";
import { Auth } from 'aws-amplify';
import { Link, useNavigate,useParams } from "react-router-dom";

import useGetToken from '../hooks/useGetToken'
import './style.css'

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function Home(){

    const navigate = useNavigate();
    //Auth
    const token = useGetToken();
    console.log("test   " + token.token);

    const {id} = useParams();
    const [pokemons,setPokemons] = useState([])

    //search
    const [searchQuery, setSearchQuery] = useState("");
    const [search,setSearch] = useState()

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 2; // Display 2 records per page
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = pokemons.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(pokemons.length / recordsPerPage);
   
    //signout
    async function signOut() {
        try {
          await Auth.signOut();
          navigate('/')
        } catch (error) {
          console.log('error signing out: ', error);
        }
      }

    //get all data
    // {Id:1 Name: "Charmender", Weight: 78, Height: 170, Ability: "fire"}
    useEffect(()=> {
        axios.get('http://localhost:8000')
        
        .then(result => {
         //{result?.length? (
            setPokemons(result.data)
         //): alert("No results to show.")}
            setSearch(result.data);
        })
        .catch(err => console.log(err))
        //console.log(pokemons);
    },[])
    
    //search function
    useEffect(() => {
        const apiUrl = searchQuery ? `http://localhost:8000?keyword=${searchQuery}` : 'http://localhost:8000';
      
        axios.get(apiUrl)
          .then(result => {
            setPokemons(result.data);
          })
          .catch(err => console.log(err));
      }, [searchQuery]);
      
      const handleSearch = (event) => {
        event.preventDefault();
        setSearchQuery(event.target.value);
      }
      

    //delete function
    const handleDelete = (id) =>{
    axios.delete('http://localhost:8000/'+id,{
        headers: {
            "Authorization" : `Bearer ${token.token} `
        }
    })
    .then(res => {
        console.log(res)
        alert("Deleted Sucessfully.")
        window.location.reload()
    })
    .catch(
        err =>{ 
        console.log(err)
        alert("Deletion Unsucessful : "+ err)
        navigate('/')
        }
    )
    }
  
    //Table rendering for pagination
    const tableRows = records.map(pokemon => (
        <tr key={pokemon._id}>
          <td>{pokemon.name}</td>
          <td>{pokemon.weight}</td>
          <td>{pokemon.height}</td>
          <td>{pokemon.ability}</td>
          <td>
            <Link to={`/update/${pokemon._id}`} className="btnEdit">Edit</Link>
            <button className="btnDelete" onClick={() => handleDelete(pokemon._id)}>Delete</button>
          </td>
        </tr>
      ));
    
    //table
    return(
        <div className="conatiner">

            <div className="header">
                <button onClick={signOut} className="btnSignout">Sign out</button>
                <h2>Pokemon App</h2>
            </div>

            <div className='search'>
                <input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='searchTerm'
                />
            </div>

            <Link to ="/create" className="btnCreate">Create</Link>
            
            <table className="table">
            
                <thead className="thead">
                    <tr>
                        <th>Name</th>
                        <th>Weight (KG) </th>
                        <th>Height (M) </th>
                        <th>Ability</th>
                        <th>Action</th>
                    </tr>
                </thead>
                
                <tbody className="tbody">
                    {tableRows}
                </tbody>
                
            </table>
            
            {/* pagination */}
            <nav>
                <ul className='pagination'>
                    {currentPage > 1 && (
                        <li className='page-item'>
                            <a href ='#' className="btnPrev" onClick={prevPage}>Prev</a>
                        </li>
                    )}
                    {currentPage < totalPages && (
                        <li className='page-item'>
                            <a href="#" className="btnNext" onClick={nextPage}>Next</a>
                        </li>
                    )}
                </ul>
            </nav>
            
            {/* footer */}
            <div className='footer'>
                <p>&copy; Sample application using React JS, Nest JS, Mongo DB</p>
            </div>

        </div>
    )
    
    function prevPage() {
        setCurrentPage(currentPage - 1);
      }
    
      function nextPage() {
        setCurrentPage(currentPage + 1);
      }
    
}

export default Home

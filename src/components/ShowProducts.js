import React, {useEffect, useState} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { mostrar_alertas } from '../functions';
import Table from 'react-bootstrap/Table';
import { Button } from 'bootstrap/dist/js/bootstrap.bundle';



const ShowProducts = () => {
    const url="http://api.test"
    const [products,setProducts] = useState([]);
    const [id,setId] = useState('');
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState('');
    const [operation,setOperation] = useState(1);
    const [title,setTitle] = useState('');

    useEffect(()=>{
        getProducts();
    },[]);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProducts(respuesta.data)
    }

    const openModal = (op, id, name, description, price) => {
        setDescription('');
        setId('');
        setName('');
        setPrice('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar porducto');
        }
        else if (op === 2){
            setTitle('Editar producto');
            setId(id);
            setName(name);
            setDescription(description);
            setPrice(price);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500)
    }

    const validar = () => {
        var parametro;
        var metodo;

        if(name.trim() === ''){
            mostrar_alertas('Porfavor rellenar el campo')
        }
        else if(description.trim() === ''){
            mostrar_alertas('Porfavor rellenar el campo')
        }
        else if(price.trim() === ''){
            mostrar_alertas('Porfavor rellenar el campo')
        }
        else{
            if(operation === 1){
                parametro = {name:name.trim(), description:description.trim(), price:price};
                metodo = 'POST';
            }
            else{
                parametro = {id:id,name:name.trim(), description:description.trim(), price:price};
                metodo = 'PUT';
            }
            enviarSolicitud(metodo,parametro);
        }
    }
        const enviarSolicitud = async(metodo, parametro) => {
            await axios({method:metodo, url:url, data:parametro}).then(function(respuesta){
                var tipo = respuesta.data[0];
                var msj = respuesta.data[1];
                mostrar_alertas(tipo, msj);
                if(tipo === 'success'){
                    document.getElementById('btnCerra').click();
                    getProducts();
                }
            })
            .catch(function(error){
                mostrar_alertas('error en la solicitud');
                console.log(error)
            })
        }

        const eliminarPoducto = (id, name) => {
            const MySwal = withReactContent(swal);
            MySwal.fire({
                title:'Seguro que deseas eliminar el producto '+name+' ?',
                icon: 'question',
                showCancelButton:true, confirmButtonText:'eliminar',cancelButtonText:'Cancelar'
            }).then((result) => {
                if(result.isConfirmed){
                    setId(id);
                    enviarSolicitud('DELETE', {id:id})
                }
                else{
                    mostrar_alertas('El producto no se ha eliminado ',' info')
                }
            })
        }

    return (
 /*Creacion de la tabla */
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className='col-12 col-lg-8 offset-lg-2'>
                <div className='table-responsive'>
                    <Table striped="columns">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Descripcion</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map( (products,i) => (
                                <tr key={products.id}>
                                    <td>{(i+1)}</td>
                                    <td>{products.name}</td>
                                    <td>{products.description}</td>
                                    <td>${new Intl.NumberFormat('es-mx').format(products.price)}</td>
                                    <td>
                                        <button onClick={()=> openModal(2,products.id, products.name, products.description, products.price)} className='btn btn-warning'>
                                            <i className='fa-solid fa-edit' data-bs-toggle='modal' data-bs-target='#modalProducts'></i>
                                        </button>
                                        &nbsp;
                                        <button onClick={() => eliminarPoducto(products.id, products.name)} className='btn btn-danger'>
                                            <i className='fa-solid fa-trash'></i>

                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button className='btn-close' type='button' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                                onChange={(e)=> setName(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='description' className='form-control' placeholder='description' value={description}
                                onChange={(e)=> setDescription(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='text' id='price' className='form-control' placeholder='price' value={price}
                                onChange={(e)=> setPrice(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i>
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerra' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ShowProducts

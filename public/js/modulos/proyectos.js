// GRACIAS A LA IMPORTACIÓN DE BABEL PODEMOS USAR LA SIGUIENTE SINTAXIS EN LUGAR DE LOS REQUIRE
import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {

    btnEliminar.addEventListener('click', e => {

        const urlProyecto = e.target.dataset.proyectoUrl;
        
        Swal.fire({
            title: '¿Deseas eliminar este proyecto?',
            text: "¡Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borralo',
            cancelButtonText: 'No, cancelar',
        }).then((result) => {
            // AQUÍ METEMOS LA PETICIÓN MEDIANTE AXIOS PARA ELIMINAR EFECTIVAMENTE
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            // TAMBIEN PODRÍAMOS HABER USADO EL location.pathname EN LUGAR DEL ATRIBUTO DATASET
            // const url = `${location.origin}/${location.pathname}`;
            if(!result.isConfirmed)
                return;
            axios.delete( url, { params: { urlProyecto } } )
                .then(function(respuesta) {
                    // console.log(respuesta);
                    // return;
                    if (result.isConfirmed) {
                        Swal.fire(
                            '¡Eliminado!',
                            respuesta.data,
                            'success'
                        );
                        // REDIRECCIONAMOS
                        setTimeout( () =>{
                            window.location.href = '/';
                        },3000 );
                    }
                })
                .catch( () => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar el proyecto'
                    })
                });

        });
    });

}

export default btnEliminar;
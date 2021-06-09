import axios from "axios";
import Swal from 'sweetalert2';

import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    // USAMOS DELEGATION. TENEMOS UN SELECTOR MÁS GLOBAL Y EVALUAMOS EN QUE ELEMENTO PUNTUAL HACEMOS CLICK EN ESTE CASO 
    // PONEMOS UN LISTENER GLOBAL A TODO EL LISTADO DE PENDIENTES
    tareas.addEventListener('click', e => {
        
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            // REQUEST HACIA /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`; 
            
            axios.patch(url, { idTarea} )
                .then(function(respuesta) {
                    if(respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                }); 
        }

        if(e.target.classList.contains('fa-trash')) {
            
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas eliminar esta tarea?',
                text: "¡Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrala',
                cancelButtonText: 'No, cancelar',
            }).then((result) => {
                if(!result.isConfirmed)
                    return;
                const url = `${location.origin}/tareas/${idTarea}`;
                // delete REQUIERE params EL RESTO DE LOS MÉTODOS HTTP NO LO NECESITAN
                axios.delete( url, { params: { idTarea } } )
                    .then(function(respuesta) {
                        
                        if (result.isConfirmed) {
                            tareaHTML.parentElement.removeChild(tareaHTML);                            
                            Swal.fire(
                                '¡Eliminado!',
                                respuesta.data,
                                'success'
                            );
                            actualizarAvance();
                        }
                    })
                    .catch( () => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar la tarea'
                        })
                    });
    
            });
        }
    });
}

export default tareas;
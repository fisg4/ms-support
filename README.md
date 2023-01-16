# Support Microservice (ms-support)

El microservicio de soport (ms-support) es un proyecto desarrollado por el equipo formado por María Elena Molino Peña y Alejandro José Muñoz Aranda, para la aplicación FastMusik, en el contexto de la asignatura Fundamentos de Ingeniería del Software (FIS) del Máster en Ingeniería del Software: Cloud, Datos y Gestión TI, de la Universidad de Sevilla (curso académico, 22-23).

Sirva este documento como manifiesto del trabajo realizado por este equipo.

## Nivel de acabado

El equipo se presenta al nivel de acabado correspondiente a la máxima calificación de 9, cumpliendo con los requisitos para tal fin.

## Descripción de la aplicación

De forma general, FastMusik es una aplicación de música.

(Se debe aplicar una descripción general de la aplicación)

## Microservicios

(Descripción de cada microservicio)

El microservicio implementado por Juan Carlos Cortés Muñoz y Mario Ruano Fernández es el ms-songs.

En lo que respecta a la funcionalidad que ofrece el microservicio ms-songs, en FastMusik, los usuarios podrán buscar canciones, tanto en el sistema como en Spotify, acceder a los videoclips y letras de estas y hacer like en aquellas canciones que más les gusten.

Otras funcionalidades que derivan de este microservicio son la de generar un listado de canciones favoritas de cada usuario, crear salas de chat entre usuarios con los mismos gustos musicales y notificar al servicio de soporte de incorrecciones en el videoclip de una canción.

El microservicio implementado por María Elena Molino Peña y Alejandro José Muñoz Aranda es el de soporte (ms-support).

El microservicio de soporte es el responsable de gestioinar todas las peticiones o incidencias que se producen en FastMusik. En concreto las principales funcionalidades son reportar mensajes ofensivos y crear incidencias tanto técnicas, desde un formulario general, como notificaciones de URLs incorrectas en las canciones que ofrece la aplicación.

Por otro lado, los usuarios administradores visualizarán todos los tickets o reportes que envíen los usuarios finales, puediendo aprobar o rechazarlos.

## Customer Agreement

Enlace al CA

## Análisis de la capacidad y pricing

Enlace a ambos

## API REST de ms-songs

La documentación de la API REST de ms-songs está disponible en el siguiente [enlace](https://support-fastmusik-marmolpen3.cloud.okteto.net/docs/).

## Requisitos del microservicio

En función de las distintas entidades de dominio del microservicio ms-songs, los requisitos y la justificación de su implementación han sido los que se citan a continuación.

### Tickets

| Requisito                                                                                                                                                                | Justificación                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Como usuario, quiero ver un listado de todos los tickets que he creado.
  | Se implementa el listado de los tickets filtrando por el id del usuario que solicita la acción.
| Como administrador, quiero ver un listado de todos los reportes que han creado los usuarios.
  | Se realiza el listado de todos los reportes mediante un GET simple. 
                                                                  |
| Como usuario, quiero poder crear una incidencia sobre un problema en la aplicación.                                                                         
  | El usuario podrá informar sobre sus incidencias mediante un formulario. Debe rellenar un título, un campo de rexto describiendo el problema y la prioridad.                                                                                            |
| Como administrador, quiero poder aprobar o rechazar los tickets que manden los usuarios.  
  | Los administradores podrán validar o rechazar los tickets que envían los usuarios a traves de un modal simple. También podrán establecer una prioridad distinta para el ticket si lo consideran necesario. |
| Como usuario, quiero añadir aquellas canciones que no se encuentran en FastMusik, pero que puedo encontrar en Spotify, para hacer más rico el catálogo de la aplicación. | Tras la búsqueda en Spotify, el usuario puede añadir a la base de datos de FastMusik cualquiera de los resultados, salvo que ya se encuentre en la aplicación.                                                                                                                                                                                                                                                                             |
| Como administrador, quiero eliminar una canción que no deba estar en FastMusik para poder hacer mantenimiento del estado de la aplicación                                | Aquellos usuarios que tengan el rol de administrador podrán eliminar las canciones que deseen. Esta funcionalidad se implementa mediante la acción de borrado a través del identificador único (id) de la canción.                                                                                                                                                                                                                         |

### Reports

| Requisito                                                                                                                                                                | Justificación                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Como usuario, quiero ver un listado de todos los reportes que he creado.
  | Se implementa el listado de los reportes realizando un GET con filtrado. El filtro se realiza mediante el identificador único del usuario que solicita la acción.                                                                                                                                          |
| Como administrador, quiero ver un listado de todos los reportes que han creado los usuarios.
  | Se realiza el listado de todos los reportes mediante un GET simple.
  |
| Como usuario, quiero conocer todos los usuarios que hacen like en una canción para poder saber quiénes tienen gustos musicales similares a los míos.
  | Esta acción se implementa como un GET con filtrado. El filtro se aplica mediante el identificador único (id) de una canción, mostrándose un listado de los usuarios que han hecho like a la misma.                                                                                                                                                                                        |
| Como usuario, quiero ver el listado de likes que he otorgado para tener una colección de mis canciones favoritas. 
  | En el caso de esta funcionalidad, se trata de aplicar un filtrado distinto al GET que devuelve todos los likes. Se filtra por le identificador único (id) del usuario, mostrándose un listado de las canciones a las que ha hecho like.                                                                                                                                                   |

## Análisis de esfuerzos

Enlace a pdf exportado al final de Clockify


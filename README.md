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

Desde un centro de soporte descentralizado de la aplicación, los administradores pueden visualizar un listado con todos los tickets y reportes que crean los usuarios finales. Accediendo a ellos, tienen la posibilidad de rechazarlos o aprobarlos, en cuyo caso el usuario que crea la incidencia recibe un correro con la notificación. Por último, los usuarios pueden ver un listado de los tickets y reportes que han creado y revisar el estado de los mismos.

## Customer Agreement

Enlace al CA

## Análisis de la capacidad y pricing

Enlace a ambos

## API REST de ms-support

La documentación de la API REST de ms-support está disponible en el siguiente [enlace](https://support-fastmusik-marmolpen3.cloud.okteto.net/docs/).

## Requisitos del microservicio

En función de las distintas entidades de dominio del microservicio ms-songs, los requisitos y la justificación de su implementación han sido los que se citan a continuación.

### Tickets
| Requisito | Justificación |
|--------|----------|
|Como usuario, quiero ver un listado de todos los tickets que he creado.|Se implementa el listado de los tickets filtrando por el id del usuario que solicita la acción.|
|Como administrador, quiero visualizar un listado de todos los tickets que han creado los usuarios.|Se realiza el listado de todos los tickets mediante un GET simple.|
|Como usuario, quiero revisar el estado de las incidencias que he creado.|Desde el listado de tickets, el usuario puede acceder a uno de ellos para ver el estado del mismo. Esto se ha realizado a partir de GET filtrado por el identificador único del usuario.|
|Como usuario, quiero poder crear una incidencia sobre un problema en la aplicación.| El usuario puede informar sobre sus incidencias mediante un formulario. Debe rellenar un título, un campo de texto describiendo el problema y la prioridad.|
|Como usuario, quiero poder notificar si un vídeo no corresponde a la canción.| El usuario puede notificar una URL incorrecta de un vídeo. Se ha realizado a partir de una integración con el microservicio de canciones, pudiendo realizar la notifición desde la misma vista de la canción. |
|Como administrador, quiero poder actualizar el estado de los tickets que manden los usuarios.|Los administradores pueden validar o rechazar los tickets que envían los usuarios a traves de un modal simple. También podrán establecer una prioridad distinta para el ticket si lo consideran necesario.|
|Como administrador, quiero eliminar un ticket que lleva mucho tiempo resuelto.|Accediendo a un ticket, el administrador puede elminarlo haciendo clic en un botón.|

### Reports
| Requisito | Justificación |
|--------|----------|
|Como usuario, quiero ver un listado de todos los reportes que he creado.|Se implementa el listado de los reportes filtrando por el id del usuario que solicita la acción.|
|Como administrador, quiero visualizar un listado de todos los reportes que han creado los usuarios.|Se realiza el listado de todos los reportes mediante un GET simple.|
|Como usuario, quiero revisar el estado de los reportes que he creado.|Desde el listado de reportes, el usuario puede acceder a uno de ellos para ver el estado del mismo. Esto se ha realizado a partir de GET filtrado por el identificador único del usuario.|
|Como usuario, quiero poder reportar un mensaje ofensivo.| El usuario puede reportar un mensaje que considere ofensivo. Esta funcionalidad es una integración con el microservicio de mensaje, por la cual permite al usuario realizar el reporte desde el mismo mensaje.|
|Como administrador, quiero poder actualizar el estado de los reportes que manden los usuarios.|Los administradores pueden validar o rechazar los reportes que envían los usuarios a traves de un modal simple.|
|Como administrador, quiero eliminar un reporte que lleva mucho tiempo resuelto.|Accediendo a un report, el administrador puede eliminarlo haciendo clic en un botón.|

## Análisis de esfuerzos

Enlace a pdf exportado al final de Clockify


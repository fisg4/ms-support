# Support Microservice (ms-support)

![FastMusik Logo](https://raw.githubusercontent.com/fisg4/client/main/src/images/fastMusik_logo.png)

El microservicio de soport (ms-support) es un proyecto desarrollado por el equipo formado por María Elena Molino Peña y Alejandro José Muñoz Aranda, para la aplicación FastMusik, en el contexto de la asignatura Fundamentos de Ingeniería del Software (FIS) del Máster en Ingeniería del Software: Cloud, Datos y Gestión TI, de la Universidad de Sevilla (curso académico, 22-23).

Sirva este documento como manifiesto del trabajo realizado por este equipo.

## Nivel de acabado

El equipo se presenta al nivel de acabado correspondiente a la máxima calificación de 9, cumpliendo con los requisitos para tal fin.

## Descripción de la aplicación

De forma general, FastMusik es una aplicación de música.

FastMusik presenta gran parte de las características de las redes sociales y las aplicaciones colaborativas. A través de búsquedas en el sistema, los usuarios pueden ir añadiendo canciones a la aplicación, dar likes a aquellas que más les gustan y completar la información de estas añadiendo la letra y el videoclip. Como resultado de la navegación y de ir haciendo diferentes likes, los usuarios podrán comenzar a chatear con otros con sus mismas preferencias musicales.

Además, FastMusik es una aplicación que cuenta con el respaldo de un sistema de soporte, mediante el cual es posible el envío de tickets de incidencias o solicitudes de cambios, así como reportes de mensajes inadecuados que se envían por los chats.

## Microservicios

FastMusik se divide en 5 microservicios: usuarios, canciones, mensajería, soporte y, por último, una API Gateway. Todos ellos se integran a través del backend para compartir y complementar la información. Estos se integran a su vez con APIs externas como DeepL, Spotify, SendGrid y PurgoMalum. Por otro lado, en la API Gateway se localizan funciones de centralización de operaciones, principalmente el mapeo de endpoints de los diferentes microservicios, para ser un único punto de consumo para el frontend, y para la autenticación de usuarios y generación de JWT.

### Microservicio de usuarios

El modelado de datos de este microservicio se basa en una única entidad, la que representa a los usuarios, que contiene toda la información necesaria para la gestión de los mismos. Con ella se presentan las siguientes funcionalidades: operaciones CRUD de la entidad, gestión de credenciales, registro y control de usuarios en los clientes y comprobación de texto ofensivo.

Como puntos destacables, está el uso de una API externa, PurgoMalum, para comprobar los textos que se introducen en el sistema; la autenticación que permite el control de la sesión del usuario y la centralización de la información de los usuarios.

### Microservicio de canciones

Este es el microservicio implementado por Juan Carlos Cortés Muñoz y Mario Ruano Fernández, integrantes del ms-songs.

En lo que respecta a la funcionalidad que ofrece el microservicio ms-songs, en FastMusik, los usuarios podrán buscar canciones, tanto en el sistema como en Spotify, acceder a los videoclips y letras de estas y hacer like en aquellas canciones que más les gusten.

Otras funcionalidades que derivan de este microservicio son la de generar un listado de canciones favoritas de cada usuario, crear salas de chat entre usuarios con los mismos gustos musicales y notificar al servicio de soporte de incorrecciones en el videoclip de una canción.

### Microservicio de mensajes

El modelado de datos de este microservicio se basa en las entidades de Salas y Mensajes, las cuales contienen toda la información para posibilitar las conversaciones entre usuarios del sistema. Este servicio presenta funcionalidades como la recuperación de entidades con paginación, la traducción del texto de los mensajes, las operaciones CRUD de ambas entidades y el reporte de mensajes ofensivos.

Como puntos destacables, el uso de la API externa de DeepL para la traducción y la integración interna para los reportes usando mecanismos de rollback ante fallos.

### Microservicio de soporte

El modelado de datos de este microservicio se basa en las entidades de Tickets y Reports, las cuales contienen toda la información necesaria para mantener el control y el buen funcionamiento del sistema. Este servicio presenta funcionalidades como el envío de notificaciones a los usuarios, las operaciones CRUD con las entidades y la gestión de incidencias.

Como puntos destacables están el uso de la API externa de SendGrid para enviar correos, la tolerancia a fallos desplegando un cliente adicional para la gestión de incidencias y el mecanismo de rollback incluido en la integración con los diferentes microservicios.

## Customer Agreement

Enlace al CA

## Análisis de la capacidad y pricing

Enlace a ambos

## API REST de ms-support

La documentación de la API REST de ms-support está disponible en el siguiente [enlace](https://support-fastmusik-marmolpen3.cloud.okteto.net/docs/).

## Requisitos del microservicio

En función de las distintas entidades de dominio del microservicio ms-support, los requisitos y la justificación de su implementación han sido los que se citan a continuación. Destacar que el desarrollo del microservicio se ha realizado en base a los conceptos vistos en clase y la investigación extra de los miembros de soporte.  

En concreto se han empleado las funciones que mongoose ofrece para acceder a los recurso que se encuentran en la base de datos. Respecto a la respuesta, se genera un diccionario con diferente información de utilidad tanto para su prepocesado en el frontend o su uso durante las peticiones a los endpoints.

Respecto a las integraciones entre cualquier servicio externo, se encuentran en la carperta service. Todas las peticiones se han realizado haciendo uso de axios y añadiendo el token en la cabecera si era necesario. En cuando a la captura del error se ha realizado de la misma manera que se indica anteriormente.

### Tickets
| Requisito | Justificación |
|--------|----------|
|Como usuario, quiero ver un listado de todos los tickets que he creado.| Se implementa el [listado de los tickets filtrando por el id del usuario](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L28) que solicita la acción.|
|Como administrador, quiero visualizar un listado de todos los tickets que han creado los usuarios.| Se realiza el [listado](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L8) de todos los tickets mediante un GET simple.|
|Como usuario, quiero revisar el estado de las incidencias que he creado.|Desde el listado de tickets, el usuario puede acceder a uno de ellos para ver el estado del mismo. Esto se ha realizado a partir de [GET filtrado](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L61) por el identificador único del usuario.|
|Como usuario, quiero poder crear una incidencia sobre un problema en la aplicación.| El usuario puede [crear un ticket](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L102) para informar sobre sus incidencias mediante un formulario. Debe rellenar un título, un campo de texto describiendo el problema y la prioridad.|
|Como usuario, quiero poder notificar si la URL de un vídeo no corresponde a la canción que se muestra.| El usuario puede notificar una URL incorrecta de un vídeo. Esta lógica la ha realizado el equipo de canciones a partir de una [integración](https://github.com/fisg4/ms-songs) con el POST de la API de nuestro microservicio, pudiendo realizar la notifición desde la misma vista de la canción.|
|Como administrador, quiero poder actualizar el estado de los tickets que manden los usuarios.|Los administradores pueden [validar o rechazar](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L143) los tickets que envían los usuarios a traves de un modal simple. También podrán establecer una prioridad distinta para el ticket si lo consideran necesario. En caso de validar una incidencia sobre la URL del vídeo de una canción, el vídeo se actualiza automáticamente por la [integración realizada junto con el microservicio de canciones](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/services/songs.js#L8). Además se ha creado un mecanismo de [rollback](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/models/ticket.js#L75) para deshacer la actualización del ticket en caso de que falle la integración por algún motivo.|
|Como administrador, quiero eliminar un ticket que lleva mucho tiempo resuelto.|Accediendo a un ticket, el administrador puede [eliminarlo](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/ticketController.js#L224) haciendo clic en un botón.|

### Reports
| Requisito | Justificación |
|--------|----------|
|Como usuario, quiero ver un listado de todos los reportes que he creado.|Se implementa el [listado de los reportes filtrando por el id](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L29) del usuario que solicita la acción.|
|Como administrador, quiero visualizar un listado de todos los reportes que han creado los usuarios.|Se realiza el [listado](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L10) de todos los reportes mediante un GET simple.|
|Como usuario, quiero revisar el estado de los reportes que he creado.|Desde el listado de reportes, el usuario puede acceder a uno de ellos para ver el estado del mismo. Esto se ha realizado a partir de [GET filtrado](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L61) por el identificador único del usuario.|
|Como usuario, quiero poder reportar un mensaje ofensivo.| El usuario puede [reportar](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L102) un mensaje que considere ofensivo. Esta funcionalidad la ha realizado el [microservicio de mensajes](https://github.com/fisg4/ms-messages) lanzando una petición al POST de nuestra API, permitiendo al usuario realizar el reporte desde el mismo mensaje.|
|Como administrador, quiero poder actualizar el estado de los reportes que manden los usuarios.|Los administradores pueden [validar o rechazar](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L167) los reportes que envían los usuarios a través de un modal simple, que se despliega en la vista del reporte. Aquellos reportes validados desencadenarán en primer lugar, el baneo del mensaje por medio de una [integración con el microservicio de mensajes](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/services/messages.js#L8) y por otro lado, el envío de un correo electorónico al usuario que informó del comportamiento negativo. Esto ha sido posible gracias a la [integración con la API externa de SendGrid](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/services/sendgrid.js#L17) y con el [microservicio de usuarios](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/services/users.js#L6). Se ha implementado también un mecanismo de [rollback](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L149), para que en caso de que falle alguna de las peticiones, todo vuelva al estado anterior a la actualización.|
|Como administrador, quiero eliminar un reporte que lleva mucho tiempo resuelto.|Accediendo a un report, el administrador puede [eliminarlo](https://github.com/fisg4/ms-support/blob/2619b82a41c35d6ac8e4325eff35df8333bae034/server/controllers/reportController.js#L229) haciendo clic en un botón.|

## Análisis de esfuerzos

Enlace a PDF resumen exportado desde Clockify:
[Elena](https://github.com/fisg4/ms-support/blob/support-document/Clockify_Informe_De_Tiempo_Detallado_Elena.pdf)
[Alejandro](https://github.com/fisg4/ms-support/blob/support-document/Clockify_Informe_De_Tiempo_Detallado_Alejandro.pdf)


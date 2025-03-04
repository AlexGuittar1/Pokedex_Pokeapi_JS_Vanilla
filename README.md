# Pokédex Project Pokeapi

## Descripción

Este proyecto consiste en una Pokédex interactiva desarrollada con **JavaScript Vanilla**, que permite a los usuarios buscar
ver y almacenar información sobre Pokémon. La aplicación ofrece la posibilidad de explorar los detalles de cada Pokémon
agregar favoritos y filtrar por tipo. Además, los usuarios pueden exportar sus Pokémon favoritos a un archivo `.json`.

## Características

- **Búsqueda por nombre o ID de Pokémon**: Los usuarios pueden buscar Pokémon por nombre o ID, con una interfaz intuitiva para facilitar la navegación.
- **Filtrar por tipo de Pokémon**: Permite a los usuarios buscar Pokémon por su tipo Ej. Fuego, Agua, etc.
- **Favoritos**: Los usuarios pueden agregar Pokémon a su lista de favoritos y verlos con el boton View Favorites.
- **Exportar e importar favoritos**: Los usuarios pueden exportar sus Pokémon favoritos a un archivo `.json`, al igual que importar esos favoritos.
- **Interfaz Responsive**: Adaptable a diferentes tamaños de pantalla, garantizando una buena experiencia de usuario en dispositivos móviles y de escritorio.
- **Diseño atractivo**: Utiliza un diseño limpio y moderno con gradientes y colores definidos por tipo de Pokémon.

## Estructura del Proyecto

├── main/ │ └── index.html ├── CSS/ │ └── styles.css ├── JS/ │ └── script.js ├── img/ │ ├── close.svg │ ├── favicon.png │ ├── logo.png │ 
├── nofound.png │ └── icon/ │ ├── fire.png │ ├── water.png │ └── ... (otros iconos de tipos de Pokémon) └── README.md

## Tecnologías Utilizadas

- **HTML**: Estructura de la página web.
- **CSS**: Estilos visuales, incluyendo diseño responsivo y gradientes de colores.
- **JavaScript**: Lógica para gestionar la interacción con la Pokédex, búsquedas, filtrado de tipos, almacenamiento de favoritos y exportación de datos.

## Estilos CSS Destacados

- **Gradientes**: La página utiliza un fondo con un gradiente que combina colores azules, verdes y blancos para ofrecer una experiencia visual atractiva.
- **Diseño Responsive**: El diseño se ajusta a pantallas de diferentes tamaños, utilizando `@media queries` para mejorar la experiencia de usuario en dispositivos móviles.
- **Tarjetas de Pokémon**: Cada Pokémon se presenta en una tarjeta con información sobre su nombre, tipo(s) y una imagen. Los tipos de Pokémon están representados por un color específico que se aplica a cada tarjeta.
- **Interacciones de Hover**: Se añaden interacciones visuales como cambios de color en botones y tarjetas al pasar el ratón.
- **Modal**: Al hacer clic en un Pokémon, se muestra un modal con detalles adicionales, incluyendo estadísticas y detalles del Pokémon.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/pokedex.git

3. Abre el archivo `index.html` en tu navegador preferido.

## Cómo Usar

1. **Buscar Pokémon**: Ingresa el nombre o ID de un Pokémon en el campo de búsqueda y presiona el botón para obtener los resultados.
2. **Filtrar por tipo**: Utiliza el selector de tipo para ver los Pokémon de un tipo específico.
3. **Agregar a Favoritos**: Haz click en el ícono de corazón en la tarjeta del Pokémon para agregarlo a tu lista de favoritos.
4. **Ver Favoritos**: Haz clic en el botón de "View Favorites" para ver los Pokémon que has marcado como favoritos.
5. **Exportar Favoritos**: Haz click en el botón "Export Favorites" para descargar tu lista de favoritos en un archivo `.json`.
6. **Importar Favoritos**: Haz click en el boton "Import Favorites" para importar tu lista de favoritos de un archivo `.json`.


## Contribuciones

Si deseas contribuir a este proyecto, puedes realizar un *fork* del repositorio y enviar un *pull request* con tus mejoras.

1. Forkea el repositorio.
2. Crea una nueva rama (`git checkout -b nueva-funcionalidad`).
3. Realiza tus cambios.
4. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`).
5. Envía el *pull request*.



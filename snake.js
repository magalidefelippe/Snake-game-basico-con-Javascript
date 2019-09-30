const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');

const SIZE = 20;
const head = { x: 0, y: 0 };
let body = [];
let food = null; //comida

let dx = 0;
let dy = 0;

let lastAxis; //si el ultimo eje que tuvo movimiento fue el eje y recibe este valor
//Añadir movimiento tipo animacion.
setInterval(main, 250); //1 segundo

function main() {
    update(); //Se encarga de acutualizar las variables del juego(el inicio)
    draw(); //dibujar los objetos del juego: serpiente y comida

}

function update() {
    //detencion de la colision de la serpiente
    const collisionDetected = checkSnakeCollision(); ///colision del cuerpo
    if (collisionDetected) {
        gameOver();
        return;
    }
    //salvar la posicion previa del ultimo elemento de la serpiente
    let prevX, prevY;
    if (body.length >= 1) {
        prevX = body[body.length - 1].x;
        prevY = body[body.length - 1].y;
    } else {
        prevX = head.x;
        prevY = head.y;
    }

    //El cuerpo de la serpiente siga a la cabeza
    for (let i = body.length - 1; i >= 1; --i) {
        body[i].x = body[i - 1].x //elem1 <- elem 0
        body[i].y = body[i - 1].y
    }
    if (body.length >= 1) {
        body[0].x = head.x;
        body[0].y = head.y;
    }

    //se encarga de actualizar las coordenadas de la cabeza de la serpiente
    head.x += dx;
    head.y += dy;
    //determinamos en que eje ha ocurrido el ultimo movimiento
    if (dx != 0) {
        lastAxis = 'x';
    } else if (dy != 0) {
        lastAxis = 'y';
    }

    //detectar si la serpiente paso por el alimento

    if (food && head.x === food.x && head.y === food.y) {
        food = null;
        //aumentar el tamaño
        increaseSnakeSize(prevX, prevY)
    }

    //se encarga de generar la comida.
    if (!food) {

        food = randomFoodPosition(); //determinamos su posicion con numeros aleatorios
    }

}

function randomFoodPosition() {

    let position;
    do {
        position = { x: getRandomX(), y: getRandomY() };
    } while (checkFoodCollision(position));
    return position;
}

function checkFoodCollision(position) {
    //comparar las coordenadas del alimento y el cuerpo serpiente
    for (let i = 0; i < body.length; ++i) {
        if (position.x == body[i].x && position.y == body[i].y) {
            return true;

        }
    }
    //comparar coordenadas con la cabeza de la serpiente
    if (position.x == head.x && position.y == head.y) {
        return true;

    }
    return false;
}

function checkSnakeCollision() {
    //la colision se genera cuando las coordenadas de la cabeza
    //sean igual a las coordenadas de uno de los elementos del cuerpo
    for (let i = 0; i < body.length; ++i) {
        if (head.x == body[i].x && head.y == body[i].y) {
            return true;

        }
    }
    //verificar que la serpiente no se salga de los limites permitidos
    const topCollision = (head.y < 0);
    const bottomCollision = (head.y > 440);
    const rightCollision = (head.x > 380);
    const leftCollision = (head.x < 0);
    if (topCollision || bottomCollision || rightCollision || leftCollision) {
        return true;
    }
    return false;
}

function gameOver() {
    console.log('gameOver');
    alert('Has perdido');
    head.x = 0;
    head.y = 0;
    dx = 0;
    dy = 0;
    body = []
}

function increaseSnakeSize(prevX, prevY) {
    body.push({
        x: prevX,
        y: prevY
    })
}

function getRandomX() {
    //el numero se tiene que multiplicar x 20 y debe ser menor a 380. osea hasta el 19
    return 20 * parseInt(Math.random() * 20);
}

function getRandomY() {
    return 20 * parseInt(Math.random() * 23);
}

function draw() {
    context.fillStyle = 'white'
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
    //cabeza
    drawObjet(head, 'green');
    //cuerpo
    body.forEach(
        elem => drawObjet(elem, 'green')
    );
    //alimento
    drawObjet(food, 'red');

}

function drawObjet(obj, color) {
    context.fillStyle = color;
    context.fillRect(obj.x, obj.y, SIZE, SIZE);
}
//capturar las pulsaciones del teclado
document.addEventListener('keydown', moveSnake);
//mover la cabeza
function moveSnake(event) {
    //las condiciones restringen el movimiento sobre el mismo eje
    switch (event.key) {
        case 'ArrowUp':
            console.log('mover hacia arriba');
            if (lastAxis != 'y') {
                dx = 0;
                dy = -SIZE;
            }
            break;
        case 'ArrowDown':
            console.log('mover hacia abajo');
            if (lastAxis != 'y') {
                dx = 0;
                dy = +SIZE;
            }
            break;
        case 'ArrowLeft':
            console.log('mover hacia la izquierda');
            if (lastAxis != 'x') {
                dx = -SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            console.log('mover hacia la derecha');
            if (lastAxis != 'x') {
                dx = +SIZE;
                dy = 0;
            }
            break;

    }
}
game = {
    canvas: null,
    ctx: null,
    imagen: null,
    caratula: true,
    imagenEnemigo: null,
    teclaPulsada: null,
    tecla: [],
    colorBala: "red",
    colorBala2: "yellow",
    balas_array: new Array(),
    balasEnemigas_array: new Array(),
    enemigos_array: new Array(),
    disparo: false,
    puntos: 0,
    finJuego: false,
    boing: null,
    disparoJugador: null,
    intro: null,
    fin: null,
}

/*******************
CONSTANTES
********************/
const KEY_ENTER = 13;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const BARRA = 32;
/*****************
OBJETOS
******************/
function Bala(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.dibujar = function () {
        //Dibujar la bala
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y = this.y - 4;
        game.ctx.restore();
    };
    this.disparar = function () {
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala2;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y = this.y + 6;
        game.ctx.restore();
    };
}

function Jugador(x) {
    this.x = x;
    this.y = 450;
    this.w = 30;
    this.h = 15;
    this.dibujar = function (x) {
        this.x = x;
        game.ctx.drawImage(game.imagen, this.x, this.y, this.w, this.h);
    };
}
function Enemigo(x, y) {

    this.x = x;
    this.y = y;
    this.w = 35;
    this.veces = 0;
    this.dx = 5;
    this.ciclos = 0;
    this.num = 14;
    this.figura = true;
    this.vive = true;
    this.dibujar = function () {
        //Retraso
        if (this.ciclos > 30) {
            //saltitos
            if (this.veces > this.num) {
                this.dx *= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx > 0) ? this.dx++ : this.dx--;
            } else {
                this.x += this.dx;
            }
            this.veces++;
            this.ciclos = 0;
            this.figura = !this.figura;

        } else {
            this.ciclos++;
        }
        if (this.figura) {
            game.ctx.drawImage(game.imagenEnemigo, 0, 0, 40, 30, this.x, this.y, 35, 30);
        } else {
            game.ctx.drawImage(game.imagenEnemigo, 50, 0, 35, 30, this.x, this.y, 35, 30);
        }
    };
}
/***********
FUNCIONES
************/
const caratula = () => {
    let imagen = new Image();
    imagen.src = "imagenes/cara.webp";
    imagen.onload = () => {
        game.ctx.drawImage(imagen, 150, 30);
    }
}
const seleccionar = (e) => {
    if (game.caratula) {
        inicio();
    }
}
const inicio = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.caratula = false;
    game.jugador = new Jugador(0);
    game.x = game.canvas.width / 2;
    game.jugador.dibujar(game.x);
    animar();
}
const animar = () => {
    if (game.finJuego == false) {

        requestAnimationFrame(animar);
        verificar();
        pintar();
        colisiones();
    }
}
const colisiones = () => {
    let enemigo, bala;
    for (var i = 0; i < game.enemigos_array.length; i++) {
        for (var j = 0; j < game.balas_array.length; j++) {
            enemigo = game.enemigos_array[i];
            bala = game.balas_array[j];

            if (enemigo != null && bala != null) {

                if ((bala.x > enemigo.x) &&
                    (bala.x < enemigo.x + enemigo.w) &&
                    (bala.y > enemigo.y) &&
                    (bala.y < enemigo.y + enemigo.w)) {
                    enemigo.vive = false;
                    game.enemigos_array[i] = null;
                    game.balas_array[j] = null;
                    game.disparo = false;
                    game.puntos += 10;
                    game.boing.play();
                }
            }
        }
    }
    //
    //Colisión balas enemigas
    //
    for (var j = 0; j < game.balasEnemigas_array.length; j++) {
        bala = game.balasEnemigas_array[j];

        if (bala != null) {

            if ((bala.x > game.jugador.x) &&
                (bala.x < game.jugador.x + game.jugador.w) &&
                (bala.y > game.jugador.y) &&
                (bala.y < game.jugador.y + game.jugador.h)) {
                gameOver();
            }
        }
    }
}
const gameOver = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.balas_array = [];
    game.enemigos_array = [];
    game.balasEnemigas_array = [];
    game.finJuego = true;
    game.fin.play();
    mensaje("Game Over", 100, 60);
    mensaje("Lograste" + game.puntos + "puntos", 220);

    if (game.puntos > 100 && game.puntos <= 200) {
        mensaje("casi lo logras", 340);

    } else if (game.puntos > 200) {
        mensaje("felicitaciones", 340);

    } else {

        mensaje("lo sentimos", 340);
    }
}
const mensaje = (cadena, y, tamano = 40) => {
    let medio = (game.canvas.width) / 2;
    game.ctx.save();
    game.ctx.fillStyle = "green";
    game.ctx.strokeStyle = "blue";
    game.ctx.textBaseline = "top";
    game.ctx.font = "bold " + tamano + "px Courier";
    game.ctx.textAlign = "center";
    game.ctx.fillText(cadena, medio, y);
    game.ctx.restore();
}
const verificar = () => {
    if (game.tecla[KEY_RIGHT]) game.x += 10;
    if (game.tecla[KEY_LEFT]) game.x -= 10;

    //verificacion de cañon
    if (game.x > game.canvas.width - 10) game.x = game.canvas.width - 10;
    if (game.x < 0) game.x = 10;

    //disparo
    if (game.tecla[BARRA] && !game.disparo) {
        game.disparo = true;
        game.balas_array.push(new Bala(game.jugador.x + 12, game.jugador.y - 3, 5));
        game.disparoJugador.play();
    
        setTimeout(() => {
            game.disparo = false; // Permite disparar nuevamente después de 200ms
        }, 2000);
    }
    
    //
    //Disparo enemigo
    //
    if (Math.random() > 0.88) {

        dispararEnemigo();

    }
}
const dispararEnemigo = () => {
    var ultimos = new Array();

    for (var i = game.enemigos_array.length - 1; i > 0; i--) {
        if (game.enemigos_array[i] != null) {
            ultimos.push(i);
        }

        if (ultimos.length == 15) break;
    }

    d = ultimos[Math.floor(Math.random() * 10)];

    game.balasEnemigas_array.push(new Bala(game.enemigos_array[d].x + game.enemigos_array[d].w / 2, game.enemigos_array[d].y, 5));
}
const pintar = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    score();

    game.jugador.dibujar(game.x);

    //mover las balas
    for (var i = 0; i < game.balas_array.length; i++) {
        if (game.balas_array[i] != null) {
            game.balas_array[i].dibujar();
            if (game.balas_array[i].y < 0) {
                game.disparo = false;
                game.balas_array[i] = null;
            }
        }
    }
    //
    //Balas Enemigas
    //
    for (var i = 0; i < game.balasEnemigas_array.length; i++) {
        if (game.balasEnemigas_array[i] != null) {
            game.balasEnemigas_array[i].disparar();
            if (game.balasEnemigas_array[i].y > game.canvas.height)
                game.balasEnemigas_array[i] = null;
        }
    }
    //enemigos
    for (var i = 0; i < game.enemigos_array.length; i++) {
        if (game.enemigos_array[i] != null) {

            game.enemigos_array[i].dibujar();

        }
    }
}
const score = () => {

    game.ctx.save();
    game.ctx.fillStyle = "white";
    game.ctx.font = "bold 20px Courier";
    game.ctx.fillText("SCORE: " + game.puntos, 10, 20);
    game.ctx.restore();
}
/*************
LISTENER
**************/
document.addEventListener("keydown", function (e) {
    game.teclaPulsada = e.keyCode;
    game.tecla[e.keyCode] = true;

});

document.addEventListener("keyup", function (e) {
    game.tecla[e.keyCode] = false;

});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Evita el menú contextual
    if (game.finJuego) {
        setTimeout(reiniciarJuego, 100); // Pequeño retraso para evitar problemas visuales
    }
});

const reiniciarJuego = () => {
    // Reiniciar todas las variables del juego
    game.balas_array = [];
    game.enemigos_array = [];
    game.balasEnemigas_array = [];
    game.tecla = [];
    game.puntos = 0;
    game.finJuego = false;
    game.caratula = true;
    game.disparo = false; // Asegurar que el disparo se pueda activar de nuevo

    // Limpiar pantalla y volver a carátula
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    caratula();

    // Volver a asignar evento de clic para iniciar el juego
    game.canvas.addEventListener("click", seleccionar, false);

    // **Volver a generar los enemigos**
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            game.enemigos_array.push(new Enemigo(100 + 40 * j, 30 + 45 * i));
        }
    }

    // **Recrear el jugador**
    game.jugador = new Jugador(game.canvas.width / 2);
};

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTomiout(callback, 17); }
})();

window.onload = function () {
    game.canvas = document.getElementById("canvas");
    if (game.canvas && game.canvas.getContext) {
        game.ctx = canvas.getContext("2d");
        if (game.ctx) {

            //
            // Sonidos
            //

            game.boing = document.getElementById("boing");
            game.disparoJugador = document.getElementById("disparo");
            game.intro = document.getElementById("intro");
            game.fin = document.getElementById("fin");
            game.imagen = new Image();
            game.imagen.src = "imagenes/torre.fw.png";

            //crear enemigos
            game.imagenEnemigo = new Image();
            game.imagenEnemigo.src = "imagenes/invader.fw.png";
            game.imagenEnemigo.onload = function () {

                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 10; j++) {
                        game.enemigos_array.push(new Enemigo(100 + 40 * j, 30 + 45 * i));
                    }
                }
            }
            caratula();
            game.canvas.addEventListener("click", seleccionar, false);

        } else {
            alert("NO cuentas con CANVAS")
        };
    }
}
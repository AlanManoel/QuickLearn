const formFila = document.querySelector("#formularioFila");
const btnAdd = document.querySelector("#btnAdd");
const btnRemover = document.querySelector("#btnRemover");

const corAmarelo = "#C09F28";

const canvas = document.querySelector("#canva");
const contextoCanva = canvas.getContext('2d');

function desenhaQuadrado(posicaoX, posicaoY, textoEsquerda) {
    const larguraRetangulo = 80;
    const alturaRetangulo = 40;

    //Criando o quadrado
    contextoCanva.beginPath();
    contextoCanva.rect(posicaoX, posicaoY, larguraRetangulo, alturaRetangulo);
    contextoCanva.strokeStyle = corAmarelo;
    contextoCanva.lineWidth = 2;
    contextoCanva.stroke();

    const meioX = posicaoX + larguraRetangulo / 2;
    const meioY = posicaoY + alturaRetangulo / 2;

    //Criando a linha no meio do retangulo
    contextoCanva.beginPath();
    contextoCanva.moveTo(meioX, posicaoY);
    contextoCanva.lineTo(meioX, posicaoY + alturaRetangulo);
    contextoCanva.strokeStyle = corAmarelo;
    contextoCanva.lineWidth = 2;
    contextoCanva.stroke();

    //Definindo caracteristica da font
    contextoCanva.font = "12px Arial";
    contextoCanva.fillStyle = "white";
    contextoCanva.textBaseline = "middle";

    // Adicionar mensagem "Inicio" no primeiro bloco
    if (posicaoX === 10) {
        contextoCanva.fillText("Inicio", posicaoX + 22, posicaoY + 54);
    }

    // Adicionar mensagem "fim" no fim bloco
    if (posicaoX === (fila.tamanho - 1) * 110 + 10 && fila.tamanho > 1) {
        contextoCanva.fillText("Fim", posicaoX + 30, posicaoY + 54);
    }

    //Lado esquerdo
    const xA = meioX - 30;
    contextoCanva.fillText("Valor", xA - 5, 20);
    contextoCanva.fillText("Prox.", xA + 35, 20);

    contextoCanva.font = "16px Arial";
    if (textoEsquerda < 10) {
        contextoCanva.fillText(textoEsquerda, xA + 5, meioY + 2);
    } else if (textoEsquerda < 100) {
        contextoCanva.fillText(textoEsquerda, xA, meioY + 2);
    } else {
        contextoCanva.fillText(textoEsquerda, xA - 3, meioY + 2);
    }

    //Lado direito
    const raioCirculo = 5;
    const xCirculo = meioX + larguraRetangulo / 2 - raioCirculo - 15;
    contextoCanva.beginPath();
    contextoCanva.arc(xCirculo, meioY, raioCirculo, 0, 2 * Math.PI);
    contextoCanva.strokeStyle = corAmarelo;
    contextoCanva.lineWidth = 2;
    contextoCanva.stroke();
}

function animarQuadrado(posicaoX, posicaoY, textoEsquerda, posicaoFinalY) {
    let quadroAtual = 0;
    const quadrosTotais = 100;
    const incrementoY = (posicaoFinalY - posicaoY) / quadrosTotais;

    function animacao() {
        quadroAtual++;

        contexto.clearRect(0, 0, canvas.width, canvas.height);

        const novaPosicaoY = posicaoY + quadroAtual * incrementoY;
        desenhaQuadrado(posicaoX, novaPosicaoY, textoEsquerda);

        if (quadroAtual < quadrosTotais) {
            requestAnimationFrame(animacao);
        }
    }

    animacao();
}

function desenharSeta(posicaoX, posicaoY, comprimento) {
    const larguraSeta = 8;
    contextoCanva.beginPath();
    contextoCanva.moveTo(posicaoX, posicaoY);

    contextoCanva.lineTo(posicaoX + comprimento, posicaoY);

    contextoCanva.lineTo(posicaoX + comprimento - larguraSeta, posicaoY - larguraSeta);
    contextoCanva.moveTo(posicaoX + comprimento, posicaoY);
    contextoCanva.lineTo(posicaoX + comprimento - larguraSeta, posicaoY + larguraSeta);

    contextoCanva.strokeStyle = "white";
    contextoCanva.lineWidth = 2;
    contextoCanva.stroke();
}

function redesenharFila(inicio, tamanho) {
    contextoCanva.clearRect(0, 0, canvas.width, canvas.height);
    let ponteiro = inicio;
    let posX = 10;

    if (tamanho === 1) {
        desenhaQuadrado(posX, 30, ponteiro.valor);
        posX += 110;
        ponteiro = ponteiro.proximo;
    } else {
        while (ponteiro) {
            desenhaQuadrado(posX, 30, ponteiro.valor);
            posX += 110;
            if (ponteiro.proximo) {
                desenharSeta(posX - 50, 50, 48);
            }
            ponteiro = ponteiro.proximo;
        }
    }
}

class Node {
    constructor(valor) {
        this.valor = valor;
        this.proximo = null;
    }
}

class Fila {
    constructor() {
        this.inicio = null;
        this.final = null;
        this.tamanho = 0;
    }

    adicionar(valor) {
        this.tamanho += 1;
        const ponteiro = new Node(valor);
        if (!this.inicio) {
            this.inicio = ponteiro;
            this.final = ponteiro;
        }
        this.final.proximo = ponteiro;
        this.final = ponteiro;
    }

    remover() {
        if (this.tamanho > 1) {
            this.tamanho--;
            this.inicio = this.inicio.proximo;
        } else if (this.tamanho == 1) {
            this.tamanho--;
            this.inicio = null;
            this.final = null;
        }
    }

    adicionarDesenho(valor) {
        this.adicionar(valor);
        redesenharFila(this.inicio, this.tamanho);
    }

    removerComDesenho() {
        this.remover();
        redesenharFila(this.inicio, this.tamanho);
    }
}

const fila = new Fila();

formFila.addEventListener("click", (event) => {
    event.preventDefault();
    const inputValor = document.querySelector("#valorAdd");
    const valorAdd = inputValor.value;

    if (event.target === btnAdd) {
        if (fila.tamanho >= 12) {
            alert("Fila cheia");
        } else if (valorAdd > 999) {
            alert("Apenas numeros menores que 1000.");
        } else if (valorAdd !== "") {
            fila.adicionarDesenho(valorAdd);
        }
        inputValor.value = "";
        inputValor.focus();
    } else if (event.target === btnRemover) {
        fila.removerComDesenho();
    }
});

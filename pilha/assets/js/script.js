const formPilha = document.querySelector("#formPilha");
const btnAdd = document.querySelector("#btnAdd");
const btnRemover = document.querySelector("#btnRemover");

const corAmarelo = "#C09F28";

const canvas = document.querySelector("#canva");
const contextoCanva = canvas.getContext('2d');


contextoCanva.strokeStyle = corAmarelo;
contextoCanva.lineWidth = 4;

// Borda Direita
contextoCanva.beginPath();
contextoCanva.moveTo(712, 492);
contextoCanva.lineTo(712, 115);
contextoCanva.stroke();

// Borda Esquerda
contextoCanva.beginPath();
contextoCanva.moveTo(608, 492);
contextoCanva.lineTo(608, 115);
contextoCanva.stroke();

// Borda inferior
contextoCanva.beginPath();
contextoCanva.moveTo(608, 490);
contextoCanva.lineTo(712, 490);
contextoCanva.stroke();

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
    contextoCanva.font = "14px Arial";
    contextoCanva.fillStyle = "white";
    contextoCanva.textBaseline = "middle";

    //Lado esquerdo
    const xA = meioX - 30;
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

    // Desenhar setas
    if (pilha.tamanho > 1) {
        if (posicaoY !== 440) {
            desenharSeta(meioX + 20, meioY + 46, 25);
        }
    }
}


function desenharSeta(posicaoX, posicaoY, comprimento) {
    const larguraSeta = 8;
    contextoCanva.beginPath();

    contextoCanva.moveTo(posicaoX, posicaoY);
    contextoCanva.lineTo(posicaoX, posicaoY - comprimento);

    contextoCanva.lineTo(posicaoX - larguraSeta, posicaoY - comprimento + larguraSeta);
    contextoCanva.moveTo(posicaoX, posicaoY - comprimento);
    contextoCanva.lineTo(posicaoX + larguraSeta, posicaoY - comprimento + larguraSeta);

    contextoCanva.strokeStyle = "white";
    contextoCanva.lineWidth = 2;
    contextoCanva.stroke();
}

function redesenharPilha(topo) {
    contextoCanva.clearRect(610, 0, 100, 488);
    contextoCanva.clearRect(502, 0, 100, 488);
    let ponteiro = topo;
    let posY = 440;

    const pilhaInvertida = [];

    while (ponteiro) {
        pilhaInvertida.push(ponteiro);
        ponteiro = ponteiro.proximo;
    }

    for (let i = pilhaInvertida.length - 1; i >= 0; i--) {
        desenhaQuadrado(620, posY, pilhaInvertida[i].valor);
        posY -= 45;
    }

    if (pilhaInvertida.length > 0) {

        const setaPosY = 480 - (pilhaInvertida.length - 1) * 45 - 20;
        const larguraSeta = 8;
        const comprimento = 30;
        const setaPosX = 570;

        contextoCanva.font = "16px Arial";
        contextoCanva.fillStyle = corAmarelo;
        contextoCanva.textBaseline = "middle";

        contextoCanva.fillText("Topo", 530, setaPosY);

        contextoCanva.beginPath();
        contextoCanva.moveTo(setaPosX, setaPosY);

        contextoCanva.lineTo(setaPosX + comprimento, setaPosY);

        contextoCanva.lineTo(setaPosX + comprimento - larguraSeta, setaPosY - larguraSeta);
        contextoCanva.moveTo(setaPosX + comprimento, setaPosY);
        contextoCanva.lineTo(setaPosX + comprimento - larguraSeta, setaPosY + larguraSeta);

        contextoCanva.strokeStyle = corAmarelo;
        contextoCanva.lineWidth = 2;
        contextoCanva.stroke();
    }
}

class Node {
    constructor(valor) {
        this.valor = valor;
        this.proximo = null;
    }
}

class Pilha {
    constructor() {
        this.topo = null;
        this.tamanho = 0;
    }

    adicionar(valor) {
        const node = new Node(valor);
        node.proximo = this.topo;
        this.topo = node;
        this.tamanho += 1;
    }

    remover() {
        if (this.tamanho !== 0) {
            this.topo = this.topo.proximo;
            this.tamanho -= 1;
        }
    }

    adicionarDesenho(valor) {
        this.adicionar(valor);
        redesenharPilha(this.topo);
    }

    removerComDesenho() {
        this.remover();
        redesenharPilha(this.topo);
    }
}

const pilha = new Pilha();

formPilha.addEventListener("click", function (event) {
    event.preventDefault();

    if (event.target === btnAdd) {
        const inputValor = document.querySelector("#valorAdd");
        const valor = inputValor.value;

        if (pilha.tamanho >= 8) {
            alert("Pilha Cheia")
        } else if (valor > 999) {
            alert("Apenas numeros menores que 1000.");
        } else if (valor !== "") {
            pilha.adicionarDesenho(valor);
        }

        inputValor.value = "";
        inputValor.focus();
    } else if (event.target === btnRemover) {
        pilha.removerComDesenho();
    }
});
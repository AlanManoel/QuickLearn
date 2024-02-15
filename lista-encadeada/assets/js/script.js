const formLista = document.querySelector("#formListaEncadeada");
const btnAdd = document.querySelector("#btnAdd");
const btnRemover = document.querySelector("#btnRemover");
const btnPop = document.querySelector("#btnPop");
const btnInserir = document.querySelector("#btnInserir");

const corAmarelo = "#C09F28";

const canvas = document.querySelector("#canvas");
const contextoCanva = canvas.getContext('2d');

function desenhaQuadrado(posicaoX, posicaoY, textoEsquerda, posicao) {
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

    const xA = meioX - 30;
    contextoCanva.fillText("Valor", xA - 5, 20);
    contextoCanva.fillText("Prox.", xA + 35, 20);
    contextoCanva.fillText(`Posição: ${posicao}`, xA , 85);
    
    //Lado esquerdo
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

function redesenharLista(lista) {
    contextoCanva.clearRect(0, 0, canvas.width, canvas.height);
    let ponteiro = lista;
    let posX = 10;
    let posicaoNumero = 0

    if (this.tamanho === 1) {
        desenhaQuadrado(posX, 30, ponteiro.valor, posicaoNumero);
        posX += 110;
        ponteiro = ponteiro.proximo;
    } else {
        while (ponteiro) {
            desenhaQuadrado(posX, 30, ponteiro.valor, posicaoNumero);
            posX += 110;
            if (ponteiro.proximo) {
                desenharSeta(posX - 50, 50, 48);
            }
            ponteiro = ponteiro.proximo;
            posicaoNumero ++;
        }
    }
}

class Node {
    constructor(valor) {
        this.valor = valor;
        this.proximo = null;
    }
}

class Lista {
    constructor() {
        this.lista = null;
        this.tamanho = 0;
    }

    adicionar(valor) {
        if (this.lista === null) {
            this.lista = new Node(valor);
            this.tamanho++;
        } else {
            let ponteiro = this.lista;
            while (ponteiro.proximo !== null) {
                ponteiro = ponteiro.proximo;
            }
            ponteiro.proximo = new Node(valor);
            this.tamanho++;
        }
    }

    insert(index, valor) {
        if (index <= 0) {
            let node = new Node(valor);
            node.proximo = this.lista;
            this.lista = node;
            this.tamanho++;
        } else if (index <= this.tamanho) {
            let ponteiro = this.lista;
            let node = new Node(valor);
            for (let cont = 0; cont < index - 1; cont++) {
                ponteiro = ponteiro.proximo;
            }
            node.proximo = ponteiro.proximo;
            ponteiro.proximo = node;
            this.tamanho++;
        } else {
            this.adicionar(valor);
        }
    }

    pop() {
        if (this.tamanho > 1) {
            let ponteiro = this.lista;
            while (ponteiro.proximo !== null) {
                if (ponteiro.proximo.proximo === null) {
                    ponteiro.proximo = null;
                    this.tamanho--;
                } else {
                    ponteiro = ponteiro.proximo;
                }
            }
        } else if (this.tamanho === 1) {
            this.lista = null;
            this.tamanho--;
        }
    }

    remove(valor) {
        if (this.tamanho > 0) {
            let ponteiro = this.lista;
            if (ponteiro.valor === valor) {
                ponteiro = ponteiro.proximo;
                this.lista = ponteiro;
                this.tamanho--;
            } else {
                while (ponteiro.proximo !== null) {
                    if (ponteiro.proximo.valor === valor) {
                        ponteiro.proximo = ponteiro.proximo.proximo;
                        this.tamanho--;
                        break;
                    } else {
                        ponteiro = ponteiro.proximo;
                    }
                }
            }
        }
    }

    adicionarDesenho(valor) {
        this.adicionar(valor);
        redesenharLista(this.lista);
    }

    inserirComDesenho(posicao, valor) {
        this.insert(posicao, valor);
        redesenharLista(this.lista);
    }

    popComDesenho() {
        this.pop();
        redesenharLista(this.lista);
    }

    removerComDesenho(valor) {
        this.remove(valor);
        redesenharLista(this.lista);
    }
}

const lista = new Lista();

formLista.addEventListener("click", (event) => {
    event.preventDefault();
    const inputValor = document.querySelector("#valorAdd");
    const valorAdd = inputValor.value;
    if (event.target === btnAdd) {

        if (lista.tamanho >= 12) {
            alert("Lista Cheia")
        } else if (valorAdd > 999 || valorAdd <= 0) {
            alert("Apenas numeros maiores que 0 e menores que 1000.");
        } else if (valorAdd !== "") {
            lista.adicionarDesenho(valorAdd);
        }
        inputValor.value = "";
        inputValor.focus();
    }
    else if (event.target === btnRemover) {
        lista.removerComDesenho(valorAdd);
    } else if (event.target === btnPop) {
        lista.popComDesenho();
    } else if (event.target === btnInserir) {
        const inputPosicaoInserir = document.querySelector("#posicaoInserir");
        const inputValorInserir = document.querySelector("#valorInserir");

        const valorPosicaoInserir = inputPosicaoInserir.value;
        const ValorInserir = inputValorInserir.value;

        if (valorPosicaoInserir && ValorInserir) {
            if (ValorInserir > 999 || ValorInserir <= 0) {
                alert("Apenas numeros maiores que 0 e menores que 1000.");
            } else {
                lista.inserirComDesenho(valorPosicaoInserir, ValorInserir);
                inputValorInserir.value = "";
                inputPosicaoInserir.value = "";
            }
        } else if (!valorPosicaoInserir) {
            alert("Campo posição vazio.")
        } else {
            alert("Campo valor vazio.")
        }
    }
});

function Sprite(x, y, largura, altura) {
    this.x = x; this.y = y; this.largura = largura; this.altura = altura;
    this.desenha = function (xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
    }
}
var bg = new Sprite(0, 0, 600, 600),
    spritepersonagem = new Sprite(500, 5, 113, 86),
    perdeu = new Sprite(616, 0, 381, 267),
    start = new Sprite(484, 286, 382, 183),
    recordnew = new Sprite(494, 477, 310, 67),
    grama = new Sprite(0, 556, 472, 42),
    Arvore = new Sprite(915, 303, 155, 184);

var canvas, ctx, ALTURA, LARGURA, frame = 0, maxPulos = 3, velocidade = 5, estadoAtual, record, img,
    estados = {
        jogar: 0, jogando: 1, perdeu: 2
    },
    chao = {
        y: 557,
        altura: 2,
        cor: "#60330c",
        desenha: function () {
            grama.desenha(0, this.y, LARGURA, this.altura);
        }
    },
    bloco = {
        x: 50, y: 150, altura: spritepersonagem.altura, largura: spritepersonagem.largura, cor: "#0b0b0b", gravidade: 1.5, velocidade: 0, forcaDoPulo: 29, qtdPulos: 0, score: 0, atualiza: function () {
        this.velocidade += this.gravidade; this.y += this.velocidade;
            if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
                this.y = chao.y - this.altura + 10; this.qtdPulos = 0; this.velocidade = 0;
            }
        },
        pula: function () {
            if (this.qtdPulos < maxPulos) { this.velocidade = -this.forcaDoPulo; this.qtdPulos++; }
        },
        reset: function () {
        this.velocidade = 0; this.y = 0;
            if (this.score > record) { localStorage.setItem("record", this.score); record = this.score; }
            this.score = 0;
        },
        desenha: function (xCanvas, yCanvas) {
            spritepersonagem.desenha(this.x, this.y);
        }
    },
    obstaculos = {
        _obs: [], cores: ["#e81111", "#fff", "#0027fc", "#e1f407", "#f00194", "#000"], tempoInsere: 0,
        insere: function () {
            this._obs.push({
                x: LARGURA,
                largura: 50,
                altura: 150,
                cor: this.cores[Math.floor(6 * Math.random())]
            });
            this.tempoInsere = 50 + Math.floor(30 * Math.random());
        },
        atualiza: function () {
            if (this.tempoInsere == 0)
                this.insere();
            else
                this.tempoInsere--;
            for (var i = 0, tam = this._obs.length; i < tam; i++) {
                var obs = this._obs[i];
                obs.x -= velocidade;
                if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
                    estadoAtual = estados.perdeu;
                }
                else if (obs.x == 0) { bloco.score++; }
                else if (obs.x <= -obs.largura) {
                    this._obs.splice(i, 1)
                    tam--;
                    i--;
                }
            }
        },
        limpa: function () {
            this._obs = [];
        },
        desenha: function () {
            for (var i = 0, tam = this._obs.length; i < tam; i++) {
                var obs = this._obs[i];
                Arvore.desenha(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
            }
        }
    };
function clique(evt) {
    if (estadoAtual == estados.jogando) { bloco.pula(); }
    else if (estadoAtual == estados.jogar) { estadoAtual = estados.jogando; }
    else if (estadoAtual == estados.perdeu && bloco.y >= 10 * ALTURA) { estadoAtual = estados.jogar; obstaculos.limpa(); bloco.velocidade = 0; bloco.reset(); }
}
function main() {
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth
    if (LARGURA >= 500) {
        LARGURA = 440
        ALTURA = 600
    }
    canvas = document.createElement("canvas"); canvas.width = LARGURA; canvas.height = ALTURA; canvas.style.border = "5px solid #000";
    ctx = canvas.getContext("2d"); document.body.appendChild(canvas); document.addEventListener("mousedown", clique); estadoAtual = estados.jogar; record = localStorage.getItem("record");
    if (record == null) {
        record = 0;
    }
    img = new Image();
    img.src = "http://static.wixstatic.com/media/0355b9_e0f8968bb37d4e87b00e1ef47ff50897.png_srz_p_1094_697_75_22_0.50_1.20_0.00_png_srz";
    roda();
}
function desenha() {
    bg.desenha(0, 0);
    if (estadoAtual == estados.jogar) {
        start.desenha(LARGURA / 2 - 185, ALTURA / 2 - 150, 200, 100);
    }
    else if (estadoAtual == estados.perdeu) {
        perdeu.desenha(LARGURA / 2 - 190, ALTURA / 2 - 230, 225, 150);
        ctx.fillStyle = "#e1f407";
        ctx.font = "40px Arial";
        if (bloco.score >= 10) {
            if (bloco.score >= 100) {
                ctx.fillText(bloco.score, LARGURA / 2 - 32, ALTURA / 2 - 0);
            } else {
                ctx.fillText(bloco.score, LARGURA / 2 - 22, ALTURA / 2 - 0);
            }
        } else {
            ctx.fillText(bloco.score, LARGURA / 2 - 12, ALTURA / 2 - 0);
        }
        ctx.font = "35px Arial";
        ctx.fillStyle = "#338b58";
        if (record >= 10) {
            if (bloco.score >= 100) {
                ctx.fillText(record, LARGURA / 2 - -10, ALTURA / 2 - 85);
            } else {
                ctx.fillText(record, LARGURA / 2 - -20, ALTURA / 2 - 85);
            }
        } else {
            ctx.fillText(record, LARGURA / 2 - -30, ALTURA / 2 - 85);
        }
        if (bloco.score > record) {
            recordnew.desenha(LARGURA / 2 - 150, ALTURA / 2 - -20, 225, 150);
        }
    }
    else if (estadoAtual == estados.jogando) {
        obstaculos.desenha(); chao.desenha(); bloco.desenha(); ctx.fillStyle = "#e1f407"; ctx.font = "100px Arial";
        if (bloco.score >= 10) {
            if (bloco.score >= 100) { ctx.fillText(bloco.score, 310, 100); } else { ctx.fillText(bloco.score, 320, 100); }
        } else { ctx.fillText(bloco.score, 330, 100); }
    }
    chao.desenha(); obstaculos.desenha(); bloco.desenha();
}
function roda() { atualiza(); desenha(); window.requestAnimationFrame(roda); }
function atualiza() {
    frame++; bloco.atualiza();
    if (estadoAtual == estados.jogando) { obstaculos.atualiza(); }
}
function barraEspaço(evt) {
    bloco.pula();
}
main();
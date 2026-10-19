
const visor = document.getElementById("visor");
const botoes = document.getElementById("botoes");

let atual = "0";
let anterior = null;
let operador = null;
let novoNumero = false;

function mostrar() {
    visor.value = atual.replace(".", ",");
}

function limpar() {
    atual = "0";
    anterior = null;
    operador = null;
    novoNumero = false;
    mostrar();
}

function calcular() {
    if (operador === null || anterior === null) return;

    const a = anterior;
    const b = Number(atual);
    let resultado;

    switch (operador) {
        case "+": resultado = a + b; break;
        case "-": resultado = a - b; break;
        case "*": resultado = a * b; break;
        case "/":
            if (b === 0) {
                atual = "Erro";
                anterior = null;
                operador = null;
                novoNumero = true;
                mostrar();
                return;
            }
            resultado = a / b;
            break;
    }

    atual = Number.isFinite(resultado)
        ? String(Number(resultado.toPrecision(12)))
        : "Erro";

    anterior = null;
    operador = null;
    novoNumero = true;
    mostrar();
}

botoes.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");
    if (!botao) return;

    const valor = botao.dataset.valor;
    const acao = botao.dataset.acao;

    if (acao === "limpar") {
        limpar();
        return;
    }

    if (acao === "apagar") {
        if (atual === "Erro" || novoNumero) {
            limpar();
        } else {
            atual = atual.length > 1 ? atual.slice(0, -1) : "0";
            if (atual === "-") atual = "0";
            mostrar();
        }
        return;
    }

    if (acao === "decimal") {
        if (atual === "Erro") limpar();

        if (novoNumero) {
            atual = "0.";
            novoNumero = false;
        } else if (!atual.includes(".")) {
            atual += ".";
        }

        mostrar();
        return;
    }

    if (acao === "sinal") {
        if (atual !== "Erro" && Number(atual) !== 0) {
            atual = String(-Number(atual));
            mostrar();
        }
        return;
    }

    if (acao === "calcular") {
        calcular();
        return;
    }

    if (valor === "%") {
        if (atual !== "Erro") {
            atual = String(Number(atual) / 100);
            novoNumero = false;
            mostrar();
        }
        return;
    }

    if (["+", "-", "*", "/"].includes(valor)) {
        if (atual === "Erro") limpar();

        if (operador !== null && !novoNumero) {
            calcular();
        }

        anterior = Number(atual);
        operador = valor;
        novoNumero = true;
        return;
    }

    if (/^\d$/.test(valor)) {
        if (atual === "Erro" || novoNumero) {
            atual = valor;
            novoNumero = false;
        } else if (atual.replace("-", "").replace(".", "").length < 15) {
            atual = atual === "0" ? valor : atual + valor;
        }

        mostrar();
    }
});

document.addEventListener("keydown", (evento) => {
    const tecla = evento.key;

    if (/^\d$/.test(tecla)) {
        botoes.querySelector(`[data-valor="${tecla}"]`)?.click();
    } else if (["+", "-", "*", "/"].includes(tecla)) {
        botoes.querySelector(`[data-valor="${tecla}"]`)?.click();
    } else if (tecla === "Enter" || tecla === "=") {
        evento.preventDefault();
        botoes.querySelector('[data-acao="calcular"]').click();
    } else if (tecla === "Backspace") {
        botoes.querySelector('[data-acao="apagar"]').click();
    } else if (tecla === "Escape") {
        limpar();
    } else if (tecla === "." || tecla === ",") {
        botoes.querySelector('[data-acao="decimal"]').click();
    }
});

mostrar();
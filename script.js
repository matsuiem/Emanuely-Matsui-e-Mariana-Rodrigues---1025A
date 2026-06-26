import { PersonagemItem } from "./PersonagemItem.js";

const form = document.querySelector("form");

let historico = JSON.parse(localStorage.getItem("historicoHP")) || [];

let personagens = [];
let personagemAtual;

buscarPersonagens();

renderizarTabela();

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const tentativa = new FormData(form).get("personagem");

    document.getElementById("img").classList.remove("silhouette");

    document.getElementById("nome").innerHTML = personagemAtual.name;

    historico.push(
        new PersonagemItem(
            personagemAtual.id,
            personagemAtual.name,
            tentativa
        )
    );

    const resultado = document.getElementById("resultado");

    if (tentativa.toLowerCase() == personagemAtual.name.toLowerCase()) {

        resultado.innerHTML = "Acertou!";
        resultado.style.color = "green";

    } else {

        resultado.innerHTML = "Errou!";
        resultado.style.color = "red";

    }

    renderizarTabela();

});

function buscarPersonagens() {

    fetch("https://hp-api.onrender.com/api/characters")

        .then(res => res.json())

        .then(data => {

            personagens = data.filter(p => p.image != "");

            personagemAtual = personagens[Math.floor(Math.random() * personagens.length)];

            document.getElementById("img").src = personagemAtual.image;

            document.getElementById("img").classList.add("silhouette");

            document.getElementById("nome").innerHTML = "????";

            document.getElementById("casa").innerHTML =
                personagemAtual.house || "Sem casa";

            document.getElementById("card").style.display = "block";

        });

}

function renderizarTabela() {

    const tbody = document.getElementById("tbody");

    tbody.innerHTML = "";

    historico.forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.tentativa}</td>
                <td>
                    <button onclick="apagar('${item.id}')">
                        Apagar
                    </button>
                </td>
            </tr>
        `;

    });

    localStorage.setItem("historicoHP", JSON.stringify(historico));

}

function apagar(id) {

    historico = historico.filter(item => item.id != id);

    renderizarTabela();

}

window.apagar = apagar;
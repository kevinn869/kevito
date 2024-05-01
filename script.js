document.addEventListener("DOMContentLoaded", async function() {
    const carouselImagesContainer = document.getElementById('carouselImages');

    async function buscarImagensCarrossel(qtd) {
        const apiUrl = "https://movies.slideworks.cc/movies?limit=" + qtd;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const imageUrls = data.data.map(movie => movie.image_url);
            return imageUrls.concat(imageUrls);
        } catch (error) {
            console.error("Erro ao buscar imagens para o carrossel:", error);
            return [];
        }
    }
    
    document.addEventListener("DOMContentLoaded", async function() {
        const carouselInner = document.querySelector(".carousel-inner");
        const imageUrls = await buscarImagensCarrossel(3);
    
        for (const url of imageUrls) {
            const img = document.createElement("img");
            img.src = url;
            img.alt = "Imagem";
            carouselInner.appendChild(img);
        }
    
        const images = carouselInner.querySelectorAll("img");
        const imageWidth = images[0].clientWidth;
        const totalImages = images.length;
        let currentIndex = 0;
    
        function moveCarousel() {
            currentIndex++;
            if (currentIndex >= totalImages) {
                currentIndex = 0;
            }
            const displacement = -currentIndex * imageWidth;
            carouselInner.style.transform = `translateX(${displacement}px)`;
        }
    
        setInterval(moveCarousel, 3000);
    });
    

    async function buscarFilmes(pagina, qtd) {
        const url = "https://movies.slideworks.cc/movies?page=" + pagina + "&limit=" + qtd;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const filmes = data.data.map(movie => ({
                title: movie.title,
                image_url: movie.image_url,
                rating: movie.rating,
                year: movie.year,
                crew: movie.crew
            }));
            return { data: filmes };
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        }
    }

    const imageUrls = await buscarImagensCarrossel(10);

imageUrls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = "Banner";
    carouselImagesContainer.appendChild(img);
});

const images = document.querySelectorAll('.carousel-images img');
const imageWidth = images[0].clientWidth;
let counter = 0;

setInterval(() => {
    counter++;
    carouselImagesContainer.style.transition = "transform 0.5s ease-in-out";
    carouselImagesContainer.style.transform = `translateX(${-imageWidth * counter}px)`;

    if (counter >= 10) {
        setTimeout(() => {
            counter = 0;
            carouselImagesContainer.style.transition = "none";
            carouselImagesContainer.style.transform = `translateX(0px)`;
        }, 500);
    }
}, 3000);

let pagina_atual = 1;

async function carregarFilmes() {
  try {    
    const filmes = await buscarFilmes(pagina_atual, 32);
    const filmesContainer = document.getElementById('filmesContainer');
    filmesContainer.innerHTML = ''; // Limpa o conteúdo atual

    function criarFilmeElement(filme) {
      const filmeDiv = document.createElement('div');
      filmeDiv.classList.add('filme');

      const img = document.createElement('img');
      img.src = filme.image_url;
      img.alt = filme.title;

      const titulo = document.createElement('h2');
      titulo.textContent = filme.title;
      titulo.id = 'numero_pagina'; // Troca a classe para o ID numero_pagina

      const rating = document.createElement('p');
      rating.textContent = `Classificação: ${filme.rating}`;

      const ano = document.createElement('p');
      ano.textContent = `Ano: ${filme.year}`;

      const equipe = document.createElement('p');
      equipe.textContent = `Equipe: ${filme.crew}`;

      filmeDiv.appendChild(img);
      filmeDiv.appendChild(titulo);
      filmeDiv.appendChild(ano);
      filmeDiv.appendChild(equipe);
      filmeDiv.appendChild(rating);

      filmesContainer.appendChild(filmeDiv);
    }

    if (filmes && filmes.data) {
      filmes.data.forEach(criarFilmeElement);
    } else {
      console.error("Os dados de filmes não estão no formato esperado.");
    }

    // Altera o valor do elemento com o ID numero_pagina para o número da página atual
    const numeroPagina = document.getElementById('numero_pagina');
    if (numeroPagina) {
      numeroPagina.textContent = "Página " + pagina_atual;
    }

    // Habilita ou desabilita o botão "Anterior" dependendo da página atual
    const anteriorBtn = document.querySelector(".page-item:first-child button");
    if (pagina_atual === 1) {
      anteriorBtn.parentElement.classList.add('disabled');
    } else {
      anteriorBtn.parentElement.classList.remove('disabled');
    }

    if (pagina_atual >= 8) {
        proximoBtn.parentElement.classList.add('disabled');
      } else {
        proximoBtn.parentElement.classList.remove('disabled');
      }

  } catch (error) {
    console.error("Erro ao buscar e exibir filmes:", error);
  }
}

async function proximoPagina() {
  pagina_atual++;
  await carregarFilmes();
}

async function anteriorPagina() {
  if (pagina_atual > 1) {
    pagina_atual--;
    await carregarFilmes();
  }
}

const proximoBtn = document.querySelector(".page-item:last-child button");
const anteriorBtn = document.querySelector(".page-item:first-child button");

proximoBtn.addEventListener("click", proximoPagina);
anteriorBtn.addEventListener("click", anteriorPagina);

carregarFilmes();

});

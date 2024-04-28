document.addEventListener("DOMContentLoaded", async function() {
    const carouselImagesContainer = document.getElementById('carouselImages');

    async function buscarImagensCarrossel(qtd) {
        const apiUrl = "https://movies.slideworks.cc/movies?limit=" + qtd;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const imageUrls = data.data.map(movie => movie.image_url);
            return imageUrls;
        } catch (error) {
            console.error("Erro ao buscar imagens para o carrossel:", error);
            return [];
        }
    }

    async function buscarFilmes(qtd) {
        const url = "https://movies.slideworks.cc/movies?limit=" + qtd;
        try {
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data); // Verifique os dados recebidos da API
    
            // Mapear os resultados e criar um novo objeto com os campos desejados para cada filme
            const filmes = data.data.map(movie => ({
                title: movie.title,
                image_url: movie.image_url,
                rating: movie.rating,
                year: movie.year,
                crew: movie.crew
            }));
    
            // Retornar um objeto com a propriedade 'data' contendo o array de filmes
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

        if (counter >= images.length) {
            setTimeout(() => {
                counter = 0;
                carouselImagesContainer.style.transition = "none";
                carouselImagesContainer.style.transform = `translateX(0px)`;
            }, 500);
        }
    }, 3000);

    try {
        const filmes = await buscarFilmes(32);
        const filmesContainer = document.getElementById('filmesContainer');

        // Função para criar e adicionar elementos HTML para cada filme
        function criarFilmeElement(filme) {
            const filmeDiv = document.createElement('div');
            filmeDiv.classList.add('filme');

            const img = document.createElement('img');
            img.src = filme.image_url;
            img.alt = filme.title;

            const titulo = document.createElement('h2');
            titulo.textContent = filme.title;

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

        // Verifica se filmes possui a propriedade "data" antes de iterar sobre ela
        if (filmes && filmes.data) {
            filmes.data.forEach(criarFilmeElement);
        } else {
            console.error("Os dados de filmes não estão no formato esperado.");
        }
    } catch (error) {
        console.error("Erro ao buscar e exibir filmes:", error);
    }

});

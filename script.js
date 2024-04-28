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
        const url = apiUrl + qtd; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data); 
            return data.results; 
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
});

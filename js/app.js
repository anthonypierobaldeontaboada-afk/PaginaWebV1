const componentes = {
    navbar: "navbar.html",
    banner: "banner.html",
    hero: "hero.html",
    nosotros: "nosotros.html",
    estadisticas: "estadisticas.html",
    carreras: "carreras.html",
    servicios: "servicios.html",
    noticias: "noticias.html",
    eventos: "eventos.html",
    galeria: "galeria.html",
    contacto: "contacto.html",
    footer: "footer.html"
};

async function cargarComponentes() {

    for (const [id, archivo] of Object.entries(componentes)) {

        const contenedor = document.getElementById(id);

        if (!contenedor) continue;

        try {

            const respuesta = await fetch(`./components/${archivo}`);

            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar ${archivo}`);
            }

            contenedor.innerHTML = await respuesta.text();

        } catch (error) {

            console.error(`Error cargando ${archivo}:`, error);

        }
    }

    // Iniciar el carrusel después de cargar los componentes
    iniciarCarrusel();
}


/* =========================
   CARRUSEL DEL BANNER
========================= */

function iniciarCarrusel() {

    const slides = document.querySelectorAll(".banner-slide");
    const dots = document.querySelectorAll(".banner-dot");

    const botonAnterior = document.getElementById("banner-prev");
    const botonSiguiente = document.getElementById("banner-next");

    if (slides.length === 0) {
        console.log("No se encontraron slides del banner");
        return;
    }

    let actual = 0;

    function mostrarSlide(numero) {

        slides.forEach((slide, index) => {

            slide.classList.toggle(
                "active",
                index === numero
            );

        });

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === numero
            );

        });

        actual = numero;
    }


    function siguienteSlide() {

        let nuevo = actual + 1;

        if (nuevo >= slides.length) {
            nuevo = 0;
        }

        mostrarSlide(nuevo);
    }


    function anteriorSlide() {

        let nuevo = actual - 1;

        if (nuevo < 0) {
            nuevo = slides.length - 1;
        }

        mostrarSlide(nuevo);
    }


    if (botonSiguiente) {
        botonSiguiente.addEventListener(
            "click",
            siguienteSlide
        );
    }


    if (botonAnterior) {
        botonAnterior.addEventListener(
            "click",
            anteriorSlide
        );
    }


    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            mostrarSlide(index);

        });

    });


    // Cambio automático cada 6 segundos
    setInterval(
        siguienteSlide,
        6000
    );
}


/* =========================
   CARGAR COMPONENTES
========================= */

cargarComponentes();
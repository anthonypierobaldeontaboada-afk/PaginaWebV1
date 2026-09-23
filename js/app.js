const componentes = {
    navbar: "navbar.html",
    banner: "banner.html",
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
    iniciarNavegacion();
}

function iniciarNavegacion() {
    const itemsConMenu = document.querySelectorAll(".nav-item:has(.dropdown)");

    itemsConMenu.forEach((item) => {
        const enlace = item.querySelector(":scope > a");

        if (!enlace) return;

        enlace.setAttribute("aria-expanded", "false");

        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();

            const abierto = item.classList.toggle("is-open");
            enlace.setAttribute("aria-expanded", String(abierto));

            itemsConMenu.forEach((otroItem) => {
                if (otroItem === item) return;

                otroItem.classList.remove("is-open");
                otroItem.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
            });
        });
    });

    document.addEventListener("click", (evento) => {
        if (evento.target.closest(".nav-item:has(.dropdown)")) return;

        itemsConMenu.forEach((item) => {
            item.classList.remove("is-open");
            item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") return;

        itemsConMenu.forEach((item) => {
            item.classList.remove("is-open");
            item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
        });
    });
}

/* =========================
   CARRUSEL DEL BANNER
========================= */

function iniciarCarrusel() {

    const slides = document.querySelectorAll(".banner-slide");
    const dots = document.querySelectorAll(".banner-dot");
    const banner = document.querySelector(".banner");

    const botonAnterior = document.getElementById("banner-prev");
    const botonSiguiente = document.getElementById("banner-next");

    if (slides.length === 0) {
        console.log("No se encontraron slides del banner");
        return;
    }

    let actual = 0;
    let secuencia;

    function mostrarSlide(numero) {

        clearTimeout(secuencia);

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

        if (banner) {
            banner.classList.remove("is-sequencing");
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    banner.classList.add("is-sequencing");
                });
            });
        }

        secuencia = window.setTimeout(() => {
            banner?.classList.remove("is-sequencing");
        }, 2600);
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
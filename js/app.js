import institucionImage from "../assets/images/image.png?url";
import avanzaImage from "../assets/images/avanza.png?url";
import carreraWebImage from "../assets/images/carrera-web.jpg?url";
import egresadosImage from "../assets/images/egresados.jpg?url";
import enfermeriaImage from "../assets/images/enfermeria.jpg?url";
import heroImage from "../assets/images/hero.jpg?url";
import heroLiveImage from "../assets/images/hero-live.jpg?url";
import logoImage from "../assets/images/logo.png?url";
import mecatronicaImage from "../assets/images/mecatronica.jpg?url";
import mineduImage from "../assets/images/minedu.png?url";
import registraImage from "../assets/images/registra.png?url";
import titulaImage from "../assets/images/titula.png?url";

import banner from "../components/banner.html?raw";
import carreras from "../components/carreras.html?raw";
import contacto from "../components/contacto.html?raw";
import educacion from "../components/educacion.html?raw";
import egresados from "../components/egresados.html?raw";
import estadisticas from "../components/estadisticas.html?raw";
import eventos from "../components/eventos.html?raw";
import footer from "../components/footer.html?raw";
import galeria from "../components/galeria.html?raw";
import navbar from "../components/navbar.html?raw";
import noticias from "../components/noticias.html?raw";
import nosotros from "../components/nosotros.html?raw";
import servicios from "../components/servicios.html?raw";

const imagenesComponentes = {
    "avanza.png": avanzaImage,
    "carrera-web.jpg": carreraWebImage,
    "egresados.jpg": egresadosImage,
    "enfermeria.jpg": enfermeriaImage,
    "hero.jpg": heroImage,
    "hero-live.jpg": heroLiveImage,
    "image.png": institucionImage,
    "logo.png": logoImage,
    "mecatronica.jpg": mecatronicaImage,
    "minedu.png": mineduImage,
    "registra.png": registraImage,
    "titula.png": titulaImage
};

function prepararComponente(html) {
    return html.replace(/(["'])\.\/assets\/images\/([^"']+)\1/g, (referencia, comilla, nombre) => {
        const url = imagenesComponentes[nombre];
        if (!url) throw new Error(`No se encontró el recurso de imagen ${nombre}`);
        return `${comilla}${url}${comilla}`;
    });
}

const componentes = {
    navbar: prepararComponente(navbar),
    banner: prepararComponente(banner),
    nosotros: prepararComponente(nosotros),
    egresados: prepararComponente(egresados),
    servicios: prepararComponente(servicios),
    educacion: prepararComponente(educacion),
    estadisticas: prepararComponente(estadisticas),
    carreras: prepararComponente(carreras),
    noticias: prepararComponente(noticias),
    eventos: prepararComponente(eventos),
    galeria: prepararComponente(galeria),
    contacto: prepararComponente(contacto),
    footer: prepararComponente(footer)
};

function cargarComponentes() {

    for (const [id, contenido] of Object.entries(componentes)) {

        const contenedor = document.getElementById(id);

        if (!contenedor) continue;

        contenedor.innerHTML = contenido;
    }

    // Iniciar el carrusel después de cargar los componentes
    iniciarCarrusel();
    iniciarNavegacion();
    iniciarResaltadoProgramas();
    iniciarTabsEducacion();
}

function iniciarTabsEducacion() {
    const tabs = [...document.querySelectorAll(".educacion-tab")];
    if (tabs.length === 0) return;

    const activarTab = (tab, moverFoco = false) => {
        tabs.forEach((otroTab) => {
            const activo = otroTab === tab;
            otroTab.classList.toggle("is-active", activo);
            otroTab.setAttribute("aria-selected", String(activo));
            otroTab.tabIndex = activo ? 0 : -1;
            document.getElementById(otroTab.getAttribute("aria-controls")).hidden = !activo;
        });

        if (moverFoco) tab.focus();
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activarTab(tab));
        tab.addEventListener("keydown", (evento) => {
            let siguienteIndex = index;

            if (evento.key === "ArrowRight") siguienteIndex = (index + 1) % tabs.length;
            else if (evento.key === "ArrowLeft") siguienteIndex = (index - 1 + tabs.length) % tabs.length;
            else if (evento.key === "Home") siguienteIndex = 0;
            else if (evento.key === "End") siguienteIndex = tabs.length - 1;
            else return;

            evento.preventDefault();
            activarTab(tabs[siguienteIndex], true);
        });
    });
}

function iniciarResaltadoProgramas() {
    const contenedor = document.querySelector(".banner-programas");
    if (!contenedor) return;

    const programas = [...contenedor.querySelectorAll(".banner-programa")];
    const espacioSvg = "http://www.w3.org/2000/svg";
    const definiciones = document.createElementNS(espacioSvg, "svg");
    const defs = document.createElementNS(espacioSvg, "defs");
    const mascara = document.createElementNS(espacioSvg, "mask");
    const idMascara = "banner-programas-highlight-mask";
    definiciones.setAttribute("aria-hidden", "true");
    definiciones.classList.add("banner-programas-mask-defs");
    mascara.setAttribute("id", idMascara);
    mascara.setAttribute("maskUnits", "userSpaceOnUse");
    mascara.setAttribute("maskContentUnits", "userSpaceOnUse");
    mascara.setAttribute("mask-type", "luminance");
    defs.append(mascara);
    definiciones.append(defs);

    const recorte = document.createElement("span");
    recorte.className = "banner-programas-highlight-clip";
    const resaltado = document.createElement("span");
    resaltado.className = "banner-programas-highlight";
    resaltado.setAttribute("aria-hidden", "true");
    recorte.append(resaltado);
    contenedor.prepend(definiciones, recorte);

    let programaActivo = null;
    let temporizadorSalida;
    let temporizadorReinicio;
    let versionMovimiento = 0;
    let ultimaPosicionX = null;

    const posicionarResaltado = (programa) => {
        resaltado.style.setProperty("--highlight-x", `${programa.offsetLeft}px`);
        resaltado.style.setProperty("--highlight-y", `${programa.offsetTop}px`);
        resaltado.style.width = `${programa.offsetWidth}px`;
        resaltado.style.height = `${programa.offsetHeight}px`;
    };

    const actualizarGeometria = () => {
        const ancho = contenedor.scrollWidth;
        const alto = contenedor.scrollHeight;
        recorte.style.width = `${ancho}px`;
        recorte.style.height = `${alto}px`;
        mascara.setAttribute("x", "0");
        mascara.setAttribute("y", "0");
        mascara.setAttribute("width", String(ancho));
        mascara.setAttribute("height", String(alto));
        mascara.replaceChildren(...programas.map((programa) => {
            const rectangulo = document.createElementNS(espacioSvg, "rect");
            rectangulo.setAttribute("x", String(programa.offsetLeft));
            rectangulo.setAttribute("y", String(programa.offsetTop));
            rectangulo.setAttribute("width", String(programa.offsetWidth));
            rectangulo.setAttribute("height", String(programa.offsetHeight));
            rectangulo.setAttribute("rx", "4");
            rectangulo.setAttribute("fill", "white");
            return rectangulo;
        }));

        if (programaActivo) {
            posicionarResaltado(programaActivo);
            ultimaPosicionX = programaActivo.offsetLeft;
        }
    };

    const activar = (programa) => {
        clearTimeout(temporizadorSalida);
        clearTimeout(temporizadorReinicio);
        actualizarGeometria();
        const version = ++versionMovimiento;
        const posicionX = programa.offsetLeft;
        const reiniciarDesdeLaIzquierda = ultimaPosicionX !== null && posicionX < ultimaPosicionX;

        programas.forEach((otroPrograma) => {
            otroPrograma.classList.toggle("is-highlighted", otroPrograma === programa);
        });
        programaActivo = programa;
        ultimaPosicionX = posicionX;

        if (!reiniciarDesdeLaIzquierda) {
            posicionarResaltado(programa);
            resaltado.classList.add("is-visible");
            return;
        }

        resaltado.classList.remove("is-visible");
        temporizadorReinicio = window.setTimeout(() => {
            if (version !== versionMovimiento || programaActivo !== programa) return;

            resaltado.style.transition = "none";
            posicionarResaltado(programas[0]);
            void resaltado.offsetWidth;
            resaltado.style.removeProperty("transition");

            requestAnimationFrame(() => {
                if (version !== versionMovimiento || programaActivo !== programa) return;
                posicionarResaltado(programa);
                resaltado.classList.add("is-visible");
            });
        }, 180);
    };

    const programarSalida = (programa) => {
        if (programa.matches(":hover, :focus")) return;

        temporizadorSalida = window.setTimeout(() => {
            const siguientePrograma = programas.find((otroPrograma) => otroPrograma.matches(":hover, :focus"));
            if (siguientePrograma) {
                activar(siguientePrograma);
                return;
            }

            clearTimeout(temporizadorReinicio);
            versionMovimiento += 1;
            programaActivo = null;
            programas.forEach((otroPrograma) => otroPrograma.classList.remove("is-highlighted"));
            resaltado.classList.remove("is-visible");
        }, 70);
    };

    programas.forEach((programa) => {
        programa.addEventListener("pointerenter", () => activar(programa));
        programa.addEventListener("pointerleave", () => programarSalida(programa));
        programa.addEventListener("focus", () => activar(programa));
        programa.addEventListener("blur", () => programarSalida(programa));
    });

    window.addEventListener("resize", () => {
        actualizarGeometria();
        if (!programaActivo) ultimaPosicionX = null;
    });
    contenedor.addEventListener("scroll", actualizarGeometria, { passive: true });
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
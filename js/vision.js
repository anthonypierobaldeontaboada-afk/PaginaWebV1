const tabs = [...document.querySelectorAll(".vision-tab")];

function activarPestana(tab, moverFoco = false) {
    tabs.forEach((otraTab) => {
        const activa = otraTab === tab;
        const panel = document.getElementById(otraTab.getAttribute("aria-controls"));

        otraTab.classList.toggle("is-active", activa);
        otraTab.setAttribute("aria-selected", String(activa));
        otraTab.tabIndex = activa ? 0 : -1;
        panel.hidden = !activa;
        panel.classList.toggle("is-active", activa);
    });

    if (moverFoco) tab.focus();
}

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activarPestana(tab));
    tab.addEventListener("keydown", (event) => {
        let siguienteIndex = index;

        if (event.key === "ArrowRight") siguienteIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") siguienteIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") siguienteIndex = 0;
        else if (event.key === "End") siguienteIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activarPestana(tabs[siguienteIndex], true);
    });
});

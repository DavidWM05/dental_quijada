const frases = [
    "💰 Precios accesibles",
    "🦷 Promociones especiales cada mes",
    "📅 Primera cita con descuento",
    "👩‍⚕️ 9 Años de experiencia"
];

let index = 0;

function mostrarFrase() {
    const el = document.getElementById("typewriter");
    el.classList.remove("typewriter");
    void el.offsetWidth; // reinicia animación
    el.textContent = frases[index];
    el.classList.add("typewriter");
    index = (index + 1) % frases.length;
}

mostrarFrase();
setInterval(mostrarFrase, 3000); // cambia cada 3 segundos

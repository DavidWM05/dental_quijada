const toggle = document.getElementById('navbar-toggle');
const menu = document.getElementById('navbar-menu');
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.carousel-indicator');
const totalSlides = slides.length;
const modal = document.getElementById("modal");
const abrirModal = document.getElementById("abrirModal");
const cerrarModal = document.getElementById("cerrarModal");
const form = document.getElementById("formCita");

toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// CARRUSEL

function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (n + totalSlides) % totalSlides;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(n) {
    showSlide(n);
}

// Auto-play del carrusel (opcional)
setInterval(nextSlide, 5000);

// Mostrar modal
abrirModal.addEventListener("click", () => {
    modal.classList.add("active");
});

// Cerrar modal
function closeModal() {
    modal.classList.remove("active");
    form.reset();
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

cerrarModal.addEventListener("click", closeModal);
const closeModalBtn = document.getElementById("closeModalBtn");
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}

// Cerrar modal al hacer clic fuera del contenedor
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Validación de formulario
function validarFormulario(formData) {
    const errores = {};
    
    if (!formData.nombre.trim()) {
        errores.nombre = "El nombre es requerido";
    }
    
    if (!formData.telefono.trim()) {
        errores.telefono = "El teléfono es requerido";
    } else if (!/^[0-9\-\+\(\)\s]{10,}$/.test(formData.telefono)) {
        errores.telefono = "Teléfono inválido";
    }
    
    if (!formData.servicio) {
        errores.servicio = "Debes seleccionar un servicio";
    }
    
    if (!formData.fecha) {
        errores.fecha = "La fecha es requerida";
    } else {
        const fechaSeleccionada = new Date(formData.fecha + "T00:00:00");
        const hoy = new Date();
        debugger
        hoy.setHours(0, 0, 0, 0);
        if (fechaSeleccionada < hoy) {
            errores.fecha = "Selecciona una fecha futura";
        }
    }
    
    if (!formData.hora) {
        errores.hora = "La hora es requerida";
    }
    
    return errores;
}

// Mostrar errores en el formulario
function mostrarErrores(errores) {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    
    Object.keys(errores).forEach(campo => {
        const elemento = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
        if (elemento) {
            elemento.textContent = errores[campo];
        }
    });
}

// Enviar formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const servicio = document.getElementById("servicio").value;
    const telefono = document.getElementById("telefono").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const comentarios = document.getElementById("comentarios").value.trim();
    
    const formData = { nombre, servicio, telefono, fecha, hora, comentarios };
    const errores = validarFormulario(formData);
    
    if (Object.keys(errores).length > 0) {
        mostrarErrores(errores);
        return;
    }
    
    const telefonoOdontologo = "5217701828978";
    
    // Formatear la fecha
    const fechaObj = new Date(fecha);
    const fechaFormato = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let mensaje = `*CITA AGENDADA - Dental Quijada*\n\n`;
    mensaje += `*Datos del paciente:*\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `Teléfono: ${telefono}\n`;
    mensaje += `Servicio: ${servicio}\n\n`;
    mensaje += `*Detalles de la cita:*\n`;
    mensaje += `Fecha: ${fechaFormato}\n`;
    mensaje += `Hora: ${hora}\n`;
    
    if (comentarios) {
        mensaje += `\n*Comentarios:*\n${comentarios}\n`;
    }
    
    mensaje += `\nPor favor, confirmar esta cita.`;
    
    const url = `https://wa.me/${telefonoOdontologo}?text=${encodeURIComponent(mensaje)}`;

    // Redirigir a WhatsApp
    window.open(url, "_blank");
    
    // Cerrar modal después de enviar
    setTimeout(() => {
        closeModal();
    }, 500);
});

// Función para mostrar detalles de promoción y abrir modal
function showPromoDetail(promoId) {
    // Mapeo de promociones a servicios
    const promoMap = {
        'consulta': 'Primera Consulta Gratuita',
        'limpieza': 'Servicios Básicos',
        'blanqueamiento': 'Estética Dental',
        'ortodoncia': 'Especialidad',
        'familia': 'Paquete Familiar',
        'healthkit': 'Servicios Básicos',
        'sanvalentin': 'Estética Dental',
        'backtoschool': 'Odontopediatría',
        'newyear': 'Servicios Básicos',
        'diagnostic': 'Servicios Básicos'
    };
    
    // Establecer el servicio en el formulario
    const servicioSelect = document.getElementById('servicio');
    servicioSelect.value = promoMap[promoId] || '';
    
    // Desplazar a la sección del modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Abrir el modal
    modal.classList.add('active');
}

// Newsletter form
const newsletterForm = document.getElementById('footerNewsletter');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();
        
        if (!email) {
            alert('Por favor ingresa tu correo electrónico');
            return;
        }
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por suscribirte! Pronto recibirás nuestras promociones y consejos.');
        newsletterForm.reset();
    });
}

// Actualizar año en footer automáticamente
const footerYear = document.getElementById('footerYear');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

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

// Validación de formulario mejorada con seguridad
function validarFormulario(formData) {
    const errores = {};
    
    // Validar honeypot (campo oculto)
    if (document.getElementById("website").value.trim() !== "") {
        errores.honeypot = "Solicitud inválida";
        return errores;
    }
    
    // Nombre
    if (!formData.nombre.trim()) {
        errores.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
        errores.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    // Email
    if (!formData.email.trim()) {
        errores.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errores.email = "Correo inválido";
    }
    
    // Teléfono (mínimo 10 dígitos)
    if (!formData.telefono.trim()) {
        errores.telefono = "El teléfono es requerido";
    } else {
        const soloNumeros = formData.telefono.replace(/\D/g, '');
        if (soloNumeros.length < 10) {
            errores.telefono = "Teléfono debe tener al menos 10 dígitos";
        }
    }
    
    // Servicio
    if (!formData.servicio) {
        errores.servicio = "Debes seleccionar un servicio";
    }
    
    // Fecha
    if (!formData.fecha) {
        errores.fecha = "La fecha es requerida";
    } else {
        const fechaSeleccionada = new Date(formData.fecha + "T00:00:00");
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaSeleccionada < hoy) {
            errores.fecha = "Selecciona una fecha futura";
        }
    }
    
    // Hora
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

// Verificar Rate Limiting
function verificarRateLimiting() {
    const lastSubmitTime = localStorage.getItem('lastCitaSubmit');
    const ahora = Date.now();
    const CINCO_MINUTOS = 5 * 60 * 1000;
    
    if (lastSubmitTime) {
        const tiempoTranscurrido = ahora - parseInt(lastSubmitTime);
        if (tiempoTranscurrido < CINCO_MINUTOS) {
            const segundosRestantes = Math.ceil((CINCO_MINUTOS - tiempoTranscurrido) / 1000);
            const minutos = Math.ceil(segundosRestantes / 60);
            return {
                permitido: false,
                mensaje: `Por favor, espera ${minutos} minuto(s) antes de enviar otra solicitud.`
            };
        }
    }
    
    return { permitido: true };
}

// Desabilitar botón temporalmente
function deshabilitarBotonTemporalmente(segundos = 60) {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    let contador = segundos;
    
    submitBtn.textContent = `Espera ${contador}s...`;
    
    const intervalo = setInterval(() => {
        contador--;
        submitBtn.textContent = `Espera ${contador}s...`;
        
        if (contador <= 0) {
            clearInterval(intervalo);
            submitBtn.disabled = false;
            submitBtn.textContent = "Agendar Cita";
        }
    }, 1000);
}

// Enviar formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Verificar rate limiting PRIMERO
    const rateLimitCheck = verificarRateLimiting();
    if (!rateLimitCheck.permitido) {
        alert(rateLimitCheck.mensaje);
        deshabilitarBotonTemporalmente(300); // Deshabilitar 5 minutos
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const servicio = document.getElementById("servicio").value;
    const telefono = document.getElementById("telefono").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const comentarios = document.getElementById("comentarios").value.trim();
    
    const formData = { nombre, email, servicio, telefono, fecha, hora, comentarios };
    const errores = validarFormulario(formData);
    
    if (Object.keys(errores).length > 0) {
        mostrarErrores(errores);
        return;
    }
    
    // Guardar timestamp del envío en localStorage
    localStorage.setItem('lastCitaSubmit', Date.now().toString());
    
    const telefonoOdontologo = "5217701828978";
    
    // Formatear la fecha
    const fechaObj = new Date(fecha);
    const fechaFormato = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let mensaje = `*CITA AGENDADA - Dental Quijada*\n\n`;
    mensaje += `*Datos del paciente:*\n`;
    mensaje += `👤 Nombre: ${nombre}\n`;
    mensaje += `📧 Correo: ${email}\n`;
    mensaje += `📱 Teléfono: ${telefono}\n`;
    mensaje += `🦷 Servicio: ${servicio}\n\n`;
    mensaje += `*Detalles de la cita:*\n`;
    mensaje += `📅 Fecha: ${fechaFormato}\n`;
    mensaje += `🕐 Hora: ${hora}\n`;
    
    if (comentarios) {
        mensaje += `\n*Comentarios:*\n${comentarios}\n`;
    }
    
    mensaje += `\nPor favor, confirmar esta cita.`;
    
    const url = `https://wa.me/${telefonoOdontologo}?text=${encodeURIComponent(mensaje)}`;

    // Mostrar feedback visual
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = "✓ Enviando...";
    
    // Abrir WhatsApp
    window.open(url, "_blank");
    
    // Desabilitar botón por 5 minutos
    deshabilitarBotonTemporalmente(300);
    
    // Cerrar modal después de enviar
    setTimeout(() => {
        closeModal();
        submitBtn.textContent = "Agendar Cita";
    }, 1000);
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

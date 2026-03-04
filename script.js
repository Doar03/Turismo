// API del clima
const CONFIG = {
    API_CLIMA_KEY: '04bff5e5e4c0eb176c703c4e732182a0',
    CIUDAD_CLIMA: 'La Cruz,CO'
};

// Datos de los paquetes turísticos actualizados
const PAQUETES_INFO = {
    termales: {
        titulo: "Termales de Tajumbina",
        imagen: "termales.png",  // Ruta local
        descripcion: "Relájate en las aguas termales naturales de Tajumbina. Disfruta de un día completo de relajación en medio de la naturaleza.",
        precio: "$150.000 COP",
        duracion: "1 día completo",
        incluye: ["Acceso a piscinas termales", "Masaje de relajación", "Almuerzo típico", "Guía profesional", "Transporte ida y vuelta"],
        recomendaciones: ["Traje de baño", "Bloqueador solar", "Ropa cómoda", "Toalla", "Sandalias"]
    },
    carnaval: {
        titulo: "Carnaval de Blancos y Negros",
        imagen: "carnaval.png",  // Ruta local (sin espacio)
        descripcion: "Vive la alegría del Carnaval tradicional. Participa en desfiles y actividades culturales únicas en el municipio.",
        precio: "$250.000 COP",
        duracion: "2 días / 1 noche",
        incluye: ["Alojamiento en hostal", "Entradas a eventos", "Desayunos y comidas", "Kit carnavalero", "Seguro de viaje"],
        recomendaciones: ["Ropa que puedas manchar", "Zapatos cómodos", "Gafas de sol", "Cámara", "Efectivo para souvenirs"]
    },
    volcan: {
        titulo: "Volcán Las Animas",
        imagen: "https://i.ytimg.com/vi/Ci7YB-u65J4/maxresdefault.jpg", // Internet
        descripcion: "Aventura extrema en el volcán. Senderismo y observación de fauna y flora nativa.",
        precio: "$120.000 COP",
        duracion: "1 día de aventura",
        incluye: ["Guía certificado", "Equipo de seguridad", "Almuerzo campestre", "Seguro de accidentes", "Fotografías"],
        recomendaciones: ["Calzado de montaña", "Ropa abrigada", "Chaqueta impermeable", "Agua", "Snacks energéticos"]
    },
    museo: {
        titulo: "Museo las Animas",
        imagen: "museo.png",  // Ruta local
        descripcion: "Conoce la historia de nuestros antepasados. Viaje al pasado con artefactos arqueológicos y piezas históricas.",
        precio: "$80.000 COP",
        duracion: "Medio día cultural",
        incluye: ["Entrada al museo", "Guía especializado", "Refrigerio", "Material informativo", "Recuerdo artesanal"],
        recomendaciones: ["Cuaderno de apuntes", "Cámara sin flash", "Ganas de aprender", "Preguntas curiosas"]
    },
    completo: {
        titulo: "Experiencia Completa La Cruz",
        imagen: "https://images.unsplash.com/photo-1585506936722-fa4c85b9a6f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Internet
        descripcion: "¡Lo mejor de todo! Incluye todos los paquetes anteriores más hospedaje en hotel boutique y comida gourmet regional.",
        precio: "$650.000 COP",
        duracion: "3 días / 2 noches",
        incluye: ["Hospedaje en hotel boutique", "Todas las entradas", "Desayunos y cenas gourmet", "Guía privado", "Transporte VIP", "Seguro premium"],
        recomendaciones: ["Cámara profesional", "Ropa cómoda", "Ropa elegante para cena", "Mochila", "Protector solar"]
    },
    aventura: {
        titulo: "Aventura Extrema Nariño",
        imagen: "aventura.png",  // Ruta local
        descripcion: "Rappel, canopy, caminatas ecológicas y más. Para los amantes de la adrenalina y el deporte al aire libre.",
        precio: "$320.000 COP",
        duracion: "2 días de aventura",
        incluye: ["Equipo profesional completo", "Instructores certificados", "Almuerzos tipo camping", "Fotos y video", "Seguro de accidentes", "Transporte"],
        recomendaciones: ["Ropa deportiva", "Zapatos cerrados", "Mochila pequeña", "Guantes", "Ganas de aventura"]
    }
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Página cargada correctamente");
    iniciarTodo();
});

function iniciarTodo() {
    configurarNavegacion();
    configurarFormulario();
    configurarBotonesPaquetes();
    cargarDatosGuardados();
    cargarClima();
    inicializarAgencia();
    
    // Crear contenedor del modal 
    if (!document.getElementById('modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.classList.add('modal-oculto');
        document.body.appendChild(modalContainer);
        console.log("✅ Contenedor modal creado");
    }
}

// NAVEGACIÓN
function configurarNavegacion() {
    mostrarSeccion('inicio');
    
    document.querySelectorAll('.nav-button').forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const seccionId = this.getAttribute('href').substring(1);
            mostrarSeccion(seccionId);
        });
    });
}

function mostrarSeccion(seccionId) {
    document.querySelectorAll('section').forEach(seccion => {
        seccion.classList.remove('seccion-activa');
        seccion.classList.add('seccion-oculta');
    });
    
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.remove('seccion-oculta');
        seccionActiva.classList.add('seccion-activa');
    }
    
    document.querySelectorAll('.nav-button').forEach(boton => {
        boton.classList.remove('active');
    });
    
    const botonActivo = document.querySelector(`.nav-button[href="#${seccionId}"]`);
    if (botonActivo) {
        botonActivo.classList.add('active');
    }
    
    if (seccionId === 'paquetes') {
        setTimeout(configurarBotonesPaquetes, 100);
    }
}

// CLIMA
async function cargarClima() {
    const contenedorClima = document.getElementById('clima-info');
    if (!contenedorClima) return;
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=La Cruz,CO&appid=${CONFIG.API_CLIMA_KEY}&units=metric&lang=es`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        
        if (datos.cod === 200) {
            const temp = Math.round(datos.main.temp);
            const desc = datos.weather[0].description;
            const icon = datos.weather[0].icon;
            const humedad = datos.main.humidity;
            const viento = datos.wind.speed;
            
            contenedorClima.innerHTML = `
                <div class="info-clima">
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                    <h3>${temp}°C</h3>
                    <p>${desc}</p>
                    <div class="detalles-clima">
                        <span><i class="fas fa-tint"></i> ${humedad}%</span>
                        <span><i class="fas fa-wind"></i> ${viento} m/s</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        contenedorClima.innerHTML = `
            <div class="error-clima">
                <p> Clima no disponible</p>
            </div>
        `;
    }
}

// SISTEMA DE PAQUETES
function configurarBotonesPaquetes() {
    console.log("🔍 Configurando botones de paquetes...");
    
    const botones = document.querySelectorAll('.btn-detalles');
    
    botones.forEach(boton => {
        boton.removeEventListener('click', manejarClickBotonPaquete);
        boton.addEventListener('click', manejarClickBotonPaquete);
    });
    
    console.log(`✅ Encontrados ${botones.length} botones de detalles`);
}

function manejarClickBotonPaquete(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const boton = e.currentTarget;
    const tarjetaPaquete = boton.closest('.paquete-card');
    
    if (!tarjetaPaquete) {
        console.log(" No se encontró la tarjeta del paquete");
        return;
    }
    
    const idPaquete = tarjetaPaquete.dataset.paquete;
    console.log(" ID del paquete:", idPaquete);
    
    if (idPaquete && PAQUETES_INFO[idPaquete]) {
        mostrarDetallesPaquete(idPaquete);
    } else {
        const titulo = tarjetaPaquete.querySelector('h3')?.textContent || '';
        if (titulo.includes('Termales')) mostrarDetallesPaquete('termales');
        else if (titulo.includes('Carnaval')) mostrarDetallesPaquete('carnaval');
        else if (titulo.includes('Volcán')) mostrarDetallesPaquete('volcan');
        else if (titulo.includes('Museo')) mostrarDetallesPaquete('museo');
        else if (titulo.includes('Experiencia Completa')) mostrarDetallesPaquete('completo');
        else if (titulo.includes('Aventura Extrema')) mostrarDetallesPaquete('aventura');
        else mostrarDetallesPaquete('termales');
    }
}

// MODAL 
function mostrarDetallesPaquete(idPaquete) {
    console.log("📱 Mostrando modal para:", idPaquete);
    
    const paquete = PAQUETES_INFO[idPaquete] || PAQUETES_INFO.termales;
    
    localStorage.setItem('paqueteSeleccionado', paquete.titulo);
    
    const campoPaquete = document.getElementById('paquete-interes');
    if (campoPaquete) {
        campoPaquete.value = paquete.titulo;
    }
    
    // HTML del modal actualizado
    const modalHTML = `
        <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 9998;" onclick="cerrarModal()"></div>
        <div class="ventana-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; border-radius: 15px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); z-index: 9999; padding: 0;">
            
            <button class="btn-cerrar-x" onclick="cerrarModal()" style="position: absolute; top: 15px; right: 15px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">×</button>
            
            <div class="modal-header" style="padding: 25px 25px 15px; border-bottom: 2px solid #e2e8f0;">
                <h2 style="color: #1e3a8a; font-size: 1.8rem; margin: 0; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-info-circle" style="color: #3b82f6;"></i> 
                    ${paquete.titulo}
                </h2>
            </div>
            
            <div class="modal-body" style="padding: 25px;">
                <img src="${paquete.imagen}" alt="${paquete.titulo}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #1e3a8a; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-tag" style="color: #3b82f6;"></i> 
                        <strong>Precio:</strong> ${paquete.precio}
                    </p>
                    <p style="margin: 0; color: #1e3a8a; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-clock" style="color: #3b82f6;"></i> 
                        <strong>Duración:</strong> ${paquete.duracion}
                    </p>
                </div>
                
                <div style="color: #64748b; line-height: 1.8; margin-bottom: 25px; font-size: 1.1rem;">
                    <p style="margin: 0;">${paquete.descripcion}</p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #1e3a8a; margin-bottom: 15px; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i> 
                        Incluye:
                    </h4>
                    <ul style="padding-left: 0; margin: 0; list-style: none;">
                        ${paquete.incluye.map(item => `
                            <li style="margin: 10px 0; color: #64748b; padding-left: 25px; position: relative;">
                                <span style="color: #10b981; position: absolute; left: 0; font-weight: bold;">✓</span> 
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h4 style="color: #1e3a8a; margin-bottom: 15px; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i> 
                        Recomendaciones:
                    </h4>
                    <ul style="padding-left: 0; margin: 0; list-style: none;">
                        ${paquete.recomendaciones.map(item => `
                            <li style="margin: 10px 0; color: #64748b; padding-left: 25px; position: relative;">
                                <span style="color: #f59e0b; position: absolute; left: 0; font-weight: bold;">⚠️</span> 
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="modal-footer" style="padding: 20px 25px; text-align: center; border-top: 2px solid #e2e8f0; display: flex; gap: 15px; justify-content: center; background: #f8fafc;">
                <button onclick="reservarPaquete('${paquete.titulo}')" style="background: linear-gradient(135deg, #3b82f6 0%, #0284c7 100%); color: white; border: none; padding: 14px 30px; border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 1rem; flex: 1; max-width: 200px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.3);">
                    <i class="fas fa-calendar-check"></i> Reservar
                </button>
                <button onclick="cerrarModal()" style="background: #e2e8f0; color: #64748b; border: none; padding: 14px 30px; border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 1rem; flex: 1; max-width: 200px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = modalHTML;
        modalContainer.classList.remove('modal-oculto');
        document.body.style.overflow = 'hidden';
        console.log("✅ Modal mostrado correctamente");
    } else {
        console.log(" No se encontró el contenedor del modal");
        const nuevoContainer = document.createElement('div');
        nuevoContainer.id = 'modal-container';
        document.body.appendChild(nuevoContainer);
        nuevoContainer.innerHTML = modalHTML;
        document.body.style.overflow = 'hidden';
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function cerrarConEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', cerrarConEscape);
        }
    });
}

function cerrarModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.add('modal-oculto');
        modalContainer.innerHTML = '';
        console.log("✅ Modal cerrado");
    }
    document.body.style.overflow = 'auto';
}

function reservarPaquete(nombrePaquete) {
    cerrarModal();
    mostrarSeccion('inicio');
    mostrarNotificacion(`✅ Seleccionaste: ${nombrePaquete}`, 'success');
    
    setTimeout(() => {
        const formulario = document.getElementById('dataForm');
        if (formulario) {
            formulario.scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
}

// FORMULARIO
function configurarFormulario() {
    const formulario = document.getElementById('dataForm');
    if (!formulario) return;
    formulario.addEventListener('submit', manejarEnvioFormulario);
}

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const formulario = e.target;
    const botonEnviar = formulario.querySelector('button[type="submit"]');
    const textoOriginal = botonEnviar.innerHTML;
    
    const datos = {
        nombre: document.getElementById('nombre')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        telefono: document.getElementById('telefono')?.value.trim() || '',
        ciudad: document.getElementById('ciudad')?.value.trim() || '',
        agencia: document.getElementById('agencia')?.value || '',
        cantidad_personas: document.getElementById('cantidad-personas')?.value || '',
        paquete: document.getElementById('paquete-interes')?.value.trim() || 'No especificado'
    };
    
    // Validaciones
    if (!datos.nombre || datos.nombre.length < 3) {
        mostrarNotificacion('❌ Nombre muy corto (mínimo 3 caracteres)', 'warning');
        return;
    }
    
    if (!datos.email || !datos.email.includes('@') || !datos.email.includes('.')) {
        mostrarNotificacion('❌ Email inválido', 'warning');
        return;
    }
    
    if (!datos.ciudad) {
        mostrarNotificacion('❌ Ciudad requerida', 'warning');
        return;
    }
    
    if (!datos.agencia) {
        mostrarNotificacion('❌ Selecciona una agencia', 'warning');
        return;
    }
    
    if (!datos.cantidad_personas) {
        mostrarNotificacion('❌ Selecciona cantidad de personas', 'warning');
        return;
    }
    
    botonEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    botonEnviar.disabled = true;
    
    try {
        const resultado = await guardarEnServidor(datos);
        if (resultado && resultado.success) {
            guardarEnLocalStorage(datos);
            mostrarResumenUsuario(datos);
            mostrarNotificacion('✅ ¡Enviado correctamente!', 'success');
            setTimeout(() => {
                formulario.reset();
                botonEnviar.innerHTML = textoOriginal;
                botonEnviar.disabled = false;
            }, 2000);
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (error) {
        guardarEnLocalStorage(datos);
        mostrarResumenUsuario(datos);
        mostrarNotificacion('⚠️ Datos guardados localmente', 'warning');
        botonEnviar.innerHTML = textoOriginal;
        botonEnviar.disabled = false;
    }
}

async function guardarEnServidor(datos) {
    try {
        const formData = new FormData();
        formData.append('nombre', datos.nombre);
        formData.append('email', datos.email);
        formData.append('telefono', datos.telefono);
        formData.append('ciudad', datos.ciudad);
        formData.append('agencia', datos.agencia);
        formData.append('cantidad_personas', datos.cantidad_personas);
        formData.append('paquete', datos.paquete);
        
        const respuesta = await fetch('guardar.php', {
            method: 'POST',
            body: formData
        });
        return await respuesta.json();
    } catch (error) {
        throw error;
    }
}

function guardarEnLocalStorage(datos) {
    try {
        localStorage.setItem('ultimoUsuario', JSON.stringify({
            nombre: datos.nombre,
            email: datos.email,
            telefono: datos.telefono,
            ciudad: datos.ciudad,
            agencia: datos.agencia,
            cantidad_personas: datos.cantidad_personas
        }));
    } catch (error) {
        console.log('Error guardando en localStorage');
    }
}

function cargarDatosGuardados() {
    try {
        const ultimoUsuario = JSON.parse(localStorage.getItem('ultimoUsuario'));
        if (ultimoUsuario) {
            document.getElementById('nombre').value = ultimoUsuario.nombre || '';
            document.getElementById('email').value = ultimoUsuario.email || '';
            document.getElementById('telefono').value = ultimoUsuario.telefono || '';
            document.getElementById('ciudad').value = ultimoUsuario.ciudad || '';
            document.getElementById('agencia').value = ultimoUsuario.agencia || '';
            document.getElementById('cantidad-personas').value = ultimoUsuario.cantidad_personas || '';
        }
        
        const paqueteSeleccionado = localStorage.getItem('paqueteSeleccionado');
        if (paqueteSeleccionado) {
            const campoPaquete = document.getElementById('paquete-interes');
            if (campoPaquete) {
                campoPaquete.value = paqueteSeleccionado;
            }
        }
    } catch (error) {
        console.log('Error cargando datos guardados');
    }
}

function mostrarResumenUsuario(datos) {
    const contenedorResultado = document.getElementById('resultado');
    if (!contenedorResultado) return;
    
    const personasTexto = datos.cantidad_personas == 1 ? 'persona' : 'personas';
    
    const resumenHTML = `
        <div class="resumen-datos" style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-top: 20px; border: 2px solid #3b82f6;">
            <h3 style="color: #1e3a8a; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> 
                ¡Información recibida!
            </h3>
            <p><strong>Nombre:</strong> ${datos.nombre}</p>
            <p><strong>Email:</strong> ${datos.email}</p>
            <p><strong>Teléfono:</strong> ${datos.telefono || 'No proporcionado'}</p>
            <p><strong>Ciudad:</strong> ${datos.ciudad}</p>
            <p><strong>Agencia:</strong> ${datos.agencia}</p>
            <p><strong>Cantidad de personas:</strong> ${datos.cantidad_personas} ${personasTexto}</p>
            <p><strong>Paquete:</strong> ${datos.paquete}</p>
            <p style="color: #1e3a8a; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #3b82f6;">
                ¡Gracias por tu interés! Te contactaremos pronto desde <strong>${datos.agencia}</strong>.
            </p>
        </div>
    `;
    
    contenedorResultado.innerHTML = resumenHTML;
}

function inicializarAgencia() {
    const selectAgencia = document.getElementById('agencia');
    if (!selectAgencia) return;
    
    const agencias = [
        { valor: 'Turismo Andino', texto: 'Turismo Andino' }
    ];
    
    while (selectAgencia.options.length > 1) {
        selectAgencia.remove(1);
    }
    
    agencias.forEach(agencia => {
        const option = document.createElement('option');
        option.value = agencia.valor;
        option.textContent = agencia.texto;
        selectAgencia.appendChild(option);
    });
}

// NOTIFICACIONES
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
    let icono = 'ℹ️';
    if (tipo === 'success') icono = '✅';
    if (tipo === 'warning') icono = '⚠️';
    if (tipo === 'error') icono = '❌';
    
    notificacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${icono}</span>
            <span>${mensaje}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
    `;
    
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#d1fae5' : tipo === 'warning' ? '#fef3c7' : '#fee2e2'};
        color: ${tipo === 'success' ? '#065f46' : tipo === 'warning' ? '#92400e' : '#991b1b'};
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease;
        border-left: 4px solid ${tipo === 'success' ? '#10b981' : tipo === 'warning' ? '#f59e0b' : '#ef4444'};
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 4000);
}

// FUNCIONES GLOBALES
window.mostrarSeccion = mostrarSeccion;
window.cerrarModal = cerrarModal;
window.reservarPaquete = reservarPaquete;
window.mostrarDetallesPaquete = mostrarDetallesPaquete;
window.mostrarModalDetalles = mostrarDetallesPaquete;
window.cargarClima = cargarClima;
window.mostrarNotificacion = mostrarNotificacion;

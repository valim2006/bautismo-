// ==========================================
// CONFIGURACIÓN DE LA INVITACIÓN (Editable)
// ==========================================
// Número de WhatsApp para confirmar (código de país + código de área + número, sin '+' ni espacios)
// Ejemplo para Argentina: '5491112345678'
const WHATSAPP_PHONE = "5493854091919"; 

// Mensaje predeterminado de confirmación
const CONFIRM_MESSAGE = "Hola, quiero confirmar mi asistencia al bautismo de León";

// Ubicación en Google Maps de la Parroquia San Juan Diego
const GOOGLE_MAPS_QUERY = "Parroquia San Juan Diego CABA"; // Puedes poner dirección o link directo
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_MAPS_QUERY)}`;

// Datos para el calendario (Fecha: 25 de Julio de 2026, 10:00 AM a 12:00 PM)
const CALENDAR_EVENT = {
    title: "Bautismo de León 🕊️",
    description: "Te invitamos a compartir el bautismo de León. Lugar: Parroquia San Juan Diego.",
    location: "Parroquia San Juan Diego, CABA",
    startDate: "20260725T100000", // Formato YYYYMMDDTHHMMSS
    endDate: "20260725T120000"
};

// ==========================================
// LÓGICA DE LA INVITACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const helperText = document.getElementById("helper-text");
    const actionsContainer = document.getElementById("actions-container");
    const bgMusic = document.getElementById("bg-music");
    const sfxOpen = document.getElementById("sfx-open");
    const musicToggle = document.getElementById("music-toggle");
    const iconSoundOn = document.getElementById("icon-sound-on");
    const iconSoundOff = document.getElementById("icon-sound-off");

    let isEnvelopeOpen = false;

    // Configurar enlaces de los botones de acción
    setupActionButtons();

    // Evento para abrir el sobre
    envelope.addEventListener("click", () => {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        // 1. Iniciar Animación de apertura en CSS
        envelope.classList.add("open");
        document.getElementById("envelope-wrapper").classList.add("open");
        document.querySelector(".main-container").classList.add("open");

        // 2. Intentar reproducir música y sonido SFX
        playSfx();
        playMusic();

        // 3. Ocultar el texto de ayuda
        if (helperText) {
            helperText.style.opacity = "0";
            setTimeout(() => helperText.remove(), 500);
        }

        // 4. Mostrar botón de control de música
        musicToggle.classList.remove("hidden");
        musicToggle.classList.add("visible");

        // 5. Explotar chispas doradas desde el sello
        triggerSealBurst();

        // 6. Mostrar botones de acción y activar modo pantalla completa al concluir la animación (2.4s)
        setTimeout(() => {
            const card = document.getElementById("invitation-card");
            if (card) {
                document.body.appendChild(card);
                card.classList.add("fullscreen-card");
            }
            document.querySelector(".main-container").classList.add("fullscreen");
            actionsContainer.classList.remove("hidden");
            actionsContainer.classList.add("visible");
            // Permitir scroll si es necesario
            document.body.style.overflowY = "auto";
        }, 2400);
    });

    // Control de música
    musicToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar clics accidentales
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    function playSfx() {
        if (sfxOpen) {
            sfxOpen.currentTime = 0;
            const playPromise = sfxOpen.play();
            if (playPromise !== undefined && typeof playPromise.then === 'function') {
                playPromise.catch(err => console.log("SFX bloqueado:", err));
            }
        }
    }

    function playMusic() {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
            playPromise.then(() => {
                iconSoundOn.classList.remove("hidden");
                iconSoundOff.classList.add("hidden");
            }).catch(err => {
                console.log("El navegador bloqueó la reproducción automática, esperando interacción:", err);
            });
        } else {
            // Soporte para navegadores antiguos que no retornan Promise
            iconSoundOn.classList.remove("hidden");
            iconSoundOff.classList.add("hidden");
        }
    }

    function pauseMusic() {
        bgMusic.pause();
        iconSoundOn.classList.add("hidden");
        iconSoundOff.classList.remove("hidden");
    }

    function setupActionButtons() {
        // Enlace de WhatsApp
        const btnRsvp = document.getElementById("btn-rsvp");
        btnRsvp.href = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(CONFIRM_MESSAGE)}`;
    }
});

// ==========================================
// SISTEMA DE PARTÍCULAS (Canvas)
// ==========================================

const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let burstParticles = [];

// Redimensionar canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Clase Partícula (Hojas de olivo o estrellas flotantes)
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Inicializar distribuidas por toda la pantalla
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.density = Math.random() * 20 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.01 - 0.005;
        // Tipo: 'leaf' (hoja verde sutil) o 'star' (estrella dorada sutil)
        this.type = Math.random() > 0.6 ? 'leaf' : 'star';
        
        if (this.type === 'leaf') {
            // Tonos de verde oliva suaves y traslúcidos
            this.color = `rgba(${120 + Math.random() * 30}, ${170 + Math.random() * 30}, ${120 + Math.random() * 30}, ${0.15 + Math.random() * 0.15})`;
        } else {
            // Tonos dorados suaves y traslúcidos
            this.color = `rgba(245, 158, 11, ${0.15 + Math.random() * 0.2})`;
        }
    }

    update() {
        this.y += this.speedY;
        this.angle += this.spin;
        // Movimiento oscilatorio lateral sutil
        this.x += Math.sin(this.y / this.density) * 0.5 + this.speedX;

        // Resetear al salir de pantalla
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset();
        }
    }

    draw() {
        if (this.type === 'leaf') {
            drawLeaf(ctx, this.x, this.y, this.size, this.angle, this.color);
        } else {
            drawStar(ctx, this.x, this.y, this.size, this.color);
        }
    }
}

// Clase Partícula de Explosión (Confeti colorido y dinámico)
class BurstParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Tamaño del confeti
        this.sizeWidth = Math.random() * 8 + 4;
        this.sizeHeight = Math.random() * 12 + 6;
        
        // Velocidad y dirección (con inclinación hacia arriba)
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 3;
        
        this.speedX = Math.cos(angle) * velocity;
        this.speedY = Math.sin(angle) * velocity - 2; // Bias hacia arriba
        
        this.gravity = 0.2;
        this.friction = 0.97;
        
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.008; // Mayor duración en pantalla
        
        // Paleta de colores festiva
        const colors = [
            "#38bdf8", // Celeste cielo
            "#0284c7", // Celeste oscuro
            "#f59e0b", // Oro brillante
            "#fbbf24", // Dorado claro
            "#ec4899", // Rosa
            "#10b981", // Verde oliva claro
            "#ffffff", // Blanco
            "#a7f3d0"  // Verde menta
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Rotación y giro en el aire
        this.rotationAngle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.speedY += this.gravity;
        
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.rotationAngle += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);
        ctx.fillStyle = this.color;
        
        if (this.shape === 'rect') {
            ctx.fillRect(-this.sizeWidth / 2, -this.sizeHeight / 2, this.sizeWidth, this.sizeHeight);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.sizeWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Función auxiliar para dibujar una hoja de olivo
function drawLeaf(context, x, y, size, angle, color) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.beginPath();
    context.fillStyle = color;
    // Dibuja una bonita hoja ovalada puntiaguda
    context.moveTo(0, -size);
    context.quadraticCurveTo(size * 0.5, 0, 0, size);
    context.quadraticCurveTo(-size * 0.5, 0, 0, -size);
    context.fill();
    context.restore();
}

// Función auxiliar para dibujar una estrella de 4 puntas dorada
function drawStar(context, x, y, size, color) {
    context.save();
    context.beginPath();
    context.fillStyle = color;
    // Dibujar estrella de 4 puntas
    context.moveTo(x, y - size);
    context.lineTo(x + size * 0.3, y - size * 0.3);
    context.lineTo(x + size, y);
    context.lineTo(x + size * 0.3, y + size * 0.3);
    context.lineTo(x, y + size);
    context.lineTo(x - size * 0.3, y + size * 0.3);
    context.lineTo(x - size, y);
    context.lineTo(x - size * 0.3, y - size * 0.3);
    context.closePath();
    context.fill();
    context.restore();
}

// Inicializar partículas de fondo
const maxParticles = 40;
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
}

// Detonar la explosión del sello
function triggerSealBurst() {
    // Coordenadas aproximadas del centro del sobre/sello
    const rect = canvas.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;

    const burstCount = 180; // Más partículas para un efecto festivo potente
    for (let i = 0; i < burstCount; i++) {
        burstParticles.push(new BurstParticle(x, y));
    }
}

// Bucle de animación del Canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Actualizar y dibujar partículas de fondo (lluvia sutil)
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // 2. Actualizar y dibujar partículas de la explosión (sello)
    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.update();
        bp.draw();
        
        // Eliminar partículas invisibles
        if (bp.alpha <= 0) {
            burstParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Iniciar bucle
animate();

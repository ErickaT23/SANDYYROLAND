document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("audioPlayer");
    var iconoPlayPause = document.getElementById("iconoPlayPause");
    var audioBubble = document.getElementById("audio-bubble");
    var playPauseButton = audioBubble;
    var progressBar = document.getElementById("progress-bar");
    var currentTimeDisplay = document.getElementById("current-time");
    var durationTimeDisplay = document.getElementById("duration-time");

    var modal = document.getElementById('photo-modal');
    var seal = document.getElementById("seal");
    let currentSlide = 0;   
    const wishes = [];

    const carousel = document.getElementById("couple-carousel");
    const carouselImages = ["/images/S1.png", "/images/S3.png", "/images/S4.png"];
    let carouselIndex = 0;

    if (carousel) {
        setInterval(function () {
            carouselIndex = (carouselIndex + 1) % carouselImages.length;
            carousel.classList.add("is-changing");
            setTimeout(function () {
                carousel.src = carouselImages[carouselIndex];
                carousel.classList.remove("is-changing");
            }, 400);
        }, 3500);
    }

    // Función para abrir el sobre y reproducir la música
    function openEnvelopeAndPlayMusic() {
        var envelopeTop = document.getElementById("envelope-top");
        var envelopeBottom = document.getElementById("envelope-bottom");
         var envelope = document.getElementById("envelope");
         var invitation = document.getElementById("invitation");
      
        envelopeTop.style.transform = 'translateY(-100vh)';
        envelopeBottom.style.transform = 'translateY(100vh)';
      
         setTimeout(function() {
             envelope.classList.add('hidden');
             invitation.classList.remove('hidden');
             audioBubble.classList.remove('hidden');
         }, 1000);
      
        audio.play().then(function() {
             iconoPlayPause.classList.remove("fa-play");
             iconoPlayPause.classList.add("fa-pause");
             audioBubble.classList.add("is-playing");
            updateProgress(); 
        }).catch(function(error) {
            console.log('Playback failed: ', error);
             iconoPlayPause.classList.add("fa-play");
             iconoPlayPause.classList.remove("fa-pause");
             audioBubble.classList.remove("is-playing");
        });
      }
      
      // 👇 Esta línea es la clave:
      window.openEnvelopeAndPlayMusic = openEnvelopeAndPlayMusic;
      

    // ✅ Solo un listener para el sello (corregido)
    seal.addEventListener("click", function(event) {
        event.stopPropagation();
        seal.disabled = true; // evita múltiples clics
        openEnvelopeAndPlayMusic();
    });

    function togglePlayPause() {
        if (!audio || !iconoPlayPause) return;

        requestAnimationFrame(() => {
            iconoPlayPause.classList.toggle("fa-play");
            iconoPlayPause.classList.toggle("fa-pause");
        });

        setTimeout(() => {
            if (audio.paused) {
                audio.play().then(() => audioBubble.classList.add("is-playing")).catch(console.error);
            } else {
                audio.pause();
                audioBubble.classList.remove("is-playing");
            }
        }, 50);
    }

    function updateProgress() {
        audio.addEventListener("timeupdate", function() {
            var progress = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.value = progress;

            var currentMinutes = Math.floor(audio.currentTime / 60);
            var currentSeconds = Math.floor(audio.currentTime % 60);
            currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;

            if (!isNaN(audio.duration)) {
                var durationMinutes = Math.floor(audio.duration / 60);
                var durationSeconds = Math.floor(audio.duration % 60);
                durationTimeDisplay.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
            }
        });
    }

    if (progressBar) {
        progressBar.addEventListener("input", function() {
            var newTime = (progressBar.value / 100) * audio.duration;
            audio.currentTime = newTime;
        });
    }

    playPauseButton.addEventListener("click", function() {
        togglePlayPause();
    });

    const targetDate = new Date('2026-12-13T17:00:00').getTime();
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

        if (distance < 0) {
            clearInterval(countdown);
            document.querySelector('.countdown').textContent = "Gracias por habernos acompañado en este día tan especial.";
        }
    }, 1000);

    // Aparición de textos con scroll
    const elementsToFade = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elementsToFade.forEach(element => {
        const delay = [...elementsToFade].indexOf(element) * 0.05;
        element.style.transitionDelay = `${delay}s`;
        observer.observe(element);
    });

    // Galería
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('photo-modal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal();
        }
    });

    // Optimización visual
    document.querySelector(".title").classList.add("visible");

    // Buenos deseos
    function displayWishes() {
        const wishesDiv = document.getElementById('wishes');
        wishesDiv.innerHTML = wishes.map(wish => `<p><strong>${wish.name}:</strong> ${wish.message}</p>`).join('');
    }

    function toggleWishForm() {
        document.getElementById('wish-form').classList.toggle('hidden');
    }

    function toggleWishes() {
        const wishesDiv = document.getElementById('wishes');
        wishesDiv.classList.toggle('hidden');
      }      

      window.toggleWishes = toggleWishes;


    window.changePhoto = function(element) {
        const mainPhotoModal = document.getElementById('main-photo');
        const mainPhoto = document.getElementById('main-photo-modal');
        mainPhoto.src = element.src;
        mainPhotoModal.src = element.src;
        if (element !== mainPhoto) {
            openModal();
        }
    }

    function openModal() {
        document.getElementById('photo-modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('photo-modal').style.display = 'none';
    }

    window.toggleDetails = function() {
        var details = document.getElementById("accountDetails");
        details.style.display = (details.style.display === "none" || details.style.display === "") ? "block" : "none";
    }

    let rsvpAnswer = null;
    const rsvpYesButton = document.getElementById("btnRsvpSi");
    const rsvpNoButton = document.getElementById("btnRsvpNo");
    const rsvpConfirmButton = document.getElementById("btnConfirmarRsvp");
    const guestCountWrapper = document.getElementById("guest-count-wrapper");
    const guestCount = document.getElementById("guest-count");
    const rsvpQuestion = document.getElementById("rsvp-question");
    const rsvpMessage = document.getElementById("rsvp-message");

    function selectRsvpAnswer(answer) {
        rsvpAnswer = answer;
        rsvpYesButton.classList.toggle("selected", answer === "si");
        rsvpNoButton.classList.toggle("selected", answer === "no");
        const passes = Math.max(1, Number(window.currentGuest?.passes) || 1);
        guestCount.innerHTML = Array.from({ length: passes }, (_, index) => `<option value="${index + 1}">${index + 1} ${index ? "pases" : "pase"}</option>`).join("");
        guestCountWrapper.hidden = answer !== "si";
        rsvpConfirmButton.hidden = false;
    }

    function showRsvpResult() {
        rsvpQuestion.hidden = true;
        document.querySelector(".rsvp-actions").hidden = true;
        guestCountWrapper.hidden = true;
        rsvpConfirmButton.hidden = true;
        rsvpMessage.textContent = rsvpAnswer === "si"
            ? "Gracias por confirmar tu asistencia, te vemos pronto."
            : "Lamentamos que no puedas acompañarnos, te extrañaremos.";
        rsvpMessage.hidden = false;
    }

    async function lockIfAlreadyConfirmed() {
        const guest = window.currentGuest;
        if (!guest || !window.RSVPDatabase?.getConfirmation) return;
        const confirmation = await window.RSVPDatabase.getConfirmation(guest.id);
        if (!confirmation) return;
        rsvpAnswer = confirmation.respuesta === "si" ? "si" : "no";
        showRsvpResult();
    }

    setTimeout(lockIfAlreadyConfirmed, 0);

    rsvpYesButton.addEventListener("click", () => selectRsvpAnswer("si"));
    rsvpNoButton.addEventListener("click", () => selectRsvpAnswer("no"));
    rsvpConfirmButton.addEventListener("click", async () => {
        const guest = window.currentGuest;
        if (!rsvpAnswer || !guest || !window.RSVPDatabase?.saveConfirmation) return;
        rsvpConfirmButton.disabled = true;
        try {
            await window.RSVPDatabase.saveConfirmation({
                id: guest.id,
                nombre: guest.name,
                pasesAsignados: guest.passes,
                respuesta: rsvpAnswer,
                cantidadConfirmada: rsvpAnswer === "si" ? guestCount.value : 0
            });
            showRsvpResult();
        } catch (error) {
            console.error(error);
            rsvpConfirmButton.disabled = false;
            alert("No se pudo guardar tu confirmación. Intenta nuevamente.");
        }
    });

    window.submitWish = submitWish;
    window.toggleWishForm = toggleWishForm;
    window.toggleWishes = toggleWishes;
});
window.toggleDetails = function() {
    var details = document.getElementById("accountDetails");
    details.style.display = (details.style.display === "none" || details.style.display === "") 
        ? "block" 
        : "none";
}

document.addEventListener('DOMContentLoaded', function() {
    // --- Existing background image slider ---
    const images = document.querySelectorAll('.background-image');
    let currentImageIndex = 0;

    if (images.length > 0) {
        images[0].classList.add('active');
    }

    function changeBackgroundImage() {
        if (images.length > 0) {
            images[currentImageIndex].classList.remove('active');
        }
        currentImageIndex = (currentImageIndex + 1) % images.length;
        if (images.length > 0) {
            images[currentImageIndex].classList.add('active');
        }
    }

    if (images.length > 1) {
        setInterval(changeBackgroundImage, 5000);
    }
    
    // --- FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');

            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.classList.remove('rotate-180');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.add('rotate-180');
            }
        });
    });

    // --- Query Modal Logic ---
    const openModalBtn = document.getElementById('open-query-modal');
    const closeModalBtn = document.getElementById('close-query-modal');
    const queryModal = document.getElementById('query-modal');
    const queryModalBox = document.getElementById('query-modal-box');
    const queryForm = document.getElementById('query-form');

    function openModal() {
        queryModal.classList.remove('hidden');
        setTimeout(() => {
            queryModal.classList.remove('opacity-0');
            queryModalBox.classList.remove('scale-95', 'opacity-0');
        }, 10);
    }

    function closeModal() {
        queryModal.classList.add('opacity-0');
        queryModalBox.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            queryModal.classList.add('hidden');
        }, 300);
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    queryModal.addEventListener('click', (event) => {
        if (event.target === queryModal) {
            closeModal();
        }
    });

    queryForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        alert('Thank you! Your query has been submitted successfully.');
        queryForm.reset();
        closeModal();
    });
});

// Sticky Navbar
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typewriter Effect
const textSpan = document.querySelector('.typing-text');
const words = ["a Data & AI Engineer", "a Vocalist"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        textSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

document.addEventListener('DOMContentLoaded', type);

// Smooth Scrolling for Anchors
// Smooth Scrolling for Anchors (excluding project buttons)
document.querySelectorAll('a[href^="#"]:not(.view-project-btn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .about-text, .stat-item, .timeline-item, .project-card, .cert-card, .contact-wrapper, .gallery-item').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Project Modal Logic
const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const projectBtns = document.querySelectorAll('.view-project-btn');

// Elements to update in modal
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');
const modalLiveBtn = document.getElementById('modalLiveBtn');
const modalGithubBtn = document.getElementById('modalGithubBtn');
const modalImg = document.getElementById('modalImg');

projectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Get data from attributes
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        const tech = btn.getAttribute('data-tech').split(',');
        const liveLink = btn.getAttribute('data-live');
        const githubLink = btn.getAttribute('data-github');

        // Populate Modal
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalImg.textContent = title; // Placeholder text for image

        // Clear and add tags
        modalTech.innerHTML = '';
        tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t.trim();
            modalTech.appendChild(span);
        });

        // Update links
        modalLiveBtn.href = liveLink;
        modalGithubBtn.href = githubLink;

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close on Overlay Click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close on Escape Key
// Close on Escape Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Image Lightbox Logic
const lightbox = document.getElementById('imageLightbox');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxImgPlaceholder = document.getElementById('lightboxImgPlaceholder');
const lightboxCaption = document.getElementById('lightboxCaption');

// Reusable Lightbox Logic
function attachLightboxEvents() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.lightbox-attached)');

    if (galleryItems) {
        galleryItems.forEach(item => {
            item.classList.add('lightbox-attached'); // Mark as attached
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const imgSrc = img ? img.src : '';
                const caption = item.getAttribute('data-caption');

                // Clear previous content
                lightboxImgPlaceholder.innerHTML = '';

                if (imgSrc) {
                    const newImg = document.createElement('img');
                    newImg.src = imgSrc;
                    newImg.classList.add('lightbox-img');
                    lightboxImgPlaceholder.appendChild(newImg);
                    // Remove padding/sizing for placeholder if image is present
                    lightboxImgPlaceholder.style.padding = '0';
                    lightboxImgPlaceholder.style.background = 'transparent';
                } else {
                    lightboxImgPlaceholder.textContent = "No Image Found";
                }

                lightboxCaption.textContent = caption;

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
}

// Initial attachment
attachLightboxEvents();


// Load More Button Logic
const loadMoreBtns = document.querySelectorAll('.load-more-btn');

if (loadMoreBtns) {
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            const hiddenItems = targetGrid.querySelectorAll('.gallery-item.hidden');

            // Show next 4 hidden items
            let count = 0;
            hiddenItems.forEach(item => {
                if (count < 4) { // Show 4 at a time
                    item.classList.remove('hidden');
                    // Small timeout to allow display:block to apply before opacity transition if needed, 
                    // but keyframes handle it well with 'visible' class
                    requestAnimationFrame(() => {
                        item.classList.add('visible');
                    });
                    count++;
                }
            });

            // Re-attach lightbox events for newly visible items
            attachLightboxEvents();

            // If no more hidden items, hide button
            if (targetGrid.querySelectorAll('.gallery-item.hidden').length === 0) {
                btn.style.display = 'none';
            }
        });
    });
}

if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Click outside the content
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out'
  });

  // Remove loader when page is loaded
  window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    setTimeout(function() {
      loader.classList.add('loader-hidden');
    }, 500);
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
      
      // Smooth scroll to target
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  // Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });
  
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Particle Animation with Error Handling
  function initParticles() {
    const canvas = document.querySelector('.particles-background');
    const fallbackNotice = document.getElementById('fallbackNotice');
    if (!canvas) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 500;
      
      const posArray = new Float32Array(particleCount * 3);
      for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      
      camera.position.z = 2;
      
      function animate() {
        requestAnimationFrame(animate);
        if (particlesMesh) {
          particlesMesh.rotation.x += 0.0005;
          particlesMesh.rotation.y += 0.0005;
        }
        renderer.render(scene, camera);
      }
      
      animate();
      
      window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (error) {
      console.error('Particle animation failed:', error);
      if (fallbackNotice) fallbackNotice.style.display = 'block';
      canvas.style.display = 'none';
    }
  }
  
  // Initialize particles if canvas exists
  if (document.querySelector('.particles-background')) {
    initParticles();
  }

  // Form submission with Formspree
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const submitText = submitBtn.querySelector('.submit-text');
      const sendingText = submitBtn.querySelector('.sending-text');
      
      submitText.classList.add('d-none');
      sendingText.classList.remove('d-none');
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactForm.reset();
          submitText.textContent = 'Message Sent!';
          submitText.classList.remove('d-none');
          sendingText.classList.add('d-none');
          
          setTimeout(function() {
            submitText.textContent = 'Send';
            submitBtn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        submitText.textContent = 'Error Sending';
        submitText.classList.remove('d-none');
        sendingText.classList.add('d-none');
        submitBtn.disabled = false;
      }
    });
  }

  // Update active nav link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
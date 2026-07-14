
    // Theme Toggler
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('doc-theme', target);
    }

    // Restore Theme preference
    const savedTheme = localStorage.getItem('doc-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Toggle Navigation Sidebar on mobile
    function toggleMenu() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
    }

    // Section Navigation is now handled natively via standard <a> links in separate HTML files.
    // Legacy navigate() and doc-last-section logic removed to fix visibility bugs.

    // Accordion Toggle
    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle('open');
    }

    // Copy Code Block Clipboard Helper
    function copyCode(btn) {
      const codeBlock = btn.parentElement.nextElementSibling.querySelector('code');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copiado!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        });
      }
    }

    // Load checklist checks from localStorage
    document.querySelectorAll('.checklist-checkbox').forEach(chk => {
      const checked = localStorage.getItem(chk.id) === 'true';
      chk.checked = checked;
    });

    // Save checklist checks state
    function saveCheck(chk) {
      localStorage.setItem(chk.id, chk.checked);
    }

    // Simple Client-side Search Filter Mock
    function handleSearch() {
      const filter = document.getElementById('searchBar').value.toLowerCase().trim();
      const navLinks = document.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const parentGroup = link.parentElement;
        if (text.includes(filter)) {
          link.style.display = 'flex';
        } else {
          link.style.display = 'none';
        }
      });
    }
  
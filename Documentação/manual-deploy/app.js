document.addEventListener('DOMContentLoaded', () => {
  // Configurações e Estado
  let currentChapterIndex = 0;
  const contentArea = document.getElementById('content-area');
  const sidebarNav = document.getElementById('sidebar-nav');
  const breadcrumb = document.getElementById('breadcrumb');
  const progressBar = document.getElementById('reading-progress');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const searchInput = document.getElementById('search-input');
  
  // Theme Management
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeLabel();
  };

  const toggleTheme = () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.replace('light-mode', 'dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      document.body.classList.replace('dark-mode', 'light-mode');
      localStorage.setItem('theme', 'light-mode');
    }
    updateThemeLabel();
  };

  const updateThemeLabel = () => {
    themeLabel.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  };

  themeToggle.addEventListener('click', toggleTheme);
  initTheme();

  // Mobile Menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Combine content from part1 and part2
  const chapters = [
    ...(typeof window.contentPart1 !== 'undefined' ? window.contentPart1 : []),
    ...(typeof window.contentPart2 !== 'undefined' ? window.contentPart2 : [])
  ];

  if (chapters.length === 0) {
    contentArea.innerHTML = '<h2>Erro: Conteúdo não encontrado.</h2>';
    return;
  }

  // Render Sidebar
  const renderSidebar = () => {
    sidebarNav.innerHTML = '';
    
    // Group by section (mocking sections based on indices for this example)
    const sections = [
      { title: 'Fundamentos', endIdx: 2 },
      { title: 'Backend & Sheets', endIdx: 6 },
      { title: 'Frontend & Integração', endIdx: 9 },
      { title: 'Operações & Segurança', endIdx: 13 },
      { title: 'Auditoria & Conclusão', endIdx: 19 }
    ];

    let currentSectionIdx = 0;
    
    chapters.forEach((chapter, index) => {
      // Add section title if it's the start of a new section
      if (index === 0 || (index > sections[currentSectionIdx - 1]?.endIdx && currentSectionIdx < sections.length)) {
        const title = document.createElement('div');
        title.className = 'nav-section-title';
        title.textContent = sections[currentSectionIdx]?.title || 'Mais';
        sidebarNav.appendChild(title);
        currentSectionIdx++;
      }

      const a = document.createElement('a');
      a.href = `#${chapter.slug}`;
      a.className = 'nav-item';
      a.textContent = `${index + 1}. ${chapter.title}`;
      a.dataset.index = index;
      sidebarNav.appendChild(a);
    });
  };

  // Render Chapter
  const renderChapter = (index) => {
    if (index < 0 || index >= chapters.length) index = 0;
    
    currentChapterIndex = index;
    const chapter = chapters[index];
    
    // Update Content
    contentArea.innerHTML = `
      <h1>${index + 1}. ${chapter.title}</h1>
      ${chapter.html}
    `;

    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-item[data-index="${index}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update Breadcrumb
    breadcrumb.textContent = `Manual de Implantação / ${chapter.title}`;

    // Update Progress
    const progress = ((index + 1) / chapters.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Update Nav Buttons
    if (index === 0) {
      btnPrev.classList.add('hidden');
    } else {
      btnPrev.classList.remove('hidden');
      document.getElementById('prev-title').textContent = chapters[index - 1].title;
    }

    if (index === chapters.length - 1) {
      btnNext.classList.add('hidden');
    } else {
      btnNext.classList.remove('hidden');
      document.getElementById('next-title').textContent = chapters[index + 1].title;
    }

    // Save state
    localStorage.setItem('lastChapter', chapter.slug);

    // Initialize Mermaid and Prism
    if (window.mermaid) {
      mermaid.initialize({ startOnLoad: false, theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default' });
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
    if (window.Prism) {
      Prism.highlightAllUnder(contentArea);
    }
    
    addCopyButtons();
    
    // Auto-scroll to top
    window.scrollTo(0,0);
    
    // Close sidebar on mobile after click
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  };

  // Routing based on hash
  const handleRouting = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      const last = localStorage.getItem('lastChapter');
      if (last) {
        window.location.hash = last;
        return;
      }
      renderChapter(0);
      return;
    }
    
    const idx = chapters.findIndex(c => c.slug === hash);
    if (idx !== -1) {
      renderChapter(idx);
    } else {
      renderChapter(0);
    }
  };

  // Nav Buttons Events
  btnPrev.addEventListener('click', () => {
    if (currentChapterIndex > 0) {
      window.location.hash = chapters[currentChapterIndex - 1].slug;
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentChapterIndex < chapters.length - 1) {
      window.location.hash = chapters[currentChapterIndex + 1].slug;
    }
  });

  // Window Hash Change
  window.addEventListener('hashchange', handleRouting);

  // Search
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? 'block' : 'none';
    });
  });

  // Copy buttons for code blocks
  const addCopyButtons = () => {
    document.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return; // already added
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copiar';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.innerText);
          btn.textContent = 'Copiado!';
          setTimeout(() => btn.textContent = 'Copiar', 2000);
        }
      });
      pre.appendChild(btn);
    });
  };

  // Init
  renderSidebar();
  handleRouting();
});

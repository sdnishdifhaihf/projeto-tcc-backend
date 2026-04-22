// menu.js

// ═══════════════════════════════════════════════════════════
//  NEUROPULSE - SISTEMA DE PLAYLISTS COM TRACKING ⚡🧠
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  
  // ═══════════════════════════════════════════════════════════
  //  🗄️ SISTEMA DE ARMAZENAMENTO PARA TRACKING
  // ═══════════════════════════════════════════════════════════
  
  const STORAGE_KEYS = {
    USER_PROFILE: 'neuropulse_user_profile',
    PLAYLIST_STATS: 'neuropulse_playlist_stats',
    SESSION_COUNT: 'neuropulse_session_count'
  };

  // Função para obter estatísticas das playlists
  const getPlaylistStats = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYLIST_STATS)) || {};
    } catch (error) {
      console.error('[NeuroPulse] Erro ao recuperar estatísticas:', error);
      return {};
    }
  };

  // Função para salvar estatísticas das playlists
  const savePlaylistStats = (stats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLIST_STATS, JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error('[NeuroPulse] Erro ao salvar estatísticas:', error);
      return false;
    }
  };

  // Função para atualizar o perfil do usuário com sessões
  const updateUserProfileWithSession = () => {
    try {
      const userProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
      if (userProfile) {
        // Incrementa contador de sessões
        userProfile.stats = userProfile.stats || {};
        userProfile.stats.sessions = (userProfile.stats.sessions || 0) + 1;
        userProfile.lastSession = new Date().toISOString();
        
        // Salva de volta
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
        console.log('✅ Sessão registrada no perfil:', userProfile.stats.sessions);
      }
    } catch (error) {
      console.error('[NeuroPulse] Erro ao atualizar perfil:', error);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  📊 SISTEMA DE TRACKING DE PLAYLISTS
  // ═══════════════════════════════════════════════════════════
  
  const trackPlaylistAccess = (playlistName, platform) => {
    const stats = getPlaylistStats();
    const today = new Date().toDateString();
    
    // Inicializa dados da playlist se não existir
    if (!stats[playlistName]) {
      stats[playlistName] = {
        totalAccess: 0,
        spotifyAccess: 0,
        youtubeAccess: 0,
        lastAccess: null,
        firstAccess: today
      };
    }
    
    // Atualiza estatísticas
    stats[playlistName].totalAccess++;
    stats[playlistName].lastAccess = today;
    
    if (platform === 'spotify') {
      stats[playlistName].spotifyAccess++;
    } else if (platform === 'youtube') {
      stats[playlistName].youtubeAccess++;
    }
    
    // Salva estatísticas atualizadas
    savePlaylistStats(stats);
    
    // Atualiza perfil do usuário
    updateUserProfileWithSession();
    
    console.log(`🎵 Playlist "${playlistName}" acessada via ${platform}`);
    console.log('📊 Estatísticas atualizadas:', stats[playlistName]);
    
    // Mostra feedback visual
    showAccessNotification(playlistName, platform);
  };

  // ═══════════════════════════════════════════════════════════
  //  🔔 NOTIFICAÇÃO DE ACESSO
  // ═══════════════════════════════════════════════════════════
  
  const showAccessNotification = (playlistName, platform) => {
    // Remove notificação existente
    const existingNotification = document.querySelector('.access-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `access-notification ${platform}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
      <i class="fab fa-${platform}" aria-hidden="true"></i>
      <span>Sessão registrada! Acessando <strong>${playlistName}</strong></span>
    `;

    // Estilos da notificação
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 10px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease-out;
      background: ${platform === 'spotify' ? '#1DB954' : '#FF0000'};
      border-left: 4px solid ${platform === 'spotify' ? '#1ed760' : '#ff3333'};
    `;

    document.body.appendChild(notification);

    // Remove automático após 3 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  };

  // ═══════════════════════════════════════════════════════════
  //  🎵 SISTEMA DE BOTÕES DE PLAYLIST COM TRACKING
  // ═══════════════════════════════════════════════════════════
  
  const initPlaylistTracking = () => {
    document.querySelectorAll('.platform-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Previne comportamento padrão temporariamente
        e.preventDefault();
        
        const platform = btn.classList.contains('spotify-btn') ? 'spotify' : 'youtube';
        const card = btn.closest('.card');
        const playlistName = card.querySelector('.card-title').textContent;
        const playlistUrl = btn.getAttribute('href');
        
        console.log(`🎵 Iniciando tracking para: ${playlistName} (${platform})`);
        
        // Registra o acesso
        trackPlaylistAccess(playlistName, platform);
        
        // Aguarda um pouco para mostrar a notificação antes de redirecionar
        setTimeout(() => {
          window.open(playlistUrl, '_blank');
        }, 500);
      });
    });
  };

  // ═══════════════════════════════════════════════════════════
  //  📊 EXIBIÇÃO DE ESTATÍSTICAS (OPCIONAL)
  // ═══════════════════════════════════════════════════════════
  
  const displayPlaylistStats = () => {
    const stats = getPlaylistStats();
    const totalSessions = Object.values(stats).reduce((total, playlist) => total + playlist.totalAccess, 0);
    
    console.log('📊 Estatísticas totais de playlists:');
    console.log(`🎵 Total de sessões: ${totalSessions}`);
    console.log('📈 Detalhes por playlist:', stats);
    
    // Você pode adicionar aqui a exibição visual das estatísticas
    // se quiser mostrar para o usuário
  };

  // ═══════════════════════════════════════════════════════════
  //  🏠 SISTEMA EXISTENTE (SEU CÓDIGO) - MELHORADO
  // ═══════════════════════════════════════════════════════════

  // Menu Hambúrguer
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = nav.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      
      // Atualiza acessibilidade
      menuToggle.setAttribute('aria-expanded', isExpanded);
      
      if (isExpanded) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = document.querySelectorAll('.card');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Header no Scroll - Otimizado
  const header = document.querySelector('header');
  
  if (header) {
    const originalPadding = getComputedStyle(header).padding;
    const originalBackground = getComputedStyle(header).background;
    const originalBoxShadow = getComputedStyle(header).boxShadow;

    // Debounce para melhor performance
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (window.innerWidth <= 768) {
          header.style.background = '';
          header.style.boxShadow = '';
          header.style.padding = '';
          header.classList.remove('header-scrolled');
          return;
        }

        if (window.scrollY > 50) {
          header.style.background = 'rgba(10, 8, 12, 0.98)';
          header.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.4)';
          header.style.padding = '12px 36px';
          header.classList.add('header-scrolled');
        } else {
          header.style.background = originalBackground;
          header.style.boxShadow = originalBoxShadow;
          header.style.padding = originalPadding;
          header.classList.remove('header-scrolled');
        }
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ═══════════════════════════════════════════════════════════
  //  🧠 SISTEMA DE ACORDEÃO
  // ═══════════════════════════════════════════════════════════
  
  const initAccordion = () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isExpanded = content.classList.contains('active');
        
        // Fecha todos os outros
        document.querySelectorAll('.accordion-content').forEach(item => {
          if (item !== content) {
            item.classList.remove('active');
            item.previousElementSibling.setAttribute('aria-expanded', 'false');
            item.previousElementSibling.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
          }
        });
        
        // Alterna o atual
        content.classList.toggle('active');
        const expanded = content.classList.contains('active');
        header.setAttribute('aria-expanded', expanded);
        
        // Animação do ícone
        const icon = header.querySelector('.fa-chevron-down');
        icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
        
        // Acessibilidade
        if (expanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
      
      // Suporte a teclado
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  };

  // ═══════════════════════════════════════════════════════════
  //  🔬 SISTEMA DO MODAL DE NEUROQUÍMICA
  // ═══════════════════════════════════════════════════════════
  
  const initNeurochemistryModal = () => {
    const modal = document.getElementById('neurochemistryModal');
    const openBtn = document.getElementById('exploreNeurochemistry');
    const closeBtn = document.getElementById('closeModal');
    
    if (!modal || !openBtn) return;
    
    // Abrir modal
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Previne scroll
      
      // Foco no botão de fechar para acessibilidade
      setTimeout(() => closeBtn.focus(), 100);
    });
    
    // Fechar modal
    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      openBtn.focus(); // Retorna foco para o botão que abriu
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  };

  // ═══════════════════════════════════════════════════════════
  //  🚀 OTIMIZAÇÕES DE PERFORMANCE
  // ═══════════════════════════════════════════════════════════
  
  // Lazy loading para imagens
  const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  🎉 INICIALIZAÇÃO DO SISTEMA
  // ═══════════════════════════════════════════════════════════
  
  // Inicializa todos os sistemas
  const initAll = () => {
    initPlaylistTracking();
    initAccordion();
    initNeurochemistryModal();
    initLazyLoading();
    
    // Exibe estatísticas no console (para debug)
    displayPlaylistStats();
    
    // Adiciona animação CSS para as notificações
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      /* Melhorias para acessibilidade do accordion */
      .accordion-header:focus {
        outline: 2px solid var(--accent1);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    console.log('%c🎵 NeuroPulse Music System Initialized', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%c📊 Sistema de tracking de playlists ativo', 'color: #10b981;');
    console.log('%c🚀 Pronto para registrar sessões!', 'color: #f59e0b; font-weight: bold;');
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
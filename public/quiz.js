// quiz.js

document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const questionContainer = document.getElementById('question-container');
  const resultContainer = document.getElementById('result-container');
  const questionText = document.getElementById('question-text');
  const questionNum = document.getElementById('question-num');
  const optionsContainer = document.getElementById('options-container');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const restartBtn = document.getElementById('restart-btn');
  const quizProgress = document.getElementById('quiz-progress');
  const currentQuestionSpan = document.getElementById('current-question');
  const totalQuestionsSpan = document.getElementById('total-questions');
  const resultTitle = document.getElementById('result-title');
  const resultDescription = document.getElementById('result-description');
  const playlistContainer = document.getElementById('playlist-recommendation-container');
  const matchPercentage = document.getElementById('match-percentage');
  const matchText = document.getElementById('match-text');
  const exploreMusicBtn = document.getElementById('explore-music-btn');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Configurações do quiz
  let currentQuestion = 0;
  let answers = [];
  let totalQuestions = 6;

  // Banco de dados de playlists
  const playlistsDatabase = {
    energia: {
      id: 'energia',
      title: 'Energia Explosiva',
      mood: 'Alta Energia',
      description: 'Playlist para aumentar a energia e motivação, perfeita para treinos e atividades físicas.',
      matchText: 'Você está cheio de energia! Esta playlist vai maximizar seu desempenho.',
      color: '#FF6B6B',
      songs: [
        { title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:05' },
        { title: 'Stronger', artist: 'Kanye West', duration: '5:12' },
        { title: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis', duration: '4:18' },
        { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:30' },
        { title: 'Power', artist: 'Kanye West', duration: '4:11' }
      ]
    },
    foco: {
      id: 'foco',
      title: 'Foco Máximo',
      mood: 'Concentração',
      description: 'Músicas instrumentais e ambientais para melhorar concentração e produtividade.',
      matchText: 'Você precisa de foco! Esta playlist vai ajudar na concentração.',
      color: '#4ECDC4',
      songs: [
        { title: 'Weightless', artist: 'Marconi Union', duration: '8:00' },
        { title: 'Clair de Lune', artist: 'Claude Debussy', duration: '5:04' },
        { title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', duration: '9:26' },
        { title: 'Deep Focus', artist: 'Brian Eno', duration: '6:12' },
        { title: 'Gymnopédie No.1', artist: 'Erik Satie', duration: '3:34' }
      ]
    },
    relaxamento: {
      id: 'relaxamento',
      title: 'Relaxamento Total',
      mood: 'Calma e Relaxamento',
      description: 'Sons suaves e melodias tranquilas para reduzir o estresse e ansiedade.',
      matchText: 'Você precisa relaxar! Esta playlist vai acalmar sua mente.',
      color: '#1DD1A1',
      songs: [
        { title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', duration: '5:16' },
        { title: 'River Flows in You', artist: 'Yiruma', duration: '3:42' },
        { title: 'Comptine d\'un autre été', artist: 'Yann Tiersen', duration: '2:22' },
        { title: 'Meditation', artist: 'Massane', duration: '4:24' },
        { title: 'Peaceful Piano', artist: 'Various Artists', duration: '3:55' }
      ]
    },
    tristeza: {
      id: 'tristeza',
      title: 'Conforto Emocional',
      mood: 'Reflexão e Conforto',
      description: 'Músicas que entendem a dor e oferecem conforto emocional.',
      matchText: 'Todos temos dias difíceis. Esta playlist vai confortar sua alma.',
      color: '#54A0FF',
      songs: [
        { title: 'Someone Like You', artist: 'Adele', duration: '4:45' },
        { title: 'Fix You', artist: 'Coldplay', duration: '4:55' },
        { title: 'The Scientist', artist: 'Coldplay', duration: '5:09' },
        { title: 'Skinny Love', artist: 'Bon Iver', duration: '3:58' },
        { title: 'Hallelujah', artist: 'Jeff Buckley', duration: '6:53' }
      ]
    },
    alegria: {
      id: 'alegria',
      title: 'Felicidade Contagiante',
      mood: 'Alegria e Euforia',
      description: 'Playlist cheia de músicas animadas para celebrar a vida.',
      matchText: 'Você está radiante! Esta playlist vai potencializar sua alegria.',
      color: '#FF9F43',
      songs: [
        { title: 'Happy', artist: 'Pharrell Williams', duration: '3:53' },
        { title: 'Don\'t Stop Me Now', artist: 'Queen', duration: '3:29' },
        { title: 'Good Vibrations', artist: 'The Beach Boys', duration: '3:37' },
        { title: 'Walking on Sunshine', artist: 'Katrina and The Waves', duration: '3:43' },
        { title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', duration: '4:51' }
      ]
    },
    nostalgia: {
      id: 'nostalgia',
      title: 'Viagem no Tempo',
      mood: 'Nostalgia e Saudade',
      description: 'Clássicos que vão te levar de volta às melhores lembranças.',
      matchText: 'Você está no modo nostalgia! Esta playlist vai reviver memórias.',
      color: '#A29BFE',
      songs: [
        { title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55' },
        { title: 'Hotel California', artist: 'Eagles', duration: '6:30' },
        { title: 'Imagine', artist: 'John Lennon', duration: '3:03' },
        { title: 'Like a Rolling Stone', artist: 'Bob Dylan', duration: '6:09' },
        { title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02' }
      ]
    }
  };

  // Perguntas do quiz
  const questions = [
    {
      question: "Como você está se sentindo agora?",
      options: [
        { text: "Cheio de energia e pronto para ação", value: "energia", playlist: "energia" },
        { text: "Precisando me concentrar em uma tarefa", value: "foco", playlist: "foco" },
        { text: "Estressado e precisando relaxar", value: "relaxamento", playlist: "relaxamento" },
        { text: "Um pouco triste ou reflexivo", value: "tristeza", playlist: "tristeza" },
        { text: "Feliz e animado", value: "alegria", playlist: "alegria" },
        { text: "Nostálgico, pensando no passado", value: "nostalgia", playlist: "nostalgia" }
      ]
    },
    {
      question: "Qual é o seu objetivo com a música agora?",
      options: [
        { text: "Aumentar minha energia e motivação", value: "energia", playlist: "energia" },
        { text: "Melhorar minha concentração", value: "foco", playlist: "foco" },
        { text: "Reduzir o estresse e relaxar", value: "relaxamento", playlist: "relaxamento" },
        { text: "Processar emoções difíceis", value: "tristeza", playlist: "tristeza" },
        { text: "Celebrar e me divertir", value: "alegria", playlist: "alegria" },
        { text: "Relembrar momentos especiais", value: "nostalgia", playlist: "nostalgia" }
      ]
    },
    {
      question: "Qual ambiente melhor descreve seu momento?",
      options: [
        { text: "Academia ou atividade física", value: "energia", playlist: "energia" },
        { text: "Escritório ou estudo", value: "foco", playlist: "foco" },
        { text: "Casa, descansando", value: "relaxamento", playlist: "relaxamento" },
        { text: "Refletindo sozinho", value: "tristeza", playlist: "tristeza" },
        { text: "Festa ou reunião com amigos", value: "alegria", playlist: "alegria" },
        { text: "Relembrando o passado", value: "nostalgia", playlist: "nostalgia" }
      ]
    },
    {
      question: "Que tipo de ritmo você prefere agora?",
      options: [
        { text: "Rápido e intenso", value: "energia", playlist: "energia" },
        { text: "Constante e moderado", value: "foco", playlist: "foco" },
        { text: "Lento e suave", value: "relaxamento", playlist: "relaxamento" },
        { text: "Emocional e profundo", value: "tristeza", playlist: "tristeza" },
        { text: "Animado e dançante", value: "alegria", playlist: "alegria" },
        { text: "Clássico e atemporal", value: "nostalgia", playlist: "nostalgia" }
      ]
    },
    {
      question: "Qual neurotransmissor você acha que precisa estimular?",
      options: [
        { text: "Dopamina (recompensa e motivação)", value: "energia", playlist: "energia" },
        { text: "Acetilcolina (aprendizado e memória)", value: "foco", playlist: "foco" },
        { text: "GABA (relaxamento e calma)", value: "relaxamento", playlist: "relaxamento" },
        { text: "Serotonina (humor e emoções)", value: "tristeza", playlist: "tristeza" },
        { text: "Endorfina (prazer e euforia)", value: "alegria", playlist: "alegria" },
        { text: "Oxitocina (conexão e afeto)", value: "nostalgia", playlist: "nostalgia" }
      ]
    },
    {
      question: "Quanto tempo você tem para ouvir música?",
      options: [
        { text: "Uma sessão curta e intensa", value: "energia", playlist: "energia" },
        { text: "Várias horas de trabalho/estudo", value: "foco", playlist: "foco" },
        { text: "Um momento prolongado de relaxamento", value: "relaxamento", playlist: "relaxamento" },
        { text: "Tempo para reflexão profunda", value: "tristeza", playlist: "tristeza" },
        { text: "O dia todo, quero festejar!", value: "alegria", playlist: "alegria" },
        { text: "Uma viagem sentimental no tempo", value: "nostalgia", playlist: "nostalgia" }
      ]
    }
  ];

  // Inicialização
  function initQuiz() {
    totalQuestions = questions.length;
    totalQuestionsSpan.textContent = totalQuestions;
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('neuropulse-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    loadQuestion();
    updateProgress();
    
    // Adicionar event listeners
    nextBtn.addEventListener('click', goToNextQuestion);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Carregar questão
  function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    questionNum.textContent = currentQuestion + 1;
    
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      if (answers[currentQuestion] === index) {
        optionElement.classList.add('selected');
      }
      
      optionElement.innerHTML = `
        <div class="option-icon">${String.fromCharCode(65 + index)}</div>
        <div class="option-text">${option.text}</div>
      `;
      
      optionElement.addEventListener('click', () => selectOption(index));
      optionsContainer.appendChild(optionElement);
    });
    
    updateNavigationButtons();
  }

  // Selecionar opção
  function selectOption(index) {
    // Remover seleção anterior
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Selecionar nova opção
    options[index].classList.add('selected');
    answers[currentQuestion] = index;
    
    // Habilitar próximo botão
    nextBtn.disabled = false;
  }

  // Navegação
  function goToNextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
      updateProgress();
    } else {
      showResults();
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
      updateProgress();
    }
  }

  function updateNavigationButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions.length - 1) {
      nextBtn.innerHTML = 'Ver Resultado <i class="fas fa-check"></i>';
    } else {
      nextBtn.innerHTML = 'Próxima <i class="fas fa-arrow-right"></i>';
    }
    
    nextBtn.disabled = answers[currentQuestion] === undefined;
  }

  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    quizProgress.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestion + 1;
  }

  // Mostrar resultados
  function showResults() {
    // Calcular playlist recomendada
    const playlistScores = {};
    
    questions.forEach((question, index) => {
      const answerIndex = answers[index];
      if (answerIndex !== undefined) {
        const playlistKey = question.options[answerIndex].playlist;
        playlistScores[playlistKey] = (playlistScores[playlistKey] || 0) + 1;
      }
    });
    
    // Encontrar playlist com maior pontuação
    let recommendedPlaylistKey = 'relaxamento'; // default
    let maxScore = 0;
    
    Object.keys(playlistScores).forEach(key => {
      if (playlistScores[key] > maxScore) {
        maxScore = playlistScores[key];
        recommendedPlaylistKey = key;
      }
    });
    
    const recommendedPlaylist = playlistsDatabase[recommendedPlaylistKey];
    
    // Calcular porcentagem de match
    const matchPercent = Math.round((maxScore / questions.length) * 100);
    
    // Mostrar resultado
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    resultTitle.textContent = recommendedPlaylist.title;
    matchPercentage.textContent = `${matchPercent}%`;
    matchText.textContent = recommendedPlaylist.matchText;
    
    // Atualizar botão para explorar músicas
    exploreMusicBtn.href = `Musicas.html?playlist=${recommendedPlaylistKey}`;
    
    // Salvar playlist no localStorage
    localStorage.setItem('current_playlist', JSON.stringify(recommendedPlaylist));
    localStorage.setItem('last_quiz_result', JSON.stringify({
      playlist: recommendedPlaylistKey,
      score: matchPercent,
      timestamp: new Date().toISOString()
    }));
    
    // Exibir playlist recomendada
    displayPlaylist(recommendedPlaylist);
  }

  // Exibir playlist
  function displayPlaylist(playlist) {
    playlistContainer.innerHTML = `
      <div class="playlist-card">
        <div class="playlist-header">
          <div>
            <h3 class="playlist-title">${playlist.title}</h3>
            <span class="playlist-mood" style="background: ${playlist.color}20; color: ${playlist.color}">
              ${playlist.mood}
            </span>
          </div>
          <i class="fas fa-headphones-alt" style="color: ${playlist.color}; font-size: 2rem;"></i>
        </div>
        
        <p class="playlist-description">${playlist.description}</p>
        
        <div class="songs-list">
          <h4 style="margin-bottom: 15px; color: var(--text-light);">Top 5 músicas:</h4>
          ${playlist.songs.map((song, index) => `
            <div class="song-item">
              <div class="song-number">${index + 1}</div>
              <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
              </div>
              <div class="song-duration">${song.duration}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="playlist-actions">
          <button class="btn play-all-btn" onclick="simulatePlay('${playlist.id}')">
            <i class="fas fa-play"></i> Ouvir Playlist
          </button>
          <button class="btn save-playlist-btn" onclick="savePlaylist('${playlist.id}')">
            <i class="fas fa-heart"></i> Salvar
          </button>
        </div>
      </div>
    `;
  }

  // Reiniciar quiz
  function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    resultContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    loadQuestion();
    updateProgress();
    updateNavigationButtons();
  }

  // Funções globais para os botões
  window.simulatePlay = function(playlistId) {
    alert(`🎵 Reproduzindo playlist: ${playlistsDatabase[playlistId].title}`);
    // Aqui você pode integrar com um player de música real
  };

  window.savePlaylist = function(playlistId) {
    const playlist = playlistsDatabase[playlistId];
    let savedPlaylists = JSON.parse(localStorage.getItem('saved_playlists') || '[]');
    
    if (!savedPlaylists.find(p => p.id === playlistId)) {
      savedPlaylists.push({
        id: playlistId,
        title: playlist.title,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('saved_playlists', JSON.stringify(savedPlaylists));
      alert(`✅ Playlist "${playlist.title}" salva com sucesso!`);
    } else {
      alert(`⚠️ Esta playlist já está salva.`);
    }
  };

  // Gerenciamento de tema
  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('neuropulse-theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-moon';
      themeIcon.title = 'Tema escuro';
    } else {
      themeIcon.className = 'fas fa-sun';
      themeIcon.title = 'Tema claro';
    }
  }

  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Inicializar quiz
  initQuiz();
});
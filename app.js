/**
 * RACQUET FINDER - MAIN APPLICATION
 * Advanced Tennis Equipment Recommendation System
 *
 * @author Rodrigo Leite
 * @version 2.1.0 (Refined)
 * @description Intelligent recommendation system for tennis racquets and strings using ES6 Modules.
 */

// Importa a classe do motor de recomendação
import RecommendationEngine from './recommendation-engine.js';

class RacquetFinder {
    constructor() {
        this.version = '2.1.0';
        this.initialized = false;

        // Data storage
        this.racquetQuestions = [];
        this.stringQuestions = [];
        this.rackets = [];
        this.strings = [];

        // Instância do motor de recomendação (será inicializada em loadData)
        this.recommendationEngine = null;

        // Application state
        this.currentMode = 'racquet'; // 'racquet' or 'string'
        this.currentQuestionIndex = 0;
        this.racquetAnswers = {}; // Armazena respostas por ID da pergunta
        this.stringAnswers = {};  // Armazena respostas por ID da pergunta
        this.isLoading = false;

        // UI elements cache
        this.elements = {};

        // Configuration
        this.config = {
            animationDuration: 300,
            loadingDelay: 1000, // Reduzido ligeiramente
            autoSave: true,
            debugMode: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') // Ativa debug em localhost
        };

        // Bind methods to ensure 'this' context is correct
        // (Alternativa: usar arrow functions para métodos de classe)
        this.init = this.init.bind(this);
        this.loadData = this.loadData.bind(this);
        this.cacheElements = this.cacheElements.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.handleError = this.handleError.bind(this);
        this.log = this.log.bind(this);
        // ... (bind outros métodos se não forem arrow functions)
    }

    /**
     * Initialize the application
     */
    async init() {
        this.log('🚀 Initializing Racquet Finder v' + this.version);
        try {
            this.showLoadingScreen();

            // Cache DOM elements primeiro
            this.cacheElements();

            // Carrega dados e configura o resto em paralelo
            await Promise.all([
                this.loadData(), // Agora instancia o recommendationEngine aqui dentro
                this.setupEventListeners(),
                this.setupTheme(),
                this.loadUserPreferences() // Carrega respostas salvas
            ]);

            this.setupInitialState(); // Mostra a tela inicial

            // Hide loading screen after a short delay
            setTimeout(() => {
                this.hideLoadingScreen();
                this.initialized = true;
                this.log('✅ Racquet Finder initialized successfully');
            }, this.config.loadingDelay);

        } catch (error) {
            this.handleError('Falha ao inicializar a aplicação', error);
            this.hideLoadingScreen(); // Esconde loading mesmo em caso de erro
        }
    }

    /**
     * Load all required data (JSON files) and instantiate the engine
     */
    async loadData() {
        this.log('⏳ Loading data...');
        try {
            const dataFiles = [
                './data/racquet-questions.json',
                './data/string-questions.json',
                './data/rackets.json',
                './data/strings.json'
            ];
            const responses = await Promise.all(dataFiles.map(url => fetch(url)));

            // Verifica se todas as respostas foram OK
            responses.forEach(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${res.url}: ${res.statusText}`);
            });

            // Parseia todos os JSONs
            const [racquetQuestionsData, stringQuestionsData, racketsData, stringsData] = await Promise.all(
                responses.map(res => res.json())
            );

            // Armazena os dados
            this.racquetQuestions = racquetQuestionsData?.questionnaireData || [];
            this.stringQuestions = stringQuestionsData?.questionnaireData || [];
            this.rackets = racketsData?.racketsData || [];
            this.strings = stringsData?.stringsData || [];

            this.log(`📊 Data loaded: ${this.racquetQuestions.length} R.Q, ${this.stringQuestions.length} S.Q, ${this.rackets.length} Rackets, ${this.strings.length} Strings`);

            // ---> **Instancia o RecommendationEngine AQUI** <---
            if (typeof RecommendationEngine !== 'undefined') {
                 this.recommendationEngine = new RecommendationEngine(this.rackets, this.strings);
                 this.log('⚙️ Recommendation engine instantiated.');
            } else {
                 throw new Error("RecommendationEngine class not found. Check import.");
            }


        } catch (error) {
            this.handleError('Falha ao carregar dados', error);
            this.loadFallbackData(); // Tenta carregar dados mínimos de fallback
             // Instancia o engine mesmo com fallback para evitar erros posteriores
             if (typeof RecommendationEngine !== 'undefined' && !this.recommendationEngine) {
                 this.recommendationEngine = new RecommendationEngine(this.rackets, this.strings);
                  this.log('⚙️ Recommendation engine instantiated with fallback data.');
             }
        }
    }

    /**
     * Load minimal fallback data if main data loading fails
     */
    loadFallbackData() {
        this.log('⚠️ Loading fallback data');
        this.racquetQuestions = [{ id: 'level', question: "Nível?", options: [{ text: "Iniciante", value: "Beginner" }] }];
        this.stringQuestions = [{ id: 1, question: "Nível?", options: [{ text: "Iniciante", value: "Beginner" }] }];
        this.rackets = [];
        this.strings = [];
    }

    /**
     * Cache frequently used DOM elements for performance
     */
    cacheElements() {
         const ids = [
            'loading-screen', 'theme-toggle', 'nav-mobile-toggle', 'racquet-tab',
            'string-tab', 'racquet-content', 'string-content', 'start-racquet-questionnaire',
            'start-string-questionnaire', 'racquet-questionnaire', 'racquet-question-container',
            'racquet-progress-fill', 'racquet-progress-text', 'racquet-prev-question',
            'racquet-next-question', 'racquet-submit-questionnaire', 'racquet-back-to-home',
            'string-questionnaire', 'string-question-container', 'string-progress-fill',
            'string-progress-text', 'string-prev-question', 'string-next-question',
            'string-submit-questionnaire', 'string-back-to-home', 'racquet-results',
            'racquet-results-content', 'racquet-results-back', 'restart-racquet-questionnaire',
            'try-string-finder', 'string-results', 'string-results-content',
            'string-results-back', 'restart-string-questionnaire', 'try-racquet-finder',
            'footer-racquet-link', 'footer-string-link'
         ];
         ids.forEach(id => {
             // Converte kebab-case para camelCase para nome da propriedade
             const camelCaseId = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
             this.elements[camelCaseId] = document.getElementById(id);
         });
         // Adiciona elementos que não são por ID
         this.elements.navLinks = document.querySelector('.nav-links');
         this.elements.heroSection = document.getElementById('home'); // ou a section hero principal
    }


    /**
     * Setup all event listeners for UI interactions
     */
    setupEventListeners() {
        this.log('🎧 Setting up event listeners...');

        // Theme toggle
        this.elements.themeToggle?.addEventListener('click', this.toggleTheme.bind(this));

        // Mobile navigation
        this.elements.navMobileToggle?.addEventListener('click', this.toggleMobileNav.bind(this));
        // Fecha menu ao clicar no link (delegação de evento)
        this.elements.navLinks?.addEventListener('click', (e) => {
             if (e.target.classList.contains('nav-link')) {
                 this.closeMobileNav();
             }
        });
         // Fecha menu ao redimensionar para desktop
        window.addEventListener('resize', this.handleResize.bind(this)); // handleResize cuidará disso

        // Tab switching
        this.elements.racquetTab?.addEventListener('click', () => this.switchTab('racquet'));
        this.elements.stringTab?.addEventListener('click', () => this.switchTab('string'));

        // Start questionnaires
        this.elements.startRacquetBtn?.addEventListener('click', () => this.startQuestionnaire('racquet'));
        this.elements.startStringBtn?.addEventListener('click', () => this.startQuestionnaire('string'));

        // Questionnaire navigation (Racquet)
        this.elements.racquetPrevBtn?.addEventListener('click', () => this.prevQuestion('racquet'));
        this.elements.racquetNextBtn?.addEventListener('click', () => this.nextQuestion('racquet'));
        this.elements.racquetSubmitBtn?.addEventListener('click', () => this.submitQuestionnaire('racquet'));
        this.elements.racquetBackBtn?.addEventListener('click', () => this.goHome());

        // Questionnaire navigation (String)
        this.elements.stringPrevBtn?.addEventListener('click', () => this.prevQuestion('string'));
        this.elements.stringNextBtn?.addEventListener('click', () => this.nextQuestion('string'));
        this.elements.stringSubmitBtn?.addEventListener('click', () => this.submitQuestionnaire('string'));
        this.elements.stringBackBtn?.addEventListener('click', () => this.goHome());

        // Results navigation
        this.elements.racquetResultsBack?.addEventListener('click', () => this.goHome());
        this.elements.stringResultsBack?.addEventListener('click', () => this.goHome());
        this.elements.restartRacquetBtn?.addEventListener('click', () => this.restartQuestionnaire('racquet'));
        this.elements.restartStringBtn?.addEventListener('click', () => this.restartQuestionnaire('string'));
        this.elements.tryStringBtn?.addEventListener('click', () => this.switchToStringFinder());
        this.elements.tryRacquetBtn?.addEventListener('click', () => this.switchToRacquetFinder());

        // Footer links (start questionnaire)
        this.elements.footerRacquetLink?.addEventListener('click', (e) => { e.preventDefault(); this.switchToRacquetFinder(); });
        this.elements.footerStringLink?.addEventListener('click', (e) => { e.preventDefault(); this.switchToStringFinder(); });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

        // Save preferences before unload
        window.addEventListener('beforeunload', this.saveUserPreferences.bind(this));

        // Scroll animations (já configurado no init)
        this.setupScrollAnimations();
    }

    // --- Métodos de UI e Estado ---

    setupTheme() {
        const savedTheme = localStorage.getItem('racquet-finder-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
        // Listener para mudança de preferência do OS
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
             if (!localStorage.getItem('racquet-finder-theme')) { // Só muda se não houver preferência salva
                 this.setTheme(e.matches ? 'dark' : 'light');
             }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = this.elements.themeToggle?.querySelector('.theme-icon');
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙'; // Invertido: mostra o ícone para o qual MUDAR
        localStorage.setItem('racquet-finder-theme', theme);
        this.log(`🎨 Theme set to ${theme}`);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    toggleMobileNav() {
        this.elements.navLinks?.classList.toggle('active');
        this.elements.navMobileToggle?.classList.toggle('active');
        document.body.style.overflow = this.elements.navLinks?.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileNav() {
         this.elements.navLinks?.classList.remove('active');
         this.elements.navMobileToggle?.classList.remove('active');
         document.body.style.overflow = '';
    }

    setupInitialState() {
        this.showSection('home'); // Garante que só a home está visível
        this.switchTab(this.currentMode || 'racquet'); // Usa o modo salvo ou default
        this.resetQuestionnaires();
    }

    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem('racquet-finder-preferences');
            if (preferences) {
                const data = JSON.parse(preferences);
                this.racquetAnswers = data.racquetAnswers || {};
                this.stringAnswers = data.stringAnswers || {};
                this.currentMode = data.currentMode || 'racquet';
                this.log('💾 User preferences loaded');
            }
        } catch (error) {
            this.log('⚠️ Failed to load user preferences:', error);
            localStorage.removeItem('racquet-finder-preferences'); // Limpa dados corruptos
        }
    }

    saveUserPreferences() {
        if (!this.config.autoSave) return;
        try {
            const preferences = {
                racquetAnswers: this.racquetAnswers,
                stringAnswers: this.stringAnswers,
                currentMode: this.currentMode,
                timestamp: Date.now()
            };
            localStorage.setItem('racquet-finder-preferences', JSON.stringify(preferences));
            // this.log('💾 User preferences saved'); // Log opcional, pode poluir
        } catch (error) {
            this.log('⚠️ Failed to save user preferences:', error);
        }
    }

    showLoadingScreen() { this.elements.loadingScreen?.classList.remove('hidden'); }
    hideLoadingScreen() { this.elements.loadingScreen?.classList.add('hidden'); }

    switchTab(mode) {
        this.currentMode = mode;
        const isRacquet = mode === 'racquet';

        this.elements.racquetTab?.classList.toggle('active', isRacquet);
        this.elements.stringTab?.classList.toggle('active', !isRacquet);
        this.elements.racquetContent?.classList.toggle('active', isRacquet);
        this.elements.stringContent?.classList.toggle('active', !isRacquet);

        // Se uma seção de questionário/resultado estiver ativa, volta pra home
        if (!this.elements.heroSection?.classList.contains('hidden')) {
             this.goHome(); // Garante que ao trocar de aba na home, nada mais aconteça
        } else {
             // Não força goHome se já estiver em um questionário/resultado, apenas salva o modo
             this.saveUserPreferences();
        }
    }

    switchToRacquetFinder() {
        this.switchTab('racquet');
        // Apenas inicia se não estiver já no questionário ou resultados
        if (this.elements.heroSection && !this.elements.heroSection.classList.contains('hidden')) {
            this.startQuestionnaire('racquet');
        } else {
            this.goHome(); // Se estava em outra página, volta pra home e mostra a tab certa
            this.startQuestionnaire('racquet'); // Inicia o questionário
        }
    }

    switchToStringFinder() {
        this.switchTab('string');
         if (this.elements.heroSection && !this.elements.heroSection.classList.contains('hidden')) {
            this.startQuestionnaire('string');
        } else {
            this.goHome();
            this.startQuestionnaire('string');
        }
    }

    showSection(sectionIdToShow) {
        this.log(`🔄 Showing section: ${sectionIdToShow}`);
        const allSectionIds = ['home', 'racquet-questionnaire', 'string-questionnaire', 'racquet-results', 'string-results'];
        allSectionIds.forEach(id => {
            const element = this.elements[id.replace(/-([a-z])/g, g => g[1].toUpperCase())]; // Converte para camelCase
            element?.classList.toggle('hidden', id !== sectionIdToShow);
        });

         // Garante que a seção hero só aparece na 'home'
         this.elements.heroSection?.classList.toggle('hidden', sectionIdToShow !== 'home');

         // Scroll to top when showing a new section (important for mobile)
        window.scrollTo(0, 0);
    }

    goHome() {
        this.showSection('home');
        // Não reseta questionários aqui, pode ser confuso se o usuário só quis voltar
        // this.resetQuestionnaires();
    }

     resetQuestionnaires() {
        this.currentQuestionIndex = 0;
        ['racquet', 'string'].forEach(mode => {
            // Limpa containers
             this.elements[`${mode}QuestionContainer`]?.innerHTML = '';
             this.elements[`${mode}ResultsContent`]?.innerHTML = '';
             // Reseta botões
             this.elements[`${mode}NextBtn`]?.classList.remove('hidden');
             this.elements[`${mode}NextBtn`]?.disabled = true;
             this.elements[`${mode}SubmitBtn`]?.classList.add('hidden');
             this.elements[`${mode}SubmitBtn`]?.disabled = true;
             this.elements[`${mode}PrevBtn`]?.disabled = true;
             // Reseta progresso
             this.updateProgress(mode); // Chama com índice 0
        });
    }

    restartQuestionnaire(mode) {
        this.log(`🔄 Restarting ${mode} questionnaire`);
        if (mode === 'racquet') this.racquetAnswers = {};
        else this.stringAnswers = {};
        this.saveUserPreferences();
        this.startQuestionnaire(mode); // Reinicia do zero
    }


    // --- Métodos do Questionário ---

    startQuestionnaire(mode) {
        if ((mode === 'racquet' && !this.racquetQuestions.length) || (mode === 'string' && !this.stringQuestions.length)) {
             this.handleError("Dados do questionário não carregados.", new Error("Question data is empty."));
             return;
        }
        this.currentMode = mode;
        this.currentQuestionIndex = 0;
        this.log(`▶️ Starting ${mode} questionnaire`);
        this.showSection(`${mode}-questionnaire`);
        this.displayQuestion(mode);
        // Não salva respostas aqui, começa limpo
    }

    displayQuestion(mode) {
        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        // Verifica se o índice é válido
        if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= questions.length) {
            this.handleError(`Índice de pergunta inválido: ${this.currentQuestionIndex}`, new Error("Invalid question index"));
            this.goHome(); // Volta para a home em caso de erro grave
            return;
        }
        const question = questions[this.currentQuestionIndex];
        const container = this.elements[`${mode}QuestionContainer`];
        if (!container || !question) return; // Sai se o container ou a pergunta não existirem

        this.log(`❓ Displaying ${mode} question ${this.currentQuestionIndex + 1}/${questions.length}: ${question.id || question.question}`);

        // --- Criação do HTML da Pergunta ---
        let optionsHtml = '';
        if (question.type === 'sliderGroup') { // Lógica para grupo de sliders
             optionsHtml = question.attributes.map(attr => `
                <div class="slider-group-item">
                     <label for="slider-${mode}-${question.id}-${attr.key}" class="slider-label">${attr.label} (${attr.min}-${attr.max})</label>
                     <input
                         type="range"
                         id="slider-${mode}-${question.id}-${attr.key}"
                         name="question-${mode}-${question.id}-${attr.key}"
                         min="${attr.min}"
                         max="${attr.max}"
                         value="${this.racquetAnswers[question.id]?.attributes?.find(a => a.key === attr.key)?.default || attr.default}"
                         data-key="${attr.key}"
                         oninput="this.nextElementSibling.textContent = this.value"
                         onchange="window.racquetFinder.handleSliderChange('${mode}', '${question.id}')"
                     >
                     <span class="slider-value">${this.racquetAnswers[question.id]?.attributes?.find(a => a.key === attr.key)?.default || attr.default}</span>
                </div>
             `).join('');

        } else { // Lógica para Radio buttons (padrão)
             optionsHtml = question.options.map((option, index) => `
                <label class="option-label" data-option-value="${option.value}">
                    <input type="radio"
                           id="option-${mode}-${question.id}-${index}"
                           name="question-${mode}-${question.id}"
                           value="${option.value}"
                           data-text="${option.text}"
                           onchange="window.racquetFinder.handleOptionChange('${mode}')">
                    <span class="option-text">${option.text}</span>
                    <span class="option-checkmark"></span>
                </label>
             `).join('');
        }

        container.innerHTML = `
            <div class="question animate-on-scroll">
                <h3 class.question-title>${question.question}</h3>
                ${question.tooltip ? `<p class="question-tooltip">${question.tooltip}</p>` : ''}
                <div class="question-options ${question.type === 'sliderGroup' ? 'slider-group' : ''}">
                    ${optionsHtml}
                </div>
            </div>
        `;

        // Restaura seleção anterior (se houver) para radios
        if (question.type !== 'sliderGroup') {
             this.restorePreviousAnswer(mode, question.id);
        } else {
             // Para sliders, o valor já foi definido no atributo 'value' do input range
             // Mas precisamos garantir que handleSliderChange seja chamado para salvar o estado inicial
             this.handleSliderChange(mode, question.id);
        }


        this.updateProgress(mode);
        this.updateNavigationButtons(mode);
        this.triggerScrollAnimation(container.firstElementChild); // Anima o card da pergunta
    }


     // Modificado para lidar com radios
     restorePreviousAnswer(mode, questionId) {
        const answers = mode === 'racquet' ? this.racquetAnswers : this.stringAnswers;
        const previousAnswer = answers[questionId]; // Ex: { value: 'Intermediate', text: 'Intermediário' }

        if (previousAnswer && typeof previousAnswer.value === 'string') {
            const radio = document.querySelector(`input[name="question-${mode}-${questionId}"][value="${previousAnswer.value}"]`);
            if (radio) {
                radio.checked = true;
                const label = radio.closest('.option-label');
                if (label) this.animateOptionSelection(label); // Aplica estilo visual
            }
        }
    }

    // Chamado quando um radio button muda
    handleOptionChange(mode) {
        this.updateNavigationButtons(mode); // Habilita/desabilita next/submit
        // O evento 'change' no input já cuida de salvar a resposta e animar
        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        const question = questions[this.currentQuestionIndex];
        const selectedRadio = document.querySelector(`input[name="question-${mode}-${question.id}"]:checked`);
        if (selectedRadio) {
             this.saveAnswer(mode, question.id, selectedRadio); // Salva imediatamente
             this.animateOptionSelection(selectedRadio.closest('.option-label'));
        }

    }

     // Chamado quando um slider muda (ou no carregamento inicial da pergunta tipo slider)
     handleSliderChange(mode, questionId) {
         if (mode !== 'racquet') return; // Só temos slider no questionário de raquete por enquanto

         const sliderContainer = this.elements.racquetQuestionContainer?.querySelector('.slider-group');
         if (!sliderContainer) return;

         const sliders = sliderContainer.querySelectorAll('input[type="range"]');
         const attributesData = [];
         sliders.forEach(slider => {
             attributesData.push({
                 key: slider.dataset.key,
                 label: slider.previousElementSibling.textContent.split('(')[0].trim(), // Pega o label antes do (min-max)
                 min: parseInt(slider.min, 10),
                 max: parseInt(slider.max, 10),
                 default: parseInt(slider.value, 10) // Salva o valor atual como 'default' para o engine
             });
         });

         // Salva a estrutura completa no answers
         this.racquetAnswers[questionId] = {
             type: 'sliderGroup',
             attributes: attributesData
         };

         this.saveUserPreferences(); // Salva no localStorage
         this.updateNavigationButtons(mode); // Habilita/desabilita botões
     }

    // Unificado para salvar tanto radio quanto slider
    saveAnswer(mode, questionId, selectedElement) {
        const answers = mode === 'racquet' ? this.racquetAnswers : this.stringAnswers;

        if (selectedElement.type === 'radio') {
             answers[questionId] = {
                 value: selectedElement.value,
                 text: selectedElement.dataset.text || selectedElement.value // Usa data-text se disponível
             };
        }
        // Sliders são salvos diretamente em handleSliderChange

        // Atualiza o objeto principal de respostas
        if (mode === 'racquet') this.racquetAnswers = answers;
        else this.stringAnswers = answers;

        this.saveUserPreferences(); // Salva no localStorage
        this.log(`💾 Answer saved for ${mode} Q${questionId}:`, answers[questionId]);
    }


    animateOptionSelection(optionElement) {
        optionElement?.parentNode?.querySelectorAll('.option-label.selected').forEach(el => el.classList.remove('selected'));
        optionElement?.classList.add('selected');
    }

    updateProgress(mode) {
        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        const progressFill = this.elements[`${mode}ProgressFill`];
        const progressText = this.elements[`${mode}ProgressText`];
        const count = questions.length;

        if (progressFill && progressText && count > 0) {
             // Garante que o índice não saia do limite
            const currentIdx = Math.min(this.currentQuestionIndex, count - 1);
            const progress = ((currentIdx + 1) / count) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Pergunta ${currentIdx + 1} de ${count}`;
        } else if (progressText) {
             progressText.textContent = ''; // Limpa se não houver perguntas
        }
    }

    updateNavigationButtons(mode) {
        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        const count = questions.length;
        if (count === 0) return; // Não faz nada se não houver perguntas

        const currentQuestion = questions[this.currentQuestionIndex];
        let isAnswered = false;

        if (currentQuestion.type === 'sliderGroup') {
             // Considera respondido se o objeto de resposta para sliders existir
             isAnswered = !!(mode === 'racquet' ? this.racquetAnswers[currentQuestion.id] : this.stringAnswers[currentQuestion.id]);
        } else {
             // Verifica se algum radio está selecionado
            const selectedRadio = document.querySelector(`input[name="question-${mode}-${currentQuestion.id}"]:checked`);
            isAnswered = !!selectedRadio;
        }


        const prevBtn = this.elements[`${mode}PrevBtn`];
        const nextBtn = this.elements[`${mode}NextBtn`];
        const submitBtn = this.elements[`${mode}SubmitBtn`];

        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;

        const isLastQuestion = this.currentQuestionIndex >= count - 1;

        if (nextBtn) {
            nextBtn.classList.toggle('hidden', isLastQuestion);
            nextBtn.disabled = !isAnswered;
        }
        if (submitBtn) {
            submitBtn.classList.toggle('hidden', !isLastQuestion);
            submitBtn.disabled = !isAnswered;
        }
    }

    nextQuestion(mode) {
        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        // Salva a resposta atual (se for radio, já foi salvo no change, mas sliders precisam salvar aqui)
        const currentQuestion = questions[this.currentQuestionIndex];
         if (currentQuestion.type === 'sliderGroup') {
             this.handleSliderChange(mode, currentQuestion.id); // Garante que o valor final do slider seja salvo
         } else {
            const selectedRadio = document.querySelector(`input[name="question-${mode}-${currentQuestion.id}"]:checked`);
            if (selectedRadio) {
                this.saveAnswer(mode, currentQuestion.id, selectedRadio);
            } else {
                 this.log("⚠️ Tentou avançar sem responder.");
                 return; // Não avança se não respondeu
            }
         }


        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion(mode);
        } else {
             this.log("🏁 Já está na última pergunta.");
             this.updateNavigationButtons(mode); // Apenas atualiza estado dos botões
        }
    }

    prevQuestion(mode) {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion(mode);
        }
    }

    submitQuestionnaire(mode) {
        if (!this.recommendationEngine) {
             this.handleError("Motor de recomendação não inicializado.", new Error("Engine not ready"));
             return;
        }

        const questions = mode === 'racquet' ? this.racquetQuestions : this.stringQuestions;
        const currentQuestion = questions[this.currentQuestionIndex];

        // Garante que a última resposta foi salva
        if (currentQuestion.type === 'sliderGroup') {
             this.handleSliderChange(mode, currentQuestion.id);
        } else {
            const selectedRadio = document.querySelector(`input[name="question-${mode}-${currentQuestion.id}"]:checked`);
            if (selectedRadio) {
                this.saveAnswer(mode, currentQuestion.id, selectedRadio);
            } else {
                 this.log("⚠️ Tentou submeter sem responder a última pergunta.");
                 // Idealmente, o botão submit estaria desabilitado, mas adiciona segurança
                 alert("Por favor, responda a pergunta atual antes de ver os resultados.");
                 return;
            }
        }


        this.log(`✅ Submitting ${mode} questionnaire with answers:`, mode === 'racquet' ? this.racquetAnswers : this.stringAnswers);
        this.showSection(`${mode}-results`);
        this.showResultsLoading(mode);

        // Usa setTimeout para simular processamento e permitir que o loading apareça
        setTimeout(() => {
            try {
                let recommendations;
                if (mode === 'racquet') {
                    recommendations = this.recommendationEngine.generateRacquetRecommendations(this.racquetAnswers);
                    this.displayRacquetRecommendations(recommendations);
                } else {
                    recommendations = this.recommendationEngine.generateStringRecommendations(this.stringAnswers);
                    this.displayStringRecommendations(recommendations);
                }
                 this.log(`🏆 Recommendations generated for ${mode}:`, recommendations);
            } catch (error) {
                this.handleError(`Falha ao gerar recomendações para ${mode}`, error);
            }
        }, 500); // Reduzido o delay artificial
    }


    // --- Métodos de Exibição de Resultados ---

    showResultsLoading(mode) {
        const resultsContent = this.elements[`${mode}ResultsContent`];
        if (!resultsContent) return;
        resultsContent.innerHTML = `
            <div class="results-loading">
                <div class="loading-spinner"></div>
                <h3>Analisando seu perfil...</h3>
                <p>Encontrando as melhores opções para você.</p>
            </div>
        `;
    }

    // A lógica de displayRacquetRecommendations e displayStringRecommendations
    // permanece a mesma de antes, apenas garantindo que usem
    // this.elements[`${mode}ResultsContent`] corretamente.
    // **Importante:** Essas funções *não* devem conter a lógica de cálculo,
    // apenas a lógica de renderização do HTML.

     /**
     * Display racquet recommendations in the UI
     * @param {Array<Object>} recommendations Array of recommended racket objects
     */
     displayRacquetRecommendations(recommendations) {
        const resultsContent = this.elements.racquetResultsContent;
        if (!resultsContent) return;

        if (!recommendations || recommendations.length === 0) {
             this.showNoResultsMessage('racquet');
             return;
        }

        const recommendationsHtml = recommendations.map((racket, index) => {
            // Verifica se 'reasons' existe e é um array antes de usar map
            const reasonsHtml = Array.isArray(racket.reasons) ? racket.reasons.map(reason => `<li>${reason}</li>`).join('') : '';

            return `
            <div class="racket-card animate-on-scroll" data-racket-id="${racket.id}" style="animation-delay: ${index * 0.1}s">
                <div class="racket-card-content">
                    <div class="racket-rank">${index + 1}</div>
                    <div class="racket-brand-logo racket-brand-${racket.brand?.toLowerCase() || 'default'}">
                        ${racket.brand?.charAt(0) || '?'}
                    </div>
                    <div class="racket-main-info">
                        <div class="racket-header">
                            <h3 class="racket-name">${racket.name || 'Nome Indisponível'}</h3>
                            <p class="racket-brand">${racket.brand || 'Marca Desconhecida'}</p>
                        </div>
                        <div class="racket-score">
                            <span class="score-label">Compatibilidade:</span>
                            <span class="score-value">${racket.score ?? 'N/A'}%</span>
                        </div>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${racket.score ?? 0}%"></div>
                        </div>
                        <p class="racket-description">${racket.description || 'Sem descrição disponível.'}</p>
                        <div class="racket-specs">
                            <div class="spec-item">
                                <div class="spec-label">Peso</div>
                                <div class="spec-value">${racket.weight ? racket.weight + 'g' : 'N/A'}</div>
                            </div>
                            <div class="spec-item">
                                <div class="spec-label">Cabeça</div>
                                <div class="spec-value">${racket.headSize ? racket.headSize + 'in²' : 'N/A'}</div>
                            </div>
                            <div class="spec-item">
                                <div class="spec-label">Padrão</div>
                                <div class="spec-value">${racket.stringPattern || 'N/A'}</div>
                            </div>
                             <div class="spec-item">
                                <div class="spec-label">Rigidez</div>
                                <div class="spec-value">${racket.stiffness ? racket.stiffness + 'RA' : 'N/A'}</div>
                            </div>
                        </div>
                        ${reasonsHtml ? `
                            <div class="racket-reasons">
                                <h4>Por que recomendamos:</h4>
                                <ul>${reasonsHtml}</ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="racket-actions">
                        <button class="action-btn btn-primary-action" onclick="window.racquetFinder.viewRacketDetails('${racket.id}')">
                            Ver Detalhes
                        </button>
                        <button class="action-btn btn-secondary-action" onclick="window.racquetFinder.compareRacket('${racket.id}')">
                            Comparar
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');

        resultsContent.innerHTML = `<div class="results-grid">${recommendationsHtml}</div>`;
        this.triggerScrollAnimations(); // Ativa animações para os novos cards
    }

    /**
     * Display string recommendations in the UI
     * @param {Array<Object>} recommendations Array of recommended string objects
     */
    displayStringRecommendations(recommendations) {
        const resultsContent = this.elements.stringResultsContent;
        if (!resultsContent) return;

         if (!recommendations || recommendations.length === 0) {
             this.showNoResultsMessage('string');
             return;
        }

        const recommendationsHtml = recommendations.map((string, index) => {
            const reasonsHtml = Array.isArray(string.reasons) ? string.reasons.map(reason => `<li>${reason}</li>`).join('') : '';
            const prosHtml = Array.isArray(string.pros) ? string.pros.map(pro => `<li>${pro}</li>`).join('') : '';
            const consHtml = Array.isArray(string.cons) ? string.cons.map(con => `<li>${con}</li>`).join('') : '';

            // Helper para criar barra de característica
            const createCharacteristicBar = (label, valueKey) => {
                 const value = typeof string[valueKey] === 'number' ? string[valueKey] : 0.5; // Default 0.5
                 const percentage = Math.round(value * 100);
                 return `
                    <div class="characteristic-item">
                        <div class="characteristic-label">${label}</div>
                        <div class="characteristic-bar">
                            <div class="characteristic-fill ${valueKey}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="characteristic-value">${percentage}%</div>
                    </div>`;
            };

            return `
            <div class="racket-card string-card animate-on-scroll" data-string-id="${string.id}" style="animation-delay: ${index * 0.1}s">
                <div class="racket-card-content"> {/* Mantém a classe para estrutura similar */}
                    <div class="racket-rank">${index + 1}</div>
                    <div class="string-brand-logo string-brand-${string.brand?.toLowerCase() || 'default'}">
                         ${string.brand?.charAt(0) || '?'}
                         ${string.type ? `<div class="string-type-indicator">${string.type}</div>` : ''}
                    </div>
                    <div class="racket-main-info"> {/* Mantém a classe */}
                        <div class="racket-header">
                            <h3 class="racket-name">${string.name || 'Nome Indisponível'}</h3>
                            <p class="racket-brand">${string.brand || 'Marca'} - ${string.type || 'Tipo'}</p>
                        </div>
                        <div class="racket-score">
                            <span class="score-label">Compatibilidade:</span>
                            <span class="score-value">${string.score ?? 'N/A'}%</span>
                        </div>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${string.score ?? 0}%"></div>
                        </div>
                        <p class="racket-description">${string.description || 'Sem descrição.'}</p>

                        <div class="string-characteristics">
                            ${createCharacteristicBar('Potência', 'power')}
                            ${createCharacteristicBar('Controle', 'control')}
                            ${createCharacteristicBar('Spin', 'spin')}
                            ${createCharacteristicBar('Conforto', 'comfort')}
                            ${createCharacteristicBar('Durabilidade', 'durability')}
                        </div>

                         ${typeof string.arm_friendly === 'boolean' ? `
                             <div class="arm-friendly-indicator ${string.arm_friendly ? 'friendly' : 'not-friendly'}">
                                 ${string.arm_friendly ? '✓ Amigável ao braço' : '⚠️ Requer cuidado'}
                             </div>
                         ` : ''}

                        ${string.recommended_tension ? `
                        <div class="tension-recommendation">
                            <div class="tension-label">Tensão Recomendada</div>
                            <div class="tension-value">${string.recommended_tension}</div>
                        </div>
                        `: ''}

                        ${reasonsHtml ? `
                            <div class="racket-reasons">
                                <h4>Por que recomendamos:</h4>
                                <ul>${reasonsHtml}</ul>
                            </div>
                        ` : ''}

                        ${prosHtml || consHtml ? `
                            <div class="string-pros-cons">
                                ${prosHtml ? `
                                <div class="pros-section">
                                    <h5>✓ Prós</h5>
                                    <ul class="pros-list">${prosHtml}</ul>
                                </div>` : '<div class="pros-section"></div>' /* Placeholder for grid */}
                                ${consHtml ? `
                                <div class="cons-section">
                                    <h5>✗ Contras</h5>
                                    <ul class="cons-list">${consHtml}</ul>
                                </div>` : '<div class="cons-section"></div>' /* Placeholder for grid */}
                            </div>
                        ` : ''}
                    </div>
                    <div class="racket-actions">
                        <button class="action-btn btn-primary-action" onclick="window.racquetFinder.viewStringDetails('${string.id}')">
                            Ver Detalhes
                        </button>
                         <button class="action-btn btn-secondary-action" onclick="window.racquetFinder.compareString('${string.id}')">
                            Comparar
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        resultsContent.innerHTML = `<div class="results-grid">${recommendationsHtml}</div>`;
        this.triggerScrollAnimations();
    }

    showNoResultsMessage(mode) {
        const resultsContent = this.elements[`${mode}ResultsContent`];
        if (!resultsContent) return;
        const itemType = mode === 'racquet' ? 'raquetes' : 'cordas';
        resultsContent.innerHTML = `
            <div class="no-results">
                <span class="no-results-icon">😕</span>
                <h3>Nenhum resultado encontrado</h3>
                <p>Não encontramos ${itemType} 100% compatíveis com seu perfil em nossa base atual. Tente ajustar suas preferências ou volte mais tarde!</p>
                <button class="btn btn-secondary" onclick="window.racquetFinder.restartQuestionnaire('${mode}')">
                    Refazer Questionário
                </button>
                 <button class="btn btn-outline" onclick="window.racquetFinder.goHome()">
                    Voltar ao Início
                </button>
            </div>
        `;
    }

    // --- Métodos de Interação Adicional (Placeholders) ---

    viewRacketDetails(racketId) { this.log(`👁️ Viewing details for racket ID: ${racketId}`); /* Implementar modal/lógica */ }
    compareRacket(racketId) { this.log(`⚖️ Comparing racket ID: ${racketId}`); /* Implementar lógica de comparação */ }
    viewStringDetails(stringId) { this.log(`👁️ Viewing details for string ID: ${stringId}`); /* Implementar modal/lógica */ }
    compareString(stringId) { this.log(`⚖️ Comparing string ID: ${stringId}`); /* Implementar lógica de comparação */ }

    // --- Métodos de Scroll e Animação ---

    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
             this.log("⚠️ IntersectionObserver not supported, scroll animations disabled.");
             return; // Não suporta IntersectionObserver
        }

        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        this.scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); // Anima só uma vez
                }
            });
        }, observerOptions);

        // Observa elementos já existentes na página inicial
        document.querySelectorAll('.animate-on-scroll').forEach(el => this.scrollObserver.observe(el));
    }

    triggerScrollAnimations() {
        if (!this.scrollObserver) return;
        // Re-consulta e observa novos elementos adicionados dinamicamente (ex: resultados)
        document.querySelectorAll('.animate-on-scroll:not(.animate)').forEach(el => this.scrollObserver.observe(el));
    }

    triggerScrollAnimation(element) { // Para animar um elemento específico recém-adicionado
         if (this.scrollObserver && element) {
            this.scrollObserver.observe(element);
         }
    }


    // --- Métodos de Utilidade e Debug ---

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Fecha o menu mobile se a tela ficar grande
            if (window.innerWidth > 767) {
                 this.closeMobileNav();
            }
            this.log('Window resized');
        }, 150);
    }

    handleKeyboardNavigation(event) {
        // Só ativa se não estiver focando em input/textarea
        if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
             return;
        }

        const currentSectionId = ['racquet-questionnaire', 'string-questionnaire', 'racquet-results', 'string-results']
                                     .find(id => !this.elements[id.replace(/-([a-z])/g, g => g[1].toUpperCase())]?.classList.contains('hidden'));

        if (event.key === 'Escape') {
            if (currentSectionId) this.goHome(); // Volta pra home se estiver em outra seção
        }

        // Navegação no questionário
        if (currentSectionId?.includes('questionnaire')) {
             const mode = currentSectionId.split('-')[0]; // 'racquet' or 'string'
             if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
                 this.elements[`${mode}PrevBtn`]?.click(); // Simula clique no botão Voltar
                 event.preventDefault();
             } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
                  const nextBtn = this.elements[`${mode}NextBtn`];
                  const submitBtn = this.elements[`${mode}SubmitBtn`];
                  if (!nextBtn?.classList.contains('hidden') && !nextBtn?.disabled) {
                       nextBtn.click(); // Simula clique no Próximo
                  } else if (!submitBtn?.classList.contains('hidden') && !submitBtn?.disabled) {
                       submitBtn.click(); // Simula clique no Ver Resultados
                  }
                  event.preventDefault();
             }
        }
    }

    log(...args) {
        if (this.config.debugMode) {
            console.log('[Racquet Finder]', ...args);
        }
    }

    handleError(message, error) {
        console.error('[Racquet Finder Error]', message, error);
        // Exibe mensagem para o usuário em um local central (ex: um div de erro no topo)
        // ou substitui o conteúdo da seção atual
        const errorContainer = this.elements[`${this.currentMode}ResultsContent`] || document.body; // Fallback
        errorContainer.innerHTML = `
            <div class="error-message-display">
                <h3>⚠️ Ops! Algo deu errado.</h3>
                <p>${message}</p>
                ${this.config.debugMode ? `<pre>${error.stack || error}</pre>` : ''}
                <button onclick="window.location.reload()">Recarregar</button>
            </div>`;
    }
}

// --- Inicialização da Aplicação ---
// Garante que o DOM está pronto antes de instanciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.racquetFinder = new RacquetFinder();
        window.racquetFinder.init();
    });
} else {
    // DOM já está pronto
    window.racquetFinder = new RacquetFinder();
    window.racquetFinder.init();
}

// --- Código Adicional (Ex: Menu Mobile, Scroll Suave) ---
// (O código para menu mobile e smooth scroll que estava no final
// pode ser mantido aqui ou movido para dentro da classe se preferir
// centralizar tudo, mas como ele manipula o DOM globalmente,
// deixá-lo fora da classe também é aceitável.)

// Exemplo (mantendo fora da classe):
function setupGlobalUIEnhancements() {
    // Menu Mobile Toggle Logic
    const navMobileToggle = document.getElementById('nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navMobileToggle && navLinks) {
         // Lógica do toggle... (como estava antes)
         // ...
    }

    // Smooth scroll logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
             // Lógica do scroll suave... (como estava antes)
             // ...
        });
    });
}

// Chama as melhorias globais após o DOM carregar
if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', setupGlobalUIEnhancements);
} else {
     setupGlobalUIEnhancements();
}

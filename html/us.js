import { initializeBackgroundColor, handleBackgroundClick } from './modules/background.js';
import { saveLevels, loadLevels } from './modules/storage.js';
import { generateImage, downloadImage } from './modules/imageGenerator.js';
import { messages } from './messages.js';
import { LevelSelector, LanguageSelector } from './components/PopupComponents.js';

// DOM Elements and Utilities
const documentElement = document.documentElement;
const documentHead = document.head;
const createNewElement = name => document.createElement(name);
const newImage = _ => new Image();
const addEventListener = (element, event, callback) => element[`on${event}`] = callback;
const getBoundingClientRect = element => element.getBoundingClientRect();

// Initialize i18n
const i18n = VueI18n.createI18n({
    locale: 'English',
    fallbackLocale: 'English',
    messages,
});

// Create Vue Apps
const legendApp = Vue.createApp({}).use(i18n).mount("#ScoringLegend");
const textsApp = Vue.createApp({}).use(i18n).mount("#Texts");

// Create main Vue App
const app = Vue.createApp({
    components: {
        LevelSelector,
        LanguageSelector
    },
    data() {
        return {
            score: 0
        }
    },
    methods: {
        onLevelSelected() {
            this.calculateScore();
            saveCurrentLevels();
        },
        onLanguageSelected(lang) {
            // Update all Vue instances to the new language
            i18n.global.locale = lang;
            document.querySelector('#Lang').textContent = lang;
        },
        calculateScore() {
            const score = getAllProvinceLevels().reduce((total, current) => +total + current, 0);
            this.score = score;
            document.querySelector('#Total').innerHTML = `US Level ${score}`;
            document.querySelector('#webtitle').innerHTML = `US Level ${score}`;
        },
        showLevelSelector(element, id, position) {
            this.$refs.levelSelector.show(element, id, position);
        },
        showLanguageSelector(position) {
            this.$refs.langSelector.show(position);
        }
    }
}).use(i18n);

// Mount main app
const vueApp = app.mount('#app');

// Get DOM elements after Vue mount
const graphic = document.querySelector('svg');
const language = document.querySelector('#Lang');
const getAllProvinceElements = () => [...region.children];
const getAllProvinceLevels = () => getAllProvinceElements().map(element => +element.getAttribute('level') || 0);

// Initialize background color
initializeBackgroundColor(documentElement);
documentElement.addEventListener('click', (e) => handleBackgroundClick(e, documentElement));

// Setup event listeners
graphic.addEventListener('click', event => {
    event.stopPropagation();
    
    const { target: provinceElement } = event;
    const { id } = provinceElement;
    
    console.log('Clicked state:', {
        id,
        element: provinceElement,
        hasId: !!id,
        position: getBoundingClientRect(provinceElement)
    });
    
    if (!id) return;
    
    const position = getBoundingClientRect(provinceElement);
    
    console.log('Showing level selector with:', {
        id,
        position,
        vueApp: !!vueApp,
        hasShowMethod: !!vueApp.showLevelSelector
    });
    
    vueApp.showLevelSelector(
        provinceElement,
        id,
        {
            left: Math.round(position.left + position.width / 2),
            top: Math.round(position.top + position.height / 2)
        }
    );
});

language.addEventListener('click', event => {
    event.stopPropagation();
    
    const buttonPosition = getBoundingClientRect(event.target);
    vueApp.showLanguageSelector({
        left: buttonPosition.left,
        top: buttonPosition.top - 10
    });
});

// Save/Load functionality
const saveCurrentLevels = () => saveLevels(getAllProvinceElements);
const getLevelsAndApply = () => loadLevels(getAllProvinceElements);

// Initialize the map
getLevelsAndApply();
vueApp.calculateScore();

// Setup save image functionality
addEventListener(save, 'click', async () => {
    const url = await generateImage(graphic, documentElement, outputimage);
    downloadImage(url);
});

addEventListener(outputimage.querySelector('a'), 'click', () => {
    outputimage.style.display = 'none';
});

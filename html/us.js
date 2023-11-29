const localStorageSwap = localStorage;
const documentElement = document.documentElement;
const documentHead = document.head;
const createNewElement = name => document.createElement(name);
const newImage = _ => new Image();
const addEventListener = (element, event, callback) => element[`on${event}`] = callback;
const getBoundingClientRect = element => element.getBoundingClientRect();

import { messages } from './messages.js';

const i18n = VueI18n.createI18n({
    locale: 'English',
    fallbackLocale: 'English',
    messages,
})
const app1 = Vue.createApp().use(i18n).mount("#ScoringLegend")
const app2 = Vue.createApp().use(i18n).mount("#setlevel")
const app3 = Vue.createApp().use(i18n).mount("#Texts")

const colors = ['#F9CDC7', '#C5F9CB', '#CDE8F4', '#FDE8C4', '#D0DCD7', '#E1CEF5', '#D6D6D6'];
const colors_randomizer = Math.floor(Math.random() * 7);
documentElement.style.backgroundColor = colors[colors_randomizer]
documentElement.addEventListener('click', changeBackgroundColor);

function changeBackgroundColor(event) {
    if (event.target == document.body) {
        const colorsa = Math.floor(Math.random() * 50) + 176;
        const colorsb = Math.floor(Math.random() * 50) + 176;
        const colorsc = Math.floor(Math.random() * 50) + 176;
        documentElement.style.backgroundColor = '#' + colorsa.toString(16) + colorsb.toString(16) + colorsc.toString(16);
    }
}

const setLevelTitle = setlevel.children[0];

const closeAll = _ => {
    setLevelStyle.display = '';
    setLanguageStyle.display = '';
};
const data = {};

//this pulls from the <g id="region"> in the HTML. Not sure how, probably Vue.
const getAllProvinceElements = () => [...region.children];
const getAllProvinceLevels = () => getAllProvinceElements().map(element => +element.getAttribute('level') || 0);
const localStorageLevelsKey = 'us-levels';
const saveLevels = () => {
    let localStorageValue = ""
    for (const provinceElement of getAllProvinceElements()) {
        if (provinceElement.getAttribute('alt') == "true") {
            localStorageValue += '-'
        }
        else localStorageValue += provinceElement.getAttribute('level') || 0
    }
    localStorageSwap.setItem(localStorageLevelsKey, localStorageValue);
};
const provinceLevelsRegex = /^[\d|-]{56}$/;
const getLevelsAndApply = () => {
    const levelsString = localStorageSwap.getItem(localStorageLevelsKey);
    if (!provinceLevelsRegex.test(levelsString)) return;
    const levels = levelsString.split('');
    getAllProvinceElements().forEach((element, index) => {
        element.setAttribute('level', levels[index] == '-' ? '0' : levels[index])
        if (levels[index] == '-') element.setAttribute('alt', true);
    })
};

const graphic = document.querySelector('svg');
const setLevelStyle = setlevel.style;
const minSpacing = 6;
addEventListener(graphic, 'click', event => {
    event.stopPropagation();

    const { target: provinceElement } = event;
    const provinceElementPosition = getBoundingClientRect(provinceElement);
    const { id } = provinceElement;
    data.provinceElement = provinceElement;
    data.id = id;

    setLevelTitle.innerHTML = messages[Lang.textContent].country_name[id];
    setLevelStyle.display = 'block';
    const setLevelElementPosition = getBoundingClientRect(setlevel);

    let left = Math.round(provinceElementPosition.left + provinceElementPosition.width / 2 - setLevelElementPosition.width / 2);
    left = Math.min(
        left,
        document.body.offsetWidth - setLevelElementPosition.width - minSpacing
    );
    left = Math.max(
        left,
        minSpacing
    );

    let top = Math.round(provinceElementPosition.top + provinceElementPosition.height / 2 - setLevelElementPosition.height / 2);
    top = Math.min(
        top,
        document.body.offsetHeight - setLevelElementPosition.height - minSpacing
    );
    top = Math.max(
        top,
        minSpacing
    );

    setLevelStyle.left = left + 'px';
    setLevelStyle.top = top + 'px';
});
addEventListener(document, 'click', closeAll);
const calculateScore = () => {
    const score = getAllProvinceLevels().reduce((total, current) => {
        return +total + current;
    }, 0);
    Total.innerHTML = `US Level ${score}`;
    webtitle.innerHTML = `US Level ${score}`;
}
addEventListener(setlevel, 'click', event => {
    event.stopPropagation();
    const level = event.target.getAttribute('data-level');
    if (!level) return false;
    data.provinceElement.setAttribute('level', level);
    const alt = event.target.hasAttribute('alt');
    if (alt) data.provinceElement.setAttribute('alt', true)
    else data.provinceElement.setAttribute('alt', false);
    closeAll();
    calculateScore();
    saveLevels();
})
addEventListener(Reset, 'click', event => {
    getAllProvinceElements().forEach((element, index) => {
        element.setAttribute('level', '0')
        element.setAttribute('alt', false);
        if (element.nodeName == 'g') {
            for (const child of element.children) {
                child.setAttribute('level', '0');
                child.setAttribute('alt', false);
            }
        }
    })
    closeAll();
    calculateScore();
    saveLevels();
})

const language = document.querySelector('#Lang');
const setLanguageStyle = Set_Lang.style;
addEventListener(language, 'click', event => {
    closeAll()
    event.stopPropagation();

    setLanguageStyle.display = 'block';
    const setLanguagePosition = getBoundingClientRect(Set_Lang);
    const buttonPosition = getBoundingClientRect(language);
    const currentlanguage = Lang.textContent;
    for (const child of Set_Lang.children) {
        if (child.getAttribute('lang') == currentlanguage) {
            child.style.background = "#aaa";
        }
        else {
            child.style.background = "#fff";
        }
    }

    let left = Math.round(buttonPosition.left + buttonPosition.width / 2 - setLanguagePosition.width / 2);
    left = Math.min(
        left,
        document.body.offsetWidth - setLanguagePosition.width - minSpacing
    );
    left = Math.max(
        left,
        minSpacing
    );

    let top = Math.round(buttonPosition.top - setLanguagePosition.height - minSpacing);
    top = Math.min(
        top,
        document.body.offsetHeight - setLanguagePosition.height - minSpacing
    );
    top = Math.max(
        top,
        minSpacing
    );

    setLanguageStyle.left = left + 'px';
    setLanguageStyle.top = top + 'px';
});
const changeLanguage = (newLanguage) => {
    i18n.global.locale = newLanguage
}
addEventListener(Set_Lang, 'click', event => {
    event.stopPropagation();
    const language = event.target.getAttribute('lang');
    if (!language) return false;
    Lang.textContent = language;
    closeAll();
    changeLanguage(language);
})

getLevelsAndApply();
calculateScore();

const readFileAsURL = (originalData, callback) => {
    const reader = new FileReader();
    reader.onload = e => callback(e.target.result);
    reader.readAsDataURL(originalData);
};
const getFontDataURL = (url, callback) => {
    fetch(url).then(r => r.blob()).then(originalData => readFileAsURL(originalData, callback));
};
const getFontStyle = (fontName, callback) => {
    getFontDataURL(`${fontName}.woff?v=9`, url => callback(`@font-face {
        font-family: ${fontName};
        src: url(${url});
    };`));
};
getFontStyle('slice', styleString => {
    graphic.querySelector('style').innerHTML = styleString;
    const styleElement = createNewElement('style');
    styleElement.innerHTML = styleString;
    documentHead.appendChild(styleElement);
    setTimeout(_ => documentElement.removeAttribute('data-loading'), 2e3);
});

const width = 1150;
const height = 920;
const ratio = 2;

const canvas = createNewElement('canvas');

canvas.width = width * ratio;
canvas.height = width * ratio;

const canvasContext = canvas.getContext('2d');

const createGraphicFileFromDocumentText = documentText => {
    const originalData = new Blob([documentText], { type: 'image/svg+xml' });
    return URL.createObjectURL(originalData);
};
const isSocialMedia = /weibo|qq/i.test(navigator.userAgent);
// alert(navigator.userAgent)
const downloadFile = (link, fileName, element = createNewElement('a')) => {
    if (!isSocialMedia) {
        element.download = fileName;
    }
    element.href = link;
    element.click();
};
const urlToImageElement = (url, callback) => {
    const image = newImage();
    addEventListener(image, 'load', _ => callback(image));
    image.src = url;
};

const saveImage = _ => {
    const documentText = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${graphic.innerHTML}</svg>`;
    const dataurl = createGraphicFileFromDocumentText(documentText);
    urlToImageElement(dataurl, image => {
        canvasContext.fillStyle = documentElement.style.backgroundColor; //'#b4b4ef';
        canvasContext.fillRect(
            0, 0,
            width * ratio, width * ratio
        );
        canvasContext.drawImage(
            image,
            0, 0,
            width, height,
            0, (width - height) * ratio / 2,
            width * ratio, height * ratio
        );
        canvas.toBlob(elementdata => {
            const url = URL.createObjectURL(elementdata);
            downloadFile(url, `US Level 0.png`);

            outputimage.style.display = '';
            outputimage.querySelector('img').src = url;

        }, 'image/png');
    });
};

addEventListener(save, 'click', saveImage);

addEventListener(outputimage.querySelector('a'), 'click', () => {
    outputimage.style.display = 'none'
});

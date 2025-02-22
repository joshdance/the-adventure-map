const localStorageLevelsKey = 'us-levels';

export function saveLevels(getAllProvinceElements) {
    let localStorageValue = "";
    for (const provinceElement of getAllProvinceElements()) {
        if (provinceElement.getAttribute('alt') === "true") {
            localStorageValue += '-';
        } else {
            localStorageValue += provinceElement.getAttribute('level') || 0;
        }
    }
    localStorage.setItem(localStorageLevelsKey, localStorageValue);
}

const provinceLevelsRegex = /^[\d|-]{56}$/;

export function loadLevels(getAllProvinceElements) {
    const levelsString = localStorage.getItem(localStorageLevelsKey);
    if (!provinceLevelsRegex.test(levelsString)) return false;
    
    const levels = levelsString.split('');
    getAllProvinceElements().forEach((element, index) => {
        element.setAttribute('level', levels[index] === '-' ? '0' : levels[index]);
        if (levels[index] === '-') {
            element.setAttribute('alt', true);
        }
    });
    return true;
} 
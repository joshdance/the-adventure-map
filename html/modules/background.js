const colors = ['#F9CDC7', '#C5F9CB', '#CDE8F4', '#FDE8C4', '#D0DCD7', '#E1CEF5', '#D6D6D6'];

export function initializeBackgroundColor(documentElement) {
    const colors_randomizer = Math.floor(Math.random() * colors.length);
    documentElement.style.backgroundColor = colors[colors_randomizer];
}

export function handleBackgroundClick(event, documentElement) {
    if (event.target === document.body) {
        const colorsa = Math.floor(Math.random() * 50) + 176;
        const colorsb = Math.floor(Math.random() * 50) + 176;
        const colorsc = Math.floor(Math.random() * 50) + 176;
        documentElement.style.backgroundColor = '#' + 
            colorsa.toString(16) + 
            colorsb.toString(16) + 
            colorsc.toString(16);
    }
} 
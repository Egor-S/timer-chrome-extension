let timerState = {
    duration: null,
    timestamp: null,
    element: null,
    intervalId: null
};

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function durationColor(current, target) {
    let c0 = {r: 0, g: 255, b: 0};
    let c1 = {r: 255, g: 0, b: 0}
    let alpha = current >= target ? 1.0 : current / target;
    let r = parseInt(c0.r + (c1.r - c0.r) * alpha);
    let g = parseInt(c0.g + (c1.g - c0.g) * alpha);
    let b = parseInt(c0.b + (c1.b - c0.b) * alpha);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function durationFontSize(current, target) {
    let alpha = current >= target ? current / target : 1.0;
    return parseInt(20 * alpha) + 'px';
}

function updateTimer() {
    let totalSeconds = parseInt((Date.now() - timerState.timestamp) / 1000);
    let minutes = parseInt(totalSeconds / 60);
    let seconds = parseInt(totalSeconds % 60);
    let newText = pad(minutes, 2) + ':' + pad(seconds, 2);
    timerState.element.replaceChild(
        document.createTextNode(newText),
        timerState.element.firstChild
    );
    timerState.element.style.color = durationColor(totalSeconds, timerState.duration);
    timerState.element.style.fontSize = durationFontSize(totalSeconds, timerState.duration);
}

function triggerTimerRender() {
    chrome.storage.local.get({running: false, timestamp: 0, duration: 600}, (items) => {
        if (items.running) {
            console.log('render timer');
            timerState.duration = items.duration;
            timerState.timestamp = items.timestamp;
            if (!timerState.element) {
                timerState.element = document.createElement('div');
                timerState.element.id = 'timer-extension--timer';
                timerState.element.appendChild(document.createTextNode('00:00'));
                document.body.appendChild(timerState.element);
                updateTimer();
                timerState.intervalId = setInterval(updateTimer, 1000);
            }
        } else if (timerState.element) {
            timerState.element.parentNode.removeChild(timerState.element);
            timerState.element = null;
            clearInterval(timerState.intervalId);
            timerState.intervalId = null;
        }
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local')
        triggerTimerRender();
});

triggerTimerRender();

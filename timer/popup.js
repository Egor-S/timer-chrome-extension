function validateNumber() {
    let value = parseInt(this.value);
    let maxValue = parseInt(this.getAttribute('max'));
    let minValue = parseInt(this.getAttribute('min'));

    if (Number.isNaN(value))
        this.value = '0';
    else if (!Number.isNaN(maxValue) && value > maxValue)
        this.value = maxValue.toString();
    else if (!Number.isNaN(minValue) && value < minValue)
        this.value = minValue.toString();
    let update = {};
    update[this.id] = parseInt(this.value);
    chrome.storage.local.set(update, () => {});
}

function triggerTimer() {
    let minutes = document.getElementById('minutes');
    let seconds = document.getElementById('seconds');

    chrome.storage.local.get({running: false}, (items) => {
        let running = items.running;
        chrome.storage.local.set({
            running: !running,
            timestamp: Date.now(),
            duration: parseInt(minutes.value) * 60 + parseInt(seconds.value)
        }, updateInputs);
    });
}

function updateInputs() {
    chrome.storage.local.get({running: false, minutes: 10, seconds: 0}, (items) => {
        let running = items.running;
        let minutes = document.getElementById('minutes');
        minutes.value = items.minutes.toString();
        let seconds = document.getElementById('seconds');
        seconds.value = items.seconds.toString();
        let button = document.getElementById('trigger');

        if (running) {
            minutes.disabled = true;
            seconds.disabled = true;
            button.replaceChild(document.createTextNode('Stop'), button.firstChild);
        } else {
            minutes.disabled = false;
            seconds.disabled = false;
            button.replaceChild(document.createTextNode('Start'), button.firstChild);
        }
    });
}

window.addEventListener('load', function () {
    let minutes = document.getElementById('minutes');
    minutes.addEventListener('change', validateNumber.bind(minutes));
    let seconds = document.getElementById('seconds');
    seconds.addEventListener('change', validateNumber.bind(seconds));

    let button = document.getElementById('trigger');
    button.addEventListener('click', triggerTimer);

    updateInputs();
});

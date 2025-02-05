document.getElementById('time-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const numLoads = parseInt(document.getElementById('num-loads').value, 10);

    if (!startTime || !endTime || isNaN(numLoads) || numLoads <= 0) {
        alert('Please enter valid inputs.');
        return;
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`); // End time on the same day as start time
    if (end < start) {
        end.setDate(end.getDate() + 1); // If end time is before start time, move end time to the next day
    }

    const totalMinutes = (end - start) / (1000 * 60);
    const avgLoadDuration = totalMinutes / numLoads;

    const loadDurations = [];
    let remainingTime = totalMinutes;
    for (let i = 0; i < numLoads - 1; i++) {
        const maxDuration = Math.min(60, remainingTime - (avgLoadDuration * (numLoads - 1 - i)));
        const minDuration = Math.max(5, avgLoadDuration - 5); // Minimum duration of 5 minutes, and adjust if necessary
        const duration = Math.floor(Math.random() * (maxDuration - minDuration) + minDuration);
        loadDurations.push(duration);
        remainingTime -= duration;
    }
    loadDurations.push(remainingTime);

    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';

    let currentTime = new Date(start);
    loadDurations.forEach((duration, index) => {
        const loadStart = new Date(currentTime);
        const proposedEndTime = new Date(currentTime);
        proposedEndTime.setMinutes(proposedEndTime.getMinutes() + duration);

        if (proposedEndTime <= end) {
            currentTime = new Date(proposedEndTime);
        } else {
            // Adjust duration to fit within the remaining time until end time
            duration = (end - currentTime) / (1000 * 60);
            currentTime = new Date(end);
        }

        const loadStartStr = loadStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const loadEndStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        const listItem = document.createElement('li');
        listItem.textContent = `Load ${index + 1}: ${loadStartStr} - ${loadEndStr} (${Math.round(duration)} minutes)`;
        scheduleList.appendChild(listItem);
    });
});
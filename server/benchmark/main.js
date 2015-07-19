var count = 0;
var maxCount = 1000000;

for (var i = 0; i < maxCount; i++) {
    setTimeout(function () {
        count++;
    }, getRandomInt(0, 1000));
}

var interval;
interval = setInterval(function () {
    if (interval && count === maxCount) {
        clearInterval(interval);
    }
    console.log("Current count: " + count);
}, 100);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
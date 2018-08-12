const find = require('local-devices');

//TODO: put ourDevices in config
const ourDevices = [
    '50:f5:da:e3:8c:b9 [ether]'
];
let alertFlag = 0;
let intervalId = 0;

const startPoll = (timeout = 5000, callback) => {
    intervalId = setInterval(() => poll(callback), timeout);
};

const clearPoll = () => {
    clearInterval(intervalId);
};

const poll = (callback) => {
    find()
        .then(devices => {

            let importantDevices =
                devices
                    .map(d => d.mac)
                    .filter(d => ourDevices.indexOf(d) >= 0);

            if (importantDevices.length > 0 && alertFlag == 0) {
                alertFlag = 1;
                callback();
            }

            if (importantDevices.length == 0) alertFlag = 0;
            
        });
};

module.exports = {
    startPoll,
    clearPoll
};
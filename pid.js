const {ipcRenderer} = require('electron');
setInterval(() => ipcRenderer.send('PID', [process.pid, location.href]), 1000)

setInterval(() => {
    ipcRenderer.send('back', 'status');
}, 10)
ipcRenderer.on('reply', (event, arg) => {
    if (arg == 99) {
        history.back()
    } else if (arg == 101) {
        history.forward()
    }
    console.log(arg);
});
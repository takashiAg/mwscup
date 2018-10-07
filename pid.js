const {ipcRenderer} = require('electron');
setInterval(() => ipcRenderer.send('PID', [process.pid, location.href]), 1000)
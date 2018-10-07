const {ipcRenderer} = require('electron');
setInterval(() => ipcRenderer.send('ipc', [process.pid, location.href]), 1000)
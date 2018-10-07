const cluster = require('cluster');

let process_list = [];
if (!cluster.isMaster) {
    // This is ps monitor thread
    console.log('monitor thread started')

    const {exec, execSync} = require('child_process');
    setInterval(() => {
        process_list = []
        let stdout = execSync('ps uax').toString();
        stdout.split('\n').forEach(value => {
            let result = value.match(/.*Electron|electron.*/g);
            if (result == null)
                return;
            let result_array = value.split(/\s+/g);
            let ps_list = {
                "user": result_array[0],
                "pid": result_array[1],
                "cpu": result_array[2],
                "mem": result_array[3],
                "vsz": result_array[4],
                "rss": result_array[5],
                "tt": result_array[6],
                "stat": result_array[7],
                "started": result_array[8],
                "time": result_array[9],
                "command": result_array[10]
            }
            process_list.push(ps_list);
        });
        console.log(process_list);
    }, 1000)
} else {
    //main process
    console.log("main thread started");

    //新しいスレッドを立ち上げる
    cluster.fork();

    const {app, BrowserWindow, ipcMain} = require('electron')
    const {exec, execSync} = require('child_process');

    let mainWindow = null;
    console.log(process.pid);

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function () {

        ipcMain.on('ipc', (event, arg) => console.log(arg));

        // ブラウザ(Chromium)の起動, 初期画面のロード
        mainWindow = new BrowserWindow({width: 800, height: 600});
        mainWindow.loadURL('file://' + __dirname + '/index.html');

        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    });

}


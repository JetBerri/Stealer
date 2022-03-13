/*
    SERVER
*/

// Needed libraries
#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

int main(){
    int s, client_socket;
    char buffer[1024];
    char response[18384];
    struct sockaddr_in saddr, caddr;
    int i=0;
    int optval = 1;
    socklen_t client_lenght;

    s = socket(AF_INET, SOCK_STREAM, 0);

    if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval))< 0){
        printf("Error setting TCP Socket Options! \n");
        return 1;
    }else{
        saddr.sin_family = AF_INET;
        saddr.sin_addr.s_addr = inet_addr("192.168.4.26");
        saddr.sin_port = htons(8080);

        bind(s, (struct sockaddr *) &saddr, sizeof(saddr));
        listen(s, 10);
        client_lenght = sizeof(caddr);
        client_socket = accept(s, (struct sockaddr *) &caddr, &client_lenght);

        while (1){
            jump:
            bzero(&buffer, sizeof(buffer));
            bzero(&response, sizeof(response));
            printf("* ~$%s: ", inet_ntoa(caddr.sin_addr));
            fgets(buffer, sizeof(buffer), stdin);
            strtok(buffer, "\n");
            write(client_socket, buffer, sizeof(buffer));
            if (strncmp("q", buffer,1)== 0){
                break;
            }else{
                recv(client_socket, response, sizeof(response), MSG_WAITALL);
                printf("%s", response);
            }

        }
    }
}
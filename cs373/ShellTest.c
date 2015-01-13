#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <ctype.h>
#include <errno.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <assert.h>

extern int errno;

typedef void (*sighandler_t)(int);
static char *my_argv[100];
static char *my_envp[100];
static char *search_path[10];

/* clears the output stream to prepare the new shell for input */
void handle_signal(int signo) {
	printf("\n[~JMNT_SHELL~  ] ");
	fflush(stdout);
}

void fill_argv(char *tmp_argv) {
	char *temp = tmp_argv;
	int index = 0;
	
	char* ret = (char*) calloc(sizeof(char), 100);
	assert(ret);

	while(*temp != '\0') {
		if(index == 10)
			break;

		if(*temp == ' ') {
			if(my_argv[index] == NULL)
				my_argv[index] = (char *)malloc(sizeof(char) * strlen(ret) + 1);
			else {
				bzero(my_argv[index], strlen(my_argv[index]));
			}
			strncpy(my_argv[index], ret, strlen(ret));
			strncat(my_argv[index], "\0", 1);
			bzero(ret, 100);
			index++;
		} else {
			strncat(ret, temp, 1);
		}
		temp++;
	}
	my_argv[index] = (char*) calloc(sizeof(char), strlen(ret) + 1);
	assert(my_argv[index]);

	strncpy(my_argv[index], ret, strlen(ret));
	strncat(my_argv[index], "\0", 1);

	free(ret);
}

void copy_envp(char **envp){
	int index;

	for(index = 0; envp[index] != NULL; index++) {
		my_envp[index] = (char *)calloc(sizeof(char), (strlen(envp[index]) + 1));
		assert(my_envp[index]);

		memcpy(my_envp[index], envp[index], strlen(envp[index]));
	}
}

void get_path_string(char **tmp_envp, char *bin_path){
	int count = 0;
	char *tmp;

	tmp = strstr(tmp_envp[count], "PATH");

	while(tmp == NULL) {
		count++;
		tmp = strstr(tmp_envp[count], "PATH");
	}
        strncpy(bin_path, tmp, strlen(tmp));
}

void insert_path_str_to_search(char *path_str) {
	int index = 0;
	char *tmp = path_str;
	char* ret = (char*)calloc(sizeof(char), 100);
	assert(ret);

	while(*tmp != '=')
		tmp++;
	tmp++;

	while(*tmp != '\0') {
		if(*tmp == ':') {
			strncat(ret, "/", 1);
			search_path[index] = (char *) malloc(sizeof(char) * (strlen(ret) + 1));
			strncat(search_path[index], ret, strlen(ret));
			strncat(search_path[index], "\0", 1);
			index++;
			ret = (char*)calloc(sizeof(char), 100);
			assert(ret);
		} else {
			strncat(ret, tmp, 1);
		}
		tmp++;
	}

	free(ret);
}

int attach_path(char *cmd){
	int index;
	int fd;
	char* ret = (char*)calloc(sizeof(char), 100);
	assert(ret);

	for(index = 0; search_path[index] != NULL; index++) {
		strcpy(ret, search_path[index]);
		strncat(ret, cmd, strlen(cmd));
		if((fd = open(ret, O_RDONLY)) > 0) {
			strncpy(cmd, ret, strlen(ret));
			close(fd);
			free(ret);
			return 0;
		}
	}

	free(ret);
	return 0;
}

void call_execve(char *cmd){
	int i;
	printf("cmd is %s\n", cmd);
	if(fork() == 0) {
		i = execve(cmd, my_argv, my_envp);
		printf("errno is %d\n", errno);
		if(i < 0) {
			printf("%s: %s\n", cmd, "command not found");
			exit(1);		
		}
	} else {
		wait(NULL);
	}
}

void free_argv(){
	int index;
	for(index=0;my_argv[index]!=NULL;index++) {
		bzero(my_argv[index], strlen(my_argv[index])+1);
		my_argv[index] = NULL;
		free(my_argv[index]);
	}
}

int main(int argc, char *argv[], char *envp[]){
	char c;
	int i, fd;
	char *tmp = (char *)malloc(sizeof(char) * 100);
	char *path_str = (char *)malloc(sizeof(char) * 256);
	char *cmd = (char *)malloc(sizeof(char) * 100);
	
	signal(SIGINT, SIG_IGN);
	signal(SIGINT, handle_signal);

	copy_envp(envp);
	get_path_string(my_envp, path_str);
	insert_path_str_to_search(path_str);

	if(fork() == 0) {
		execve("/usr/bin/clear", argv, my_envp);
		exit(1);
	} else {
		wait(NULL);
	}
	printf("[~JMNT_SHELL~  ] ");
	fflush(stdout);
	while(c != EOF) {
		c = getchar();
		switch(c) {
			case '\n': if(tmp[0] == '\0') {
					   printf("[~JMNT_SHELL~  ] ");
				   } else {
					   fill_argv(tmp);
					   strncpy(cmd, my_argv[0], strlen(my_argv[0]));
					   strncat(cmd, "\0", 1);
					   if(index(cmd, '/') == NULL) {
						   if(attach_path(cmd) == 0) {
							   call_execve(cmd);
						   } else {
							   printf("%s: command not found\n", cmd);
						   }
					   } else {
						   if((fd = open(cmd, O_RDONLY)) > 0) {
							   close(fd);
							   call_execve(cmd);
						   } else {
							   printf("%s: command not found\n", cmd);
						   }
					   }
					   free_argv();
					   printf("[~JMNT_SHELL~  ] ");
					   bzero(cmd, 100);
				   }
				   bzero(tmp, 100);
				   break;
			default: strncat(tmp, &c, 1);
				 break;
		}
	}
	free(tmp);
	free(path_str);
	for(i=0;my_envp[i]!=NULL;i++)
		free(my_envp[i]);
	for(i=0;i<10;i++)
		free(search_path[i]);
	printf("\n");
	return 0;
}

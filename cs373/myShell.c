#include <stdio.h>
#include <string.h>

int countArgs(char*);
void parse(char*, int, char **);

int main(int argc, char **argv)
{
        //buffer is to hold the commands that the user will type in
        char buffer[512];
        // /bin/program_name is the arguments to pass to execv
        //if we want to run ls, "/bin/ls" is required to be passed to execv()
        char* path = "/bin/";

        while(1)
        {
                //print the prompt
                printf("myShell>");
                //get input
                fgets(buffer, 512, stdin);
                //fork!
		printf("FORKING");
//int pid=$$;
                int pid = fork();
                //Error checking to see if fork works
                //If pid !=0 then it's the parent
                if(pid!=0)
                {
                        wait(NULL);
                }
                else
                {
                        //if pid = 0 then we're at teh child
                        //Count the number of arguments
                        int num_of_args = countArgs(buffer);
                        //create an array of pointers for the arguments to be passed to execcv.
                        char *arguments[num_of_args+1];
                        //parse the input and arguments will have all the arguments to be passed to the program
                        parse(buffer, num_of_args, arguments);
                        //set the last pointer in the array to NULL. Requirement of execv
                        arguments[num_of_args] = NULL;
                        //This will be the final path to the program that we will pass to execv
                        char prog[512];
                        //First we copy a /bin/ to prog
                        strcpy(prog, path);
                        //Then we concancate the program name to /bin/
                        //If the program name is ls, then it'll be /bin/ls
                        strcat(prog, arguments[0]);
                        //pass the prepared arguments to execv and we're done!
                        int rv = execv(prog, arguments);
                }
        }
        return 0;
}

int countArgs(char *buffer)
{
	int count;
	char *p;
	printf("MADE IT TO COUNTARGS");
	p = strtok(buffer, " \t");
	while(p != NULL)count++;
	printf("%d", count);
	return count;
}

void parse(char *buffer, int num_of_args, char **arguments)
{
	int i = 0;
	char *p; 
	while(i < num_of_args){
		p = strtok(buffer, " \t");
		arguments[i] = p;
	}
}

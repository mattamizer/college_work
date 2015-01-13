#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//input = sudo tcpdump -i any -c 10 >> captureInput.txt

void main() {
	char line[100];
	char macAddress[20];
	char ipAddress[40];
	int count = 0;
	int i = 0;
	FILE *fp;
	char delete[1];

	//printf("Would you like to overwrite the existing file? <y/n> ");
	//scanf("%c", &delete);

	system( "sudo tcpdump -i any -c 10 -N -q > captureInput.txt" );

	if((fp = fopen("captureInput.txt", "rt")) == NULL) {
		printf("Error opening file.\n");
		exit(1);
	}

	printf("\n\n");

	while(fgets(line, sizeof(line), fp) != NULL) {
		count = count + 1;

		printf("\nLine %d: %s", count, line);
		
		strncpy(macAddress, &line[0], 15);
		printf("MAC Address: %s\n", macAddress);

		//strncpy(ipAddress, &line[16], 30);
		//printf("\nIP Address: %s\n", ipAddress);
	}
	
	printf("\n\n");

	fclose(fp);
}

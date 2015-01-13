/**@author Matthew Morrissey
 **@version 1.0
 **RegistrarSimulator Class*/

import java.util.Scanner;
import java.util.concurrent.ConcurrentLinkedQueue;

public class RegistrarSimulator{
    /**Main method.*/
    public static void main(String[] args){
	int numStudents, numClerks;
	Scanner sc = new Scanner(System.in);
	System.out.print("How many students do you wish to create?   ");
	numStudents = sc.nextInt();
	System.out.print("How many clerks do you wish to create?   ");
	numClerks = sc.nextInt();
	ConcurrentLinkedQueue<Student> line = new ConcurrentLinkedQueue<Student>();
	Clerk[] clerks = new Clerk[numClerks];
	for(int i = 0; i < numClerks; i++){
	    Clerk c = new Clerk(line);
	    Thread t = new Thread(c);
	    clerks[i] = c;
	    t.start();
	}
	    for(int j = 0; j < numStudents; j++){
		try{
		    int rand = (int)(((Math.random()+0.1) * 6.0)*1000);
		    Thread.sleep(rand);
		    Student s = new Student();
		    line.add(s);
		    System.out.println(s.toString() + " entered the line. (" + line.size() + " students waiting.)");
		}
		catch(InterruptedException e){
		    //Bummer
		}
	    }
    }
}
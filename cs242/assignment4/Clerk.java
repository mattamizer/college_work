/**@author Matthew Morrissey
 **@version 1.0
 **Clerk Class. Assigns each Cleck a unique ID and watches for Students to be served.
 **Each Clerk will keep track of how many Students it has served.*/
import java.util.concurrent.ConcurrentLinkedQueue;

public class Clerk implements Runnable{
    private int clerkID;
    private static int x = 1;
    private int studentsServed = 0;
    private ConcurrentLinkedQueue queue;
    /**Construcor for the Clerk. Takes @param*/
    public Clerk(ConcurrentLinkedQueue queue){
	this.queue = queue;
	clerkID = x++;
    }
    /**Run implementation for the Clerk*/
    public void run(){
	while(true){
	    try{
		Student s = (Student)queue.poll();
		if(s == null)
		    Thread.sleep(1000);
	    else{
		System.out.println("Clerk " + clerkID + " is serving " + s.toString());
		studentsServed++;
		delay();
	    }
	    }
	    catch(InterruptedException e){
		System.out.println("Clerk " + clerkID + " terminated. Served " + studentsServed + " students.");
		break;
	    }
	}
    }
    /**Delay method. Forces the process to wait a random amount of time
       between 0.5 and 5 seconds*/
    private void delay(){
	try{
	    int delay = (int)(((Math.random()+0.5) * 6.0)*1000);
	System.out.println("Delay is " + delay);
	Thread.sleep(delay);
	}
	catch(InterruptedException e){
	    //D'oh
	}
    }
    /**toString method. Returns @return*/
    public String toString(){
	return "Clerk " + clerkID;
    }
}
/**
 * @(#)Main.java
 *
 *
 * Matthew Morrissey 
 * version 1.00 2009/4/15
 * CS 140
 * Main class, contains the main method for the Spaces project.
 */

public class Main
{
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args)
    {
        Space s1 = new Space();
		Space s2 = new Space();
		s1.setName("Cockpit");
		s2.setName("Viewing room");
		s1.setDescription("The cockpit of the Satellite of Love");
		s2.setDescription("A large movie theater for viewing terrible, terrible movies");
		Portal p1 = new Portal();
		p1.setDestination(s2);
		s1.setPortal(p1);
		p1.setDirection("south");
		p1.setName("door");
		Door d1 = new Door();
		d1.setDestination(s1);
		d1.setDirection("north");
		s2.setPortal(d1);
		Agent agent = new Agent();
		agent.setName("Tom Servo");
		agent.setLocation(s1);
		CommandInterpreter.run(agent);
    }
}

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
    	s1.setName("big room");
    	s1.setDescription( "a room with high ceilings and a blue rug" );
	
	    Space s2 = new Space();
    	s2.setName("small room");
    	s2.setDescription("a room that smells of french fries");

    	Portal p1 = new Portal();
    	p1.setName("door");
    	p1.setDirection("south");
    	p1.setDestination(s2);
    	s1.setPortal(p1);

    	Portal p2 = new Portal();
    	p2.setName("door");
    	p2.setDirection("north");
    	p2.setDestination(s1);
    	s2.setPortal(p2);

    	System.out.println(s1.toStringLong());
    	System.out.println(s2.toStringLong());
    }
}

/**
 * @(#)Portal.java
 *
 *
 * Matthew Morrissey 
 * @version 1.00 2009/4/15
 * CS 140
 * Allows for the creation of Portals, with getters and setters for all member variables
 */


public class Portal
{
	private String name, direction;
	private Space destination;
	public void setName(String name)//Set the name of the Portal
	{
		this.name = name;
	}
	public String getName()//Return the name of the Portal
	{
		return name;
	}
	public void setDirection(String direction)//Set the direction of the Portal
	{
		this.direction = direction;
	}
	public String getDirection()//Return the direction of the portal
	{
		return direction;
	}
	public void setDestination(Space destination)//Set the destination Space
	{
		this.destination = destination;
	}
	public Space getDestination()//Return the current destination Space
	{
		return destination;
	}
	public String toString()
	{
		return this.name + " that goes " + this.direction;
	}
	public String toStringLong()
	{
		return this.name + " that goes " + this.direction + " to " + this.destination.toString();
	}
}
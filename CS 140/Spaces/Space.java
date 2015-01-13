/**
 * @(#)Space.java
 *
 *
 * Matthew Morrissey 
 * version 1.00 2009/4/15
 * CS 140
 * Allows for the creation of Spaces, with getters and setters for all member variables
 */


public class Space
{
	private String name, description;
	private Portal portal;
	public void setName(String name)//Set the name of the Space
	{
		this.name = name;
	}
	public String getName()//Get the name of the Space
	{
		return name;
	}
	public void setDescription(String description)//Set the description of the Space
	{
		this.description = description;
	}
	public String getDescription()//Get the description of the Space
	{
		return description;
	}
	public void setPortal(Portal portal)//Set the Portal, depends on the Portal class
	{
		this.portal = portal;
	}
	public Portal getPortal()//Get the current Portal, depends on the Portal class
	{
		return portal;
	}
	public String toString()//Returns the name of the Space
	{
		return this.name;
	}
	public String toStringLong()//Returns a full description of the Space
	{
		String retVal = this.name + ": " + this.description + ".";
		if(portal != null)
		{
			retVal = retVal + "\n" + "It's portal is a " + portal.toStringLong();
			return retVal;
		}
		return retVal;
	}
}
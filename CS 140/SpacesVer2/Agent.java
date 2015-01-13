/**
 * @(#)Agent.java
 *
 *
 * Matthew Morrissey 
 * version 1.00 2009/4/16
 * CS 140
 * Creates an agent that can move through Spaces and Portals
 */


public class Agent
{
	Space location;
	String name;
	public Space getLocation()
	{
		return location;
	}
	public void setLocation(Space location)
	{
		this.location = location;
	}
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public String toString()
	{
		return name;
	}
	public String toStringLong()
	{
		return name + " is in " + location.toString();
	}
	public boolean usePortal()
	{
		if(this.location.getPortal() != null)
		{
			this.location.getPortal().transport(this);
			return true;
		}
		return false;
	}
}
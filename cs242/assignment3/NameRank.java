/*Matthew Morrissey
 *CS 242
 *09/09/2009
 *NameRank Class: Class for storing name/rank data from the US national census*/


public class NameRank
{
    private String name;
    private float percentage, cumulativepercentage;
    private int rank;
    public NameRank()
    {
	//Creates empty NameRank object
    }
    public NameRank(String name, float percentage, float cumulativepercentage, int rank)
    {
	this.name = name;
	this.percentage = percentage;
	this.cumulativepercentage = cumulativepercentage;
	this.rank = rank;
    }
    public void setName(String name)
    {
	this.name = name;
    }
    public String getName()
    {
	return name;
    }
    public void setPercentage(float percentage)
    {
	this.percentage = percentage;
    }
    public float getPercentage()
    {
	return percentage;
    }
    public void setCumulativePercentage(float cumulativepercentage)
    {
	this.cumulativepercentage = cumulativepercentage;
    }
    public float getCumulativePercentage()
    {
	return cumulativepercentage;
    }
    public void setRank(int rank)
    {
	this.rank = rank;
    }
    public int getRank()
    {
	return rank;
    }
    public Object clone(Object Obj)
    {
	return new NameRank((String)this.name, this.percentage, this.cumulativepercentage, this.rank);
    }
    public String toString()
    {
	String line1 = "The name is " + name;
	String line2 = "The percentage is " + percentage;
	String line3 = "The cumulative percentage is " + cumulativepercentage;
	String line4 = "The rank is " + rank;
	String output = line1 + " " + line2 + " " + line3 + " " + line4 + ".";
	return output;
    }
    public boolean equals(Object obj)
    {
	boolean result = false;
	if(obj instanceof NameRank){
	    NameRank nr = (NameRank)obj;
	    if(nr.name.equals(this.name) && nr.percentage == this.percentage && nr.cumulativepercentage == this.cumulativepercentage && nr.rank == this.rank)
		result = true;
	}
	return result;
    }
}
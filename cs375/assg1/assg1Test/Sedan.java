public class Sedan extends Automobile{
	public boolean equals(Object obj){
		System.out.println("C");
		return(true);
	}
	public boolean equals(Automobile auto){
		System.out.println("D");
		return(true);
	}
	public boolean equals(Sedan sedan){
		System.out.println("E");
		return(true);
	}
}

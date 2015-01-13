/*Matthew Morrissey
 *CS242
 *09/09/2009
 *NameStore class - class for reading in, parsing, and storing census data*/
import javax.swing.JFileChooser;
import java.io.*;

public class NameStore
{
    public static void main(String[] args)
    {    
	NameRank[] lastName = new NameRank[88799];
	NameRank[] femaleFirst = new NameRank[4276];
	NameRank[] maleFirst = new NameRank[1219];
	//Try block to catch errors generated
	try{
	System.out.println("Please select the last names file.");
	JFileChooser chooser = new JFileChooser();
	int result = chooser.showOpenDialog(null);
	File file = null;
	if(result == JFileChooser.APPROVE_OPTION)
	    file = chooser.getSelectedFile();
	System.out.println("You chose " + file);
	if(!file.canRead())
	    throw new RuntimeException("Unable to open " + file);
	//Read in last name file
	BufferedReader br = new BufferedReader(new FileReader(file));
	for(int i = 0; i < lastName.length; i++){
	    String line = br.readLine();
	    String[] parseResult = line.split("\\s+");
	    NameRank nr = new NameRank(parseResult[0], Float.valueOf(parseResult[1].trim()).floatValue(), Float.valueOf(parseResult[2].trim()).floatValue(), Integer.parseInt(parseResult[3]));
	    lastName[i] = nr;
	}
	br.close();
	//Read in female first name file
	System.out.println("Please select the female first name file.");
	JFileChooser chooser2 = new JFileChooser();
	int result2 = chooser2.showOpenDialog(null);
	File file2 = null;
	if(result2 == JFileChooser.APPROVE_OPTION)
	    file2 = chooser2.getSelectedFile();
	System.out.println("You chose " + file2);
	if(!file2.canRead())
	    throw new RuntimeException("Unable to open " + file2);
	BufferedReader br2 = new BufferedReader(new FileReader(file2));
	for(int i = 0; i < femaleFirst.length; i++){
	    String line2 = br2.readLine();
	    if(line2 == null)
		break;
	    String[] parseResult2 = line2.split("\\s+");
	    NameRank nrFemale = new NameRank(parseResult2[0], Float.valueOf(parseResult2[1].trim()).floatValue(), Float.valueOf(parseResult2[2].trim()).floatValue(), Integer.parseInt(parseResult2[3]));
	    femaleFirst[i] = nrFemale;
	}
	br2.close();
	//Read in male first name file
	System.out.println("Please select the male first name file.");
	JFileChooser chooser3 = new JFileChooser();
	int result3 = chooser3.showOpenDialog(null);
	File file3 = null;
	if(result3 == JFileChooser.APPROVE_OPTION)
	    file3 = chooser3.getSelectedFile();
	System.out.println("You chose " + file3);
	if(!file3.canRead())
	    throw new RuntimeException("Unable to open " + file3);
	BufferedReader br3 = new BufferedReader(new FileReader(file3));
	for(int i = 0; i < maleFirst.length; i++){
	    String line = br3.readLine();
	    String[] parseResult = line.split("\\s+");
	    NameRank nr = new NameRank(parseResult[0], Float.valueOf(parseResult[1].trim()).floatValue(), Float.valueOf(parseResult[2].trim()).floatValue(), Integer.parseInt(parseResult[3]));
	    maleFirst[i] = nr;
	}
	br3.close();
	}
	catch(java.io.IOException exn){
	    System.out.println("PHAIL! You made err0r!");
	}
    }
}  
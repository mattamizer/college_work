import javax.swing.JFileChooser;
import javax.swing.filechooser.FileFilter;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.io.File;

public class WordCounter {
	public static void main (String[] args) {
		WordFrequencyAnalyzer wfa = new WordFrequencyAnalyzer();
		File wordFile = getFile();

		wfa.analyzeText(wordFile);
	}

	/**
	 * This method uses a JFileChooser to select a file. The method 
	 * continues until a valid file is selected.
	 *
	 * Postcondition: A File is returned. The File is not null.
	 */
	private static File getFile() {
		JFileChooser fileOpen;;
    		FileFilter filter;
    		int openSuccessful;
		File file = null;

		do {
			//opens a new JFileChooser to search for text files
			fileOpen = new JFileChooser();
			filter = new FileNameExtensionFilter("text files", "txt");
			openSuccessful = fileOpen.showDialog(null, "Open File");
			fileOpen.addChoosableFileFilter(filter);

			//once the user selects a valid file, the file is returned
	    		if (openSuccessful == JFileChooser.APPROVE_OPTION) {
	      			file = fileOpen.getSelectedFile();
				break;
	    		}
		} while((openSuccessful != JFileChooser.APPROVE_OPTION) && (file == null));
		
		return file;
	}
}

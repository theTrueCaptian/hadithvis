package edu.hadith.vis.main.tokenizer;

import org.apache.commons.io.IOUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by mh4047 on 12/4/16.
 */
public class Commons {

    public static String PATH_TO_PUBLIC = System.getProperty("user.dir")+"/src/main/resources/public";
    public static String HADITH_DELIMITER_FILE = PATH_TO_PUBLIC+"/tokens/hadith_delimiters.txt";
    public static String CHAIN_DELIMITER_FILE = PATH_TO_PUBLIC+"/tokens/chain_delimiters.txt";

    protected static List<String> getChainDelimiters(){
        return readFile(CHAIN_DELIMITER_FILE).stream().filter((a)->!a.equals("") && !a.equals(" ")).collect(Collectors.toList());
    }

    protected static List<String> getHadithDelimiters(){
        return readFile(HADITH_DELIMITER_FILE).stream().filter((a)->!a.equals("") && !a.equals(" ")).collect(Collectors.toList());
    }

    protected static void saveChainDelimiters(List<String> chainDelimiters){
        String content = chainDelimiters.stream().filter((a)->!a.equals("") && !a.equals(" ")).reduce("",(a,b)->a+"\n"+b);
        writeToFile(CHAIN_DELIMITER_FILE, content);
    }

    protected static void saveHadithDelimiters(List<String> hadithDelimiters){
        String content = hadithDelimiters.stream().filter((a)->!a.equals("") && !a.equals(" ")).reduce("",(a,b)->a+"\n"+b);
        writeToFile(HADITH_DELIMITER_FILE, content);
    }

    protected static List<String> readFile(String filename){
        List<String> lines = new ArrayList<String>();
        try{
            String content = IOUtils.toString(new FileInputStream(filename), "UTF8");
            lines.addAll(Arrays.asList(content.split("\\n")));
            //System.out.println("Read file:"+filename+" content:"+content);
        }catch(IOException ex){
            ex.printStackTrace();
        }
        return lines;
    }

    protected static void writeToFile(String filename, String content){
        try{
            OutputStreamWriter os = new OutputStreamWriter(new FileOutputStream(filename), "UTF8");
            //System.out.println("Write to file:"+filename+" content:"+content);
            os.write(content);
            os.flush();

        }catch(IOException ex){
            ex.printStackTrace();
        }
    }
}

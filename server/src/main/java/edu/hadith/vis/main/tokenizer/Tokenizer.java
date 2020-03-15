package edu.hadith.vis.main.tokenizer;

import edu.hadith.vis.main.database.ArabicHadith;
import org.apache.commons.lang3.ArrayUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by mh4047 on 12/4/16.
 */
public class Tokenizer {
    /**
     * Array of hadiths and array of delimiters.
     * pDelimiters are the delimiters the separate hadith and chain
     * Returns an array of tokenized hadiths e.g. [hadith, ...],
     * where hadith = {hadith: "qul abu hurarirah qul aisha", narration: "narration", 'hadithDelimiter':'prophet name', split:[{type:token, text:qul}, ...]}
     */
    public List<TokenizedHadith> tokenizeHadiths(List<ArabicHadith> allHadithTexts, List<String> delimiters, List<String> pDelimiters){
        List<TokenizedHadith> tokenizedHadiths = new ArrayList();
        System.out.println("Tokenize hadith with: "+Arrays.toString(delimiters.toArray()));

        //Tokenize the hadith
        for(int i=0; i<allHadithTexts.size(); i++){
            //SplitChain into chain and narration
            SplitHadith split = splitHadith(allHadithTexts.get(i).getHadithText(), pDelimiters);
            List<SplitChain> splitChain = tokenizeChain(split.getChain(), delimiters);
            tokenizedHadiths.add(new TokenizedHadith(allHadithTexts.get(i).getHadithText(), split.getHadithDelimiter(), split.getNarration(), splitChain));
        }

        //System.out.println(Arrays.toString(tokenizedHadiths.toArray()));
        return tokenizedHadiths;

    }

    /**
     * SplitChain a given hadith text into chain and narration
     * pDelimiters are the delimiters the separate hadith and chain
     * Return the split e.g. {'narration':"blah blah", 'chain':'blah blah', 'hadithDelimiter':'prophet name'}
     */
    private SplitHadith splitHadith(String hadithText, List<String> pDelimiters){
        SplitHadith split = new SplitHadith("", hadithText);
        for(int i=0; i<pDelimiters.size(); i++){
            String[] narration = hadithText.split(pDelimiters.get(i));

            //Check if anything is delimited
            if(narration.length>=2){
                split.setChain( narration[0]);

                split.setHadithDelimiter( pDelimiters.get(i));
                narration = ArrayUtils.remove(narration, 0);
                split.setNarration(Arrays.toString(narration));
                break;
            }
        }
        //System.out.println("Split:"+split.toString());
        return split;
    }

    /**
     * A hadith and an array of delimiters.
     * e.g. "qul abu hurarirah qul aisha" ==> ["qul", "abu hurarirah", "qul", "aisha"] ==> [{type:token, text:qul}, ...]
     */
    private List<SplitChain> tokenizeChain(String chain, List<String> delimiters){
        List<String> splitHadith = new ArrayList<String>(); // Array containing words
        splitHadith.add(chain);

        for(int i=0; i<delimiters.size(); i++){

            String tokenizer = delimiters.get(i);			//e.g. qul
            if(tokenizer.equals("")){ continue;}

            for(int j=0; j<splitHadith.size(); j++){

                List<String> newSplits = new ArrayList<String>();
                newSplits.addAll(Arrays.asList(splitHadith.get(j).split(tokenizer)));    //e.g. [abu hurarirah, aisha]

                String toSplit = splitHadith.get(j);

                // Re-Add the delimiters into the array e.g. [qul, abu hurarirah, qul , aisha]
                int arrayLength = newSplits.size();
                for(int k=0;k<arrayLength; k++){
                    if((k==0 && toSplit.startsWith(tokenizer)) || (k>0 && k<arrayLength)){
                        if(k<newSplits.size()) {
                            newSplits.add(k, tokenizer);
                        }else{
                            newSplits.add(tokenizer);
                        }
                        k=k+1;
                    }
                    //Update the length of the array
                    arrayLength = newSplits.size();
                }
                if(toSplit.endsWith(tokenizer)){
                    //If in the end of the string there was no tokenizer, then don't add
                    newSplits.add(tokenizer);
                }

                //Replace the current item in newSplits with these new tokens in newSplits
                //Beginning array
                List<String> begArr = splitHadith.subList(0, j);
                //End of array
                List<String> endArr = splitHadith.subList(j+1, splitHadith.size());

                //Join beginning, new splits, and the end arrays
                splitHadith = new ArrayList<String>();
                splitHadith.addAll(begArr);
                splitHadith.addAll(newSplits);
                splitHadith.addAll(endArr);

                //Reset j:
                j++;
            }
            splitHadith = splitHadith.stream().filter(p -> !p.equals("")).collect(Collectors.toList());
        }

        //if(delimiters.size()>0){delimiters.add(" ");}
        return toTabularView(splitHadith, delimiters);
    }

    /**
     * Organize into a form for easy table loading.
     */
    private List<SplitChain> toTabularView(List<String> splitHadith, List<String> delimiters){
        //Group: ["qul", "abu hurarirah", "qul", "aisha"] ==> [{type:token, text:qul}, ...]
        List<SplitChain> cleanSplit = new ArrayList<SplitChain>();
        String currentType = "";
        for(int i=0; i<splitHadith.size(); i++){
            // A space is also tokenizer
            if(isStringInArray(splitHadith.get(i), delimiters)){
                //Add a tokenizer
                if(currentType.equals("") || currentType.equals("text")){
                    List<String> text = new ArrayList<String>();
                    text.add(splitHadith.get(i));
                    cleanSplit.add(new SplitChain("tokenizer", text));
                }else{
                    cleanSplit.get(cleanSplit.size()-1).getText().add(splitHadith.get(i));
                }
                currentType = "tokenizer";
            }else{
                //Add a text (non tokenizer) type
                if(currentType.equals("") || currentType.equals("tokenizer")){
                    List<String> text = new ArrayList<String>();
                    text.add(splitHadith.get(i));
                    cleanSplit.add(new SplitChain("text", text));
                }else{
                    cleanSplit.get(cleanSplit.size()-1).getText().add(splitHadith.get(i));
                }
                currentType = "text";
            }
        }
        return cleanSplit;
    }

    private boolean isStringInArray(String str, List<String> arr){
        for(int k=0; k<arr.size(); k++){
            if(arr.get(k).equals(str)){
                return true;
            }
        }
        return false;
    }


}

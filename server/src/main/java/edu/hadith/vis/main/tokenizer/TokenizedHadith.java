package edu.hadith.vis.main.tokenizer;

import java.util.Arrays;
import java.util.List;

/**
 * Created by mh4047 on 12/4/16.
 */
public class TokenizedHadith {
    private String hadith;
    private String hadithDelimiter;
    private String narration;
    private List<SplitChain> chain;

    public TokenizedHadith(){

    }
    public TokenizedHadith(String hadith, String hadithDelimiter, String narration, List<SplitChain> chain){
        this.hadith = hadith; this.hadithDelimiter = hadithDelimiter;
        this.narration = narration; this.chain = chain;
    }


    public String getHadith() {
        return hadith;
    }

    public void setHadith(String hadith) {
        this.hadith = hadith;
    }

    public String getHadithDelimiter() {
        return hadithDelimiter;
    }

    public void setHadithDelimiter(String hadithDelimiter) {
        this.hadithDelimiter = hadithDelimiter;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public List<SplitChain> getChain() {
        return chain;
    }

    public void setChain(List<SplitChain> chain) {
        this.chain = chain;
    }

    public String toString(){
        return "\nhadith:"+hadith
                +"\n\thadithdelimiter:"+hadithDelimiter
                +"\n\tnarration:"+narration
                +"\n\tchain:"+ Arrays.toString(chain.toArray())+"\n";
    }
}

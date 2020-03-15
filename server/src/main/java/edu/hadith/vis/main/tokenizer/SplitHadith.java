package edu.hadith.vis.main.tokenizer;

/**
 * Created by mh4047 on 12/4/16.
 */
public class SplitHadith {
    private String narration;
    private String chain;
    private String hadithDelimiter;
    public SplitHadith(){

    }
    public SplitHadith(String narration, String chain){
        this.narration = narration; this.chain = chain;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public String getChain() {
        return chain;
    }

    public void setChain(String chain) {
        this.chain = chain;
    }

    public String getHadithDelimiter() {
        return hadithDelimiter;
    }

    public void setHadithDelimiter(String hadithDelimiter) {
        this.hadithDelimiter = hadithDelimiter;
    }

    public String toString(){
        return "narration:"+narration+"; chain:"+chain+"; hadithDelimiter:"+hadithDelimiter;
    }
}

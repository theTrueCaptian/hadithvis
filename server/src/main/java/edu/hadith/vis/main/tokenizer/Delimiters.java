package edu.hadith.vis.main.tokenizer;

import java.util.Arrays;
import java.util.List;

/**
 * Created by mh4047 on 12/5/16.
 */
public class Delimiters {
    private List<String> chainDelimiters;
    private List<String> hadithDelimiters;
    public Delimiters(){

    }
    public Delimiters(List<String> chainDelimiters, List<String> hadithDelimiters){
        this.chainDelimiters = chainDelimiters; this.hadithDelimiters = hadithDelimiters;
    }

    public List<String> getChainDelimiters() {
        return chainDelimiters;
    }

    public void setChainDelimiters(List<String> chainDelimiters) {
        this.chainDelimiters = chainDelimiters;
    }

    public List<String> getHadithDelimiters() {
        return hadithDelimiters;
    }

    public void setHadithDelimiters(List<String> hadithDelimiters) {
        this.hadithDelimiters = hadithDelimiters;
    }

    public String toString(){
        return "Delimiters(chain: "+ Arrays.toString(chainDelimiters.toArray())+", hadith:"+Arrays.toString(hadithDelimiters.toArray())+")";
    }
}

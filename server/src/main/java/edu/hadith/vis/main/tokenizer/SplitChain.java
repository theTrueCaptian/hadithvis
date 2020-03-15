package edu.hadith.vis.main.tokenizer;

import java.util.Arrays;
import java.util.List;

/**
 * Created by mh4047 on 12/4/16.
 */
public class SplitChain {
    private String type;
    private List<String> text;
    public SplitChain(){

    }
    public SplitChain(String type, List<String> text){
        this.type = type; this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getText() {
        return text;
    }

    public void setText(List<String> text) {
        this.text = text;
    }

    public String toString(){
        return "Split:\n\ttype:"+type+"\n\ttext:"+ Arrays.toString(text.toArray());
    }
}

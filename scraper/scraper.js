var fs = require('fs');
var xpath = require('xpath.js');
var parse5 = require('parse5');
var xmlser = require('xmlserializer');
var dom = require('xmldom').DOMParser;
var util = require("util"),
    http = require("http");
var jsesc = require('jsesc');
var cheerio = require('cheerio')

var options = {
    host: "sunnah.com",
    port: 80,
    path: ""
};

var hadiths = []

//Longest link (length of the longest sanad)
var max_sanad_length = 0;

var links = [
	{'book':'bukhari', 'st':1, 'end':3}//'end':97},
	//{'book':'muslim', 'st':1, 'end':56}, 
]

linkInd = 0
bookNum = links[linkInd].st
options.path = "/"+links[linkInd].book+"/"+bookNum
read(options)
//Iterate over books
/*for(var linkInd=0; linkInd<links.length; linkInd++){
	//Iterate over the different books(chapter) within a book
	for(var bookNum = links[linkInd].st; bookNum<=links[linkInd].end; bookNum++){
		options.path = "/"+links[linkInd].book+"/"+bookNum
		read(options)
	}
}*/
function read(options){
	var content = "";   

	var req = http.request(options, function(res) {
	    res.setEncoding("utf8");
	    res.on("data", function (chunk) {
	        content += chunk;
	    });

	    res.on("end", function () {
	        //util.log(content);
	        process_raw(content)

	        //read next
	        bookNum++;
	        //If no other chapters, move to the next book
	        if(bookNum>links[linkInd].end){
	        	linkInd++
	        	//if no other books
	        	if(linkInd>=links.length){
     		   		//write info to file
					writeToFile('hadith_raw/raw'+(new Date().getTime())+'.json', {'data':hadiths})

	        		//process the data to another format
	        		put_into_tree(hadiths, max_sanad_length)
	        		//make sure to retuen so no more links are parsed!
	        		return
	        	}
	        	bookNum = links[linkInd].st
	        }
	        options.path = "/"+links[linkInd].book+"/"+bookNum
			read(options)
	    });
	});

	req.end();
}

function process_raw (content) {
    //var document = parse5.parse(content.toString());
    //var xhtml = xmlser.serializeToString(document);
    //var doc = new dom().parseFromString(xhtml);
    //Test with xpath
    //util.log(document)
    //var select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
    /*content = jsesc(content);
    var doc = new dom().parseFromString(content) 
    var nodes = xpath("//span[@class='arabic_sanad arabic']/text()", doc);
    console.log('********************')
    console.log(nodes);*/
    
    //Grab all the hadiths
    //Regex only extracts all divs as one whole div :(
    //hadiths = content.match(/<div class=actualHadithContainer(.*|[\n\r\t\S\D\W]*)<!-- end actual hadith container -->/g)
    //Xpath module throws error
    //var hadiths = xpath("//div[@class='actualHadithContainer']/text()", content);
    var $ = cheerio.load(content)
    $("div[class='actualHadithContainer']").each(function(i, elem) {
		hadiths_list = $(this)
		hadithname = hadiths_list.find("span[class='sharelink']").attr('onclick')
		sanad = hadiths_list.find("div[class='arabic_hadith_full arabic']").text()
		sanad = process_sanad(sanad)
		hadiths.push({'hadithname':hadithname, 'sanad':sanad.Sanad, 'text':sanad.Text})
		
		console.log({'hadithname':hadithname, 'sanad':sanad})
	})


}

function process_sanad(wholehadith){

	//Split hadith and sanad
	// Gets the first index where the Prophet (Salalahualyhiwasalam) appears
	var index = wholehadith.indexOf("\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064a\u0647 \u0648\u0633\u0644\u0645");  
	var sanads = wholehadith.substr(0, index); // Gets the first part
	var text = wholehadith.substr(index + 1);  // Gets the text part

    //for(var h=0; h<hadiths.length; h++){
    	//console.log('**********************************')
    	//console.log(sanads)
    	//hadith_name = (content).match(/share\(.+\)/)
	    //sanads = []


	    //Get sanad from each hadith
	    //sanads = content.match(/<span class=\"arabic_sanad arabic\">(.+)<\/span>/g)

	    //for (var i=0; i<sanads.length; i++){
	    	sanads = sanads.replace(/<span class="arabic_sanad arabic">/g, '')
	    	sanads = sanads.replace(/<\/span>/g, '')
	    	//hadathuna
	    	sanads = sanads.replace(/\u062d\u064e\u062f\u0651\u064e\u062b\u064e\u0646\u064e\u0627/g, '')
	    	//hadathana
	    	sanads = sanads.replace(/\u062d\u064e\u062f\u064e\u0651\u062b\u064e\u0646\u064e\u0627/g, '')
	    	//a'n
	    	sanads = sanads.replace(/\u0639\u064e\u0646\u0652/g, '')
	    	//a'ni
	    	sanads = sanads.replace(/\u0639\u064e\u0646\u0650/g, '')
	    	//anna
	    	sanads = sanads.replace(/\u0623\u064e\u0646\u0651\u064e/g, '')
	    	//annahu
	    	sanads = sanads.replace(/\u0623\u064e\u0646\u064e\u0651\u0647\u064f/g, '')
	    	//qala
	    	sanads = sanads.replace(/\u0642\u064e\u0627\u0644\u064e/g, '')
	    	//qalat
	    	sanads = sanads.replace(/\u0642\u064e\u0627\u0644\u064e\u062a\u0652/g, '')
	    	//yaqul
	    	sanads = sanads.replace(/\u064a\u064e\u0642\u064f\u0648\u0644\u064f/g, '')
	    	//akhbarani
	    	sanads = sanads.replace(/\u0623\u064e\u062e\u0652\u0628\u064e\u0631\u064e\u0646\u0650\u064a/g, '')
	    	//akhbarana
	    	sanads = sanads.replace(/\u0623\u064e\u062e\u0652\u0628\u064e\u0631\u064e\u0646\u064e\u0627/g, '')
	    	//akhbarahu
	    	sanads = sanads.replace(/\u0623\u064e\u062e\u0652\u0628\u064e\u0631\u064e\u0647\u064f/g, '')
	    	//samia'a
	    	sanads = sanads.replace(/\u0633\u064e\u0645\u0650\u0639\u064e/g, '')
	    	//sami'tu
	    	sanads = sanads.replace(/\u0633\u064e\u0645\u0650\u0639\u0652\u062a\u064f/g, '')
	    	//radiyallaha'hn
	    	//sanads[i] = sanads[i].replace(/\u0640 \u0631\u0636\u0649 \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 \u0640/g, '')
	    	//radiyalla'hnha
	    	//sanads[i] = sanads[i].replace(/\u0640 \u0631\u0636\u0649 \u0627\u0644\u0644\u0647 \u0639\u0646\u0647\u0627 \u0640/g, '')
	    	//arabic dot
	    	sanads = sanads.replace(/\u200f\u200f\u002e\u200f/g, '')
	    	

	    	//tokenize
	    	//commas or radiyallaha'hn or radiyalla'hnha
	    	sanads = sanads.split(/\u060c|\u0640 \u0631\u0636\u0649 \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 \u0640|\u0640 \u0631\u0636\u0649 \u0627\u0644\u0644\u0647 \u0639\u0646\u0647\u0627 \u0640/)


	    	for(var j=0; j<sanads.length; j++){
	    		//extra spaces in the begining
	    		sanads[j] = sanads[j].replace(/^[\s]*/,'');

	    	}

	    	

	    //}
	    if(max_sanad_length<sanads.length){
	    	max_sanad_length=sanads.length
	    }
	    content = { 'Sanad':sanads, 'Text':wholehadith}
	    //console.log('********************************')
	    //console.log(sanads)

	    return content
	//}
}

//Transform the list of hadith info into a circular tree
function put_into_tree(hadith_list, max_sanad_length){
	//For each sanad form a link
	var circular_structure = {'name':0, 'children':[]}
	for(var h_num = 0; h_num<hadith_list.length; h_num++){
		var curr_hadith_sanad = hadith_list[h_num].sanad
		var chain_struct = null
		
		//Add the hadiths from the last person in the chain
		for(var s_num=0; s_num<curr_hadith_sanad.length; s_num++){

			//prepare the chain struct to add the next layer containing the next person
			//Add the previous person a child to the current person
			if (chain_struct!=null){
				chain_struct = {
					'name':curr_hadith_sanad[s_num], 
					'hadithname':hadith_list[h_num].hadithname,
					'text':hadith_list[h_num].text,
					'children':[chain_struct]
				}
			}else{
				chain_struct = {
					'name':curr_hadith_sanad[s_num], 
					'hadithname':hadith_list[h_num].hadithname,
					'text':hadith_list[h_num].text
				}
			}
		}

		//chain_struct.info = hadith_list[h_num]
		//chain_struct.name = hadith_list[h_num].hadithname
		//Add chain struct tothe circular_structure
		circular_structure.children.push(chain_struct)

	}

	console.log(circular_structure)

	writeToFile('json/circular_structure_'+(new Date().getTime())+'.json', circular_structure)
	//start by forming the inner most layer
/*
	var circular_structure = {'name':max_sanad_length-1, 'children':[]}
	for(var layer_num = 0; layer_num<max_sanad_length; layer_num++){

		//Add sanad folks at the layer_num'th chain
		for(var h_num = 0; h_num<hadith_list.length; h_num++){
			var curr_hadith = hadith_list[h_num]
			//First check if there is even a node at layer_num for the current hadith
			if(layer_num<curr_hadith.sanad.length){
				//If so add to circular_structure children
				circular_structure.children.push({'name':curr_hadith.sanad[layer_num]})
			}
		}

		//proceed to adding the next layer of the structure
	}*/

}



function writeToFile(filename, content){
	var jsonfile = require('jsonfile')
	 
	jsonfile.writeFileSync(filename, content)
	console.log("The file was saved: "+filename);
	/*fs.writeFile(filename, content, function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	}); */
}
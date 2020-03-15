
// Array of hadiths and array of delimiters.
// pDelimiters are the delimiters the separate hadith and chain
// Returns an array of tokenized hadiths e.g. [hadith, ...],
// where hadith = {hadith: "qul abu hurarirah qul aisha", narration: "narration", 'hadithDelimiter':'prophet name', split:[{type:token, text:qul}, ...]}
function tokenizeHadiths(allHadithTexts, delimiters, pDelimiters){
	var tokenizedHadiths = [];


	//Tokenize the hadith
	for(var i=0; i<allHadithTexts.length; i++){
		//Split into chain and narration
		var split = splitHadith(allHadithTexts[i].hadithText, pDelimiters);
		var splitChain = tokenizeChain(split.chain, delimiters);
		tokenizedHadiths.push({'hadith':allHadithTexts[i].hadithText,'hadithDelimiter':split.hadithDelimiter, 'narration':split.narration, 'chain':splitChain});
	}
	console.log(tokenizedHadiths);
	return tokenizedHadiths;

}

// Split a given hadith text into chain and narration
// pDelimiters are the delimiters the separate hadith and chain
// Return the split e.g. {'narration':"blah blah", 'chain':'blah blah', 'hadithDelimiter':'prophet name'}
function splitHadith(hadithText, pDelimiters){
	var split = {"narration":"", "chain":hadithText};
	for(var i=0; i<pDelimiters.length; i++){
		var arr = hadithText.split(pDelimiters[i]);

		//Check if anything is delimited
		if(arr.length>=2){
			split.chain = arr[0];

			split.hadithDelimiter = pDelimiters[i];
			var narration = arr.slice();
			narration.splice(0, 1);
			split.narration = narration.join("");
			console.log("Split:", split)
			break;
		}
	}
	return split;
}

// A hadith and an array of delimiters.
// e.g. "qul abu hurarirah qul aisha" ==> ["qul", "abu hurarirah", "qul", "aisha"] ==> [{type:token, text:qul}, ...]
function tokenizeChain(chain, delimiters){
	var splitHadith = [chain]; // Array containing words
	for(var i=0; i<delimiters.length; i++){
		var tokenizer = delimiters[i];			//e.g. qul
		var splitHadithCopy = splitHadith.slice();
		for(var j=0; j<splitHadithCopy.length; j++){

			var newSplits = splitHadithCopy[j].split(tokenizer);	//e.g. [abu hurarirah, aisha]

			// Re-Add the delimiters into the array e.g. [qul, abu hurarirah, qul , aisha]
			var arrayLength = newSplits.length;
			for(var k=0;k<arrayLength; k++){

				if(k==0 && splitHadithCopy[j].startsWith(tokenizer)){
					//If in the beginning there was no tokenizer, then don't add
					newSplits.splice(k, 0, tokenizer);
					k=k+1;
				}else if(k>0 && k<arrayLength){
					//For middle tokens
					newSplits.splice(k, 0, tokenizer);
					k=k+1;
				}
				//Update the length of the array
				arrayLength = newSplits.length;
			}
			if(_.endsWith(splitHadithCopy[j], tokenizer)){
				//If in the end of the string there was no tokenizer, then don't add
				newSplits.push(tokenizer);
			}


			//Replace the current item in newSplits with these new tokens in newSplits
			//Beginning array
			var begArr = splitHadithCopy.slice(0, j);
			//End of array
			var endArr = splitHadithCopy.slice(j+1);
			//Join beginning, new splits, and the end arrays
			splitHadithCopy = begArr.concat(newSplits);
			splitHadithCopy = splitHadithCopy.concat(endArr);


			//Reset j:
			j++;
		}

		splitHadith = splitHadithCopy;
	}

	//Group: ["qul", "abu hurarirah", "qul", "aisha"] ==> [{type:token, text:qul}, ...]
	var cleanSplit = [];
	var currentType = "";
	for(var i=0; i<splitHadith.length; i++){
		// A space is also tokenizer
		if(isStringInArray(splitHadith[i], delimiters.concat([" "]))){
			//Add a tokenizer
			if(currentType=="" || currentType=="text"){
				cleanSplit.push({'type':'tokenizer', 'text':[splitHadith[i]]});
			}else{
				cleanSplit[cleanSplit.length-1].text.push(splitHadith[i]);
			}
			currentType = 'tokenizer';
		}else{
			//Add a text (non tokenizer) type
			if(currentType=="" || currentType=="tokenizer"){
				cleanSplit.push({'type':'text', 'text':[splitHadith[i]]});
			}else{
				cleanSplit[cleanSplit.length-1].text.push(splitHadith[i]);
			}
			currentType = 'text';
		}
	}
	return cleanSplit;

}

function isStringInArray(str, arr){
	for(var k=0; k<arr.length; k++){
		if(arr[k]==str){
			return true;
		}
	}
	return false;
}

function extendStPoint(selectionSt, documentText){
	//Highlight a whole token
	//Check if the token behind the start pointer isn't a space
	var newSelectSt = selectionSt;
	while(
			(newSelectSt>0 && newSelectSt<documentText.length && (!isTokenChar(documentText.charAt(newSelectSt-1)) || newSelectSt==1)) 
		){
		newSelectSt--;
	}		
	return newSelectSt;
}

function extendEndPoint(selectionEnd, documentText){
	//Check if the token after the end pointer isn't a space or end of file
	while(
			(selectionEnd>=0 && selectionEnd<documentText.length-1 && (!isTokenChar(documentText.charAt(selectionEnd)) || selectionEnd==documentText.length-2)) 
		){
		selectionEnd++;
	}
	return selectionEnd;
}

//Returns true if it is space, etc
function isTokenChar(c){
	var tokenPattern = /[\s]+/;
	return tokenPattern.test(c);
}


function trimSurroundingSpace(input){
    var initInput = input;

    input = input.replace(/\r|\n/g, " ");
    // Replace beginning spaces and ending spaces with no text
    input = input.replace(/[\r\n\t\s]*/, "");       //Replace first instance
    input = input.replace(/[\r\n\t\s]*$/g, "");         //replace all instances
   
    var cleanInput = input;
    //startShift is the offset of the actual text without space e.g. old input = "  maeda" --> "maeda" --> startShift = 2
    return {'text': input, 'startShift':initInput.indexOf(cleanInput)};
}

function getUnique(inArr){
	return _.uniq(inArr);
}
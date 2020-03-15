/*

Maeda Hanafi
Hadith Controller loads hadiths from the server (sever.js) into tokenizationVisualization.html

Go to /tokenizationVisualization.html to see the page.
*/


var app = angular.module("hadithApp", []);
app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
app.controller("hadithController", function($scope, $http){
	
    $scope.HIGHLIGHTER_STATES = {
        'chainDelimiters':0,
        'tokens':1,
        'hadithDelimiters':2  //The delimiters that split the hadith into chain and narration
    };
    $scope.currentHighlighterMode = $scope.HIGHLIGHTER_STATES.chainDelimiters;

	$scope.allHadithTexts = [];
	$scope.chainDelimiters = [];
    $scope.hadithDelimiters = [];
    $scope.tokenizedTexts = [];
	$scope.narrators = [];
	
	var hadithObj = this;

	$scope.init = function(){
		//Request some hadiths from server and then load it into the textarea
		$http.get("/hadithTexts").then(function(response) {
			$scope.allHadithTexts = response.data;
			console.log($scope.allHadithTexts);

            // Get tokenizers
            $http.get("/tokens").then(function(res){

                $scope.chainDelimiters = getUnique(res.data.chainDelimiters);
                $scope.hadithDelimiters = getUnique(res.data.hadithDelimiters);

                console.log($scope.chainDelimiters);

                $scope.updateAll();
            });
		});
	};

    $scope.updateAll = function(){
        // Retokenize hadiths
        $scope.tokenizedTexts = tokenizeHadiths($scope.allHadithTexts, $scope.chainDelimiters, $scope.hadithDelimiters );
        //Draw all highlights
        hadithObj.highlightAll();
    };

	hadithObj.highlightAll = function() {
        // Repaint. 

        //Highlights all divs
        for(var i=0; i<$scope.chainDelimiters.length; i++){
            var word = $scope.chainDelimiters[i];
            $("div.hadithText").mark(word, {
                "element": "span",
                "className": "highlight"
            });
        }
    };

    hadithObj.saveTokens = function(){
        //Sends the token to server to save
        $http.post("/saveTokens", JSON.stringify({'chainDelimiters':$scope.chainDelimiters, 'hadithDelimiters':$scope.hadithDelimiters})).then(function(response) {
            console.log(response);
        });
    }


    $scope.setHighlighterMode = function(mode){
        //mode is some value corresponding to the highlighter states attributes
        $scope.currentHighlighterMode = mode;
    }

	$scope.removeToken = function(token, type){
	    console.log("To remove: "+token);
		/*for(var i=0; i<$scope.chainDelimiters.length; i++){
			if($scope.chainDelimiters[i]==token){
				$scope.chainDelimiters.splice(i, 1);
				break;
			}
		}*/
		if(type=='chainDelimiters'){
            _.remove($scope.chainDelimiters, function(i){return i==token});
        }else if(type=='hadithDelimiters'){
            _.remove($scope.hadithDelimiters, function(i){return i==token});
        }
        hadithObj.saveTokens();
        $scope.updateAll();
	};

    $scope.drawTokenizationHighlights = function(){
        // Get the selected text
        var selectedText = "";
        if (window.getSelection) {
            selectedText = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            selectedText = document.selection.createRange().text;
        }
       
        //Make sure that there is selected text
        if (selectedText != "" && !selectedText.match(/^[\n\s\r\t]+$/)) {
            //Clean the surrounding spaces around delimiter
            selectedText = _.replace(selectedText, /^[\n\r\t]+/, "");
            selectedText = _.replace(selectedText, /[\n\r\t]+$/, "");
            if($scope.currentHighlighterMode == $scope.HIGHLIGHTER_STATES.chainDelimiters){
                // Add a tokenizer
                $scope.chainDelimiters.push(selectedText);
                $scope.chainDelimiters = getUnique($scope.chainDelimiters);
                console.log($scope.chainDelimiters);
                //Sends the token to server to save
                hadithObj.saveTokens();
            }else if($scope.currentHighlighterMode == $scope.HIGHLIGHTER_STATES.hadithDelimiters){
                // Add a tokenizer
                $scope.hadithDelimiters.push(selectedText);
                $scope.hadithDelimiters = getUnique($scope.hadithDelimiters);
                console.log($scope.hadithDelimiters);
                hadithObj.saveTokens();
            }


        }
        $scope.updateAll();
    }


});
var theQuiz = (function(){

        
        var cPoints=0, pPoints = 0;
        var qTotal = 5;
        var currQuestion = 0;
        var currOponent = 0;
        var rndYearPick = 0;
        var rndPickC = [];


        var playerName = "Bart";
        var compAns = "";
        var playerAns = "";
        var answCorrect ="";
        
        var req = new XMLHttpRequest();
        var url; 
        var data = [];
        var characters = [];
        


        var loadQuiz = function(){

            var url = "simpsons.json"

            req.open("GET", url);
            req.send();
            req.onreadystatechange = function(){
                if(req.readyState==4 && req.status ==200 ){
                    data = JSON.parse(req.responseText);
                    
                    
                    $('.loaderTxt').text("Episodes Loaded, total: "+data.length);
                    $('.loader').fadeIn(1000).delay(1000).fadeOut(1000, function(){loadChars();});
                     
                    
                }else{

                    $('.loaderTxt').text("Loading Episodes ...");
                    $('.loader').fadeIn(200);          
                }
            }
        };


        var loadChars = function(){

            //load characters
            var url = "chars.json"

            req.open("GET", url);
            req.send();
            req.onreadystatechange = function(){
                if(req.readyState==4 && req.status ==200 ){
                    characters = JSON.parse(req.responseText);
                    
                    window.setTimeout(function(){
                    $('.loaderTxt').text("Opponents loaded");
                    $('.loader').fadeIn(1000).delay(3000).fadeOut(1000, function(){startGame();});
                    },1000);  
                    
                }else{

                    $('.loaderTxt').text("Loading Opponents ...");
                    $('.loader').fadeIn(200);          
                }
            }
        };

        var startGame = function(){

            //Empty variables
            $('.pPoints').text(pPoints);
            $('.cPoints').text(cPoints);

            $('.welcome').slideUp(500);

            $('.mainGame').slideDown();

            // Animate entrance Elements
            $('.computer').addClass("animated slideInLeft");
            $('.yearpick').addClass("animated slideInRight");
            $('.player').addClass("animated slideInLeft");

            window.setTimeout(function(){
                $('.computer').removeClass("animated slideInLeft");
                $('.yearpick').removeClass("animated slideInRight");
                $('.player').removeClass("animated slideInLeft");  
            },1000);

            $('.playerName').text(playerName);

            nextOponent();           

            nextQuestion();

        };


        var nextOponent = function(){

            oponentTotal = characters.length;

            if(currOponent<oponentTotal){

                $('.oponentPic').css({
                'background-image':"url(images/icons/"+characters[currOponent].filename
                    +")"
                });

                $('.oponentName').text(characters[currOponent].charname);

                currOponent ++;
            }else{
                currOponent = 0;
            }

        };

        var badges = function(action){

            if(action=="remove"){
             // Remove badge and text
                $('.answerBadge').hide();
                $('.answerBadge').text("Wrong!");
                $('.answerBadge').removeClass("rightAns animated flipInX");
            }else if(action=="show"){
                // show badges
                $('.answerBadge').show();
                $('.answerBadge').addClass("animated flipInX");
            }
        };

        var nextQuestion = function(){

            if(currQuestion == qTotal){
                endQuiz();
            }else{

                nextOponent();

                badges("remove");               

                //Re-enable buttons
                $('.btn-answer').prop('disabled', false);

                //Get any random year as a comparison year for Player and computer       
                rndYearPick = sliceYear(data[Math.floor(Math.random()*data.length)].airdate);
                $('.rndYear').text(rndYearPick);
               
                // Chose episode
                rndPickC = Math.floor(Math.random()*data.length);
                $('#compTitle').addClass("animated slideInLeft");
                $('#compTitle').text("Is The Episode: "+data[rndPickC].Title);
            }

        };


        var answer = function(){

            // Slice and get the true airdate for the episode selected
            var compYearAirdate = sliceYear(data[rndPickC].airdate);            
 
            compYearAirdate > rndYearPick ? answCorrect = "after" : answCorrect = "before";

            if(compAns == answCorrect){
                $('.computer .answerBadge').addClass("rightAns");
                $('.computer .answerBadge').text("Right!");
                cPoints ++;                
            }

            if(playerAns == answCorrect){
                $('.player .answerBadge').addClass("rightAns");
                $('.player .answerBadge').text("Right!");
                pPoints ++;
            }           

            // disable answer buttons
            $('.btn-answer').prop('disabled', true);

            badges("show");

            //Update points
            $('.pPoints').text(pPoints);
            $('.cPoints').text(cPoints);

            currQuestion ++;
            
            //Remove animated class from episode title
            $('#compTitle').removeClass("animated slideInLeft");

            window.setTimeout(function(){

                $('.cAnswer .btn-answer').removeClass("btChoice");
                $('.pAnswer .btn-answer').removeClass("btChoice");
                nextQuestion();
            },2000); 

        };

        var endQuiz = function(){


            $('.computer').addClass("animated slideOutLeft");
            $('.yearpick').addClass("animated slideOutRight");
            $('.player').addClass("animated slideOutLeft");

            $('.mainGame').fadeOut();
            $('.endQuiz').show();
            $('.endQuiz').addClass("animated slideInLeft");
            
            cPoints=0, pPoints = 0;
            currQuestion = 1;
            

        }


        var sliceYear = function(strYear){
            // Get the airdate string length to strip year
            var s = strYear.length;
            //strip year only
            var x=strYear.slice(-4,s);
            return x;
        };


        // Check Start button
        var startButton = function(){

            var name = $('.inputPlayer').val();
            if(!name == ""){
                playerName = name;
                $('.playerPic').css({
                'background-image':"url(images/icons/player_icon.png)"
                });
            } else{
                $('.playerPic').css({
                'background-image':"url(images/icons/Bart_icon.png)"
                });
            }
            loadQuiz();

        }

        var clickAnswer = function(answ){

            // set answers 
             
                $(this).addClass("btChoice");
                playerAns = answ;

                // computer answer choice
                var casw = Math.floor(Math.random()*2);
                if (casw) {
                    $('.cAnswer .btn-answer[data-asw="before"]').addClass("btChoice");
                    compAns = "before";
                }else{
                    $('.cAnswer .btn-answer[data-asw="after"]').addClass("btChoice");
                    compAns = "after";
                };

                answer();                      

        }

        var clickRestart = function(){
                $('.endQuiz').fadeOut();
                $('.computer').removeClass("animated slideOutLeft");
                $('.yearpick').removeClass("animated slideOutRight");
                $('.player').removeClass("animated slideOutLeft");

                startGame();
        }   


        // Constructor
        var self = {};

        // Public functions
        self.initialize = function(){
          startButton();
        };
        self.answer = function(answ){
            clickAnswer(answ);
        };
        self.restart = function(){
            clickRestart();
        }




        // Return
        return self;



})();        

        







        
        




    


     


        
        var cPoints=0, pPoints = 0;
        var qTotal = 24;
        var currQuestion = 0;
        var currOponent = 0;
        var rndYearPick = 0;
        var rndPickC, rndPickP = [];


        var playerName = "Bart";
        var compAns = "";
        var playerAns = "";
        
        var req = new XMLHttpRequest();
        var url; 
        var data = [];
        var characters = [];
        


        function loadQuiz(){

            var url = "simpsons.json"

            req.open("GET", url);
            req.send();
            req.onreadystatechange = function(){
                if(req.readyState==4 && req.status ==200 ){
                    data = JSON.parse(req.responseText);
                    
                    
                    $('.loaderTxt').text("Episodes Loaded, total: "+data.length);
                    $('.loader').fadeIn(1000).delay(1000).fadeOut(1000, function(){loadChars();});
                     
                    
                }
                else{

                    $('.loaderTxt').text("Loading Episodes ...");
                    $('.loader').fadeIn(200);          
                }
            };

        };


        function loadChars(){

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
                    
                }
                else{

                    $('.loaderTxt').text("Loading Opponents ...");
                    $('.loader').fadeIn(200);          
                }
            };



        };

        function nextOponent(){

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



        function nextQuestion(){

            if(currQuestion == qTotal){
                    endQuiz();
            }else{

            // Remove badge
            $('.answerBadge').hide();
            $('.answerBadge').removeClass("rightAns animated flipInX");

            //Re-enable buttons
                $('.btn-answer').prop('disabled', false);

            //Get any random year as a comparison year for Player and computer       
            rndYearPick = sliceYear(data[Math.floor(Math.random()*data.length)].airdate);
            console.log("rnd year="+ rndYearPick);           
            $('.ChosenYear').text("Year: "+ rndYearPick);
           


            // Chose episodes for Player and Computer
            rndPickC = Math.floor(Math.random()*data.length);
            rndPickP = Math.floor(Math.random()*data.length);

            $('#compTitle').text("Is The Episode: "+data[rndPickC].Title);
            $('#playerTitle').text("Is The Episode: "+data[rndPickP].Title);          

            
            }

        };

        
        /* set answers 
        $('.cAnswer .btn-answer').click(function(){
            $('.cAnswer .btn-answer').removeClass("btChoice");
            $(this).addClass("btChoice");
            compAns = $(this).data("asw");
            
        }); */

         $('.pAnswer > .btn-answer').click(function(){
            $('.pAnswer .btn-answer').removeClass("btChoice");
            $(this).addClass("btChoice");
            playerAns = $(this).data("asw");

            // computer answer choice
            var casw = Math.floor(Math.random()*2);
            if (casw) {
                $('.cAnswer .btn-answer').removeClass("btChoice");
                $('.cAnswer .btn-answer[data-asw="before"]').addClass("btChoice");
                compAns = "before";
            }else{
                $('.cAnswer .btn-answer').removeClass("btChoice");
                $('.cAnswer .btn-answer[data-asw="after"]').addClass("btChoice");
                compAns = "after";
            };

            answer();
            
        });


        function answer(){

            var compYearAirdate = sliceYear(data[rndPickC].airdate);
            var playerYearAirdate = sliceYear(data[rndPickP].airdate);

            console.log(compYearAirdate);

            
            compYearAirdate > rndYearPick ? compCorrect = "after" : compCorrect = "before";

            if(compAns == compCorrect){
                $('.computer .answerBadge').addClass("rightAns");
                cPoints ++;                
            }

            playerYearAirdate > rndYearPick ? playerCorrect = "after" : playerCorrect = "before";

            if(playerAns == playerCorrect){
                $('.player .answerBadge').addClass("rightAns");
                pPoints ++;
            }
           

            // disable answer buttons
                $('.btn-answer').prop('disabled', true);

            // show badges
            $('.answerBadge').show();
            $('.answerBadge').addClass("animated flipInX");


            $('.pPoints').text(pPoints);
            $('.cPoints').text(cPoints);

            currQuestion ++;
            
            window.setTimeout(function(){

                    $('.cAnswer .btn-answer').removeClass("btChoice");
                    $('.pAnswer .btn-answer').removeClass("btChoice");
                    nextOponent();
                    nextQuestion();
                },2000); 

           


        };

        function endQuiz(){

            $('.mainGame').fadeOut();
            $('.endQuiz').slideDown();
            
            cPoints=0, pPoints = 0;
            currQuestion = 1;
            currOponent = 0;

        }


        function sliceYear(strYear){
            // Get the airdate string length to strip year
            var s = strYear.length;
            //strip year only
            var x=strYear.slice(-4,s);
            return x;
        };



        // Check Start button
        $('#start').click(function(){
            
            
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

        });

        // Check Restart
        $('#reStart').click(function(){
            
            $('.endQuiz').fadeOut();

            startGame();
        })

        function startGame(){

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

        }







        
        




    


     
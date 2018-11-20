"use strict";
// **********************************************************************************
// ********************************* Code Principal *********************************
// **********************************************************************************

/**
 *  Installation d'un écouteur d'évènement qui sera déclenché
 *  quand le DOM sera totalement construit par le navigateur
 */
document.addEventListener('DOMContentLoaded', function() {
    // **********************************************************************************
// ***************************** Déclarations Variables *****************************
// **********************************************************************************
    var canvas ; // pour le canvas
    var ctx ; // pour le context du canvas
    var blockSize = 30; // block d'un élément du serpent de 30 px
    var delay = 100 ; // délai de rafraichissement du canvas (en ms)
    var snake; // variable pour le serpent
    var apple; // variable pour la pomme
    var score; // variable pour le score du jeu
    var timeout;



// **********************************************************************************
// ********************************* Exploitation ***********************************
// **********************************************************************************
    // évènement pour les touches du clavier
    document.onkeydown = function handleKeyDown(event){
        var key = event.keyCode; //récupère le code de la touche appuyé par l'utilisateur
        var newDirection ; // variable pour la nouvelle direction

        switch(key){
            case 37: // flèche gauche
                newDirection = "left";
                break;
            case 38: // flèche haut
                newDirection = "up";
                break;
            case 39: // flèche droite
                newDirection = "right";
                break;
            case 40: // flèche bas
                newDirection = "down";
                break
            case 13 : // touche entree
            case 32 : // touche espace
                restartGame();
                return; // arrete l'exécution de la fonction
            default:
                return; // on arrête la fonction si une touche permisses n'est pas bonnes
        }
        snake.setDirection(newDirection);
    };


    // fonction pour dessiner les blocks du serpent
    function dessinerBlock(ctx, position){
        var x = position[0] * blockSize; // permet de récupérer les coordonnées x en pixels du block à tracer
        var y = position[1] * blockSize; // permet de récupérer les coordonnées y en pixels du block à tracer
        ctx.fillRect(x,y,blockSize,blockSize); // dessine le serpent en fonction du nombre d'éléments dans l'array
    }

    // fonction prototype du serpent
    function Snake(body, direction){
        this.body = body; // récupération du corps du serpent
        this.direction = direction; // permet de donner la direction du serpent
        this.mangeApple = false ; // permet de savoir sil a mangé une pomme

        // fonction pour dessiner le serpent
        this.dessinerSnake = function(){
            ctx.save(); // sauvegarde le context du canvas
            ctx.fillStyle = "#134913"; // couleur de remplissage dans le canvas du trait
            for(var i=0; i<this.body.length; i++){
                dessinerBlock(ctx, this.body[i]) ;// permet de dessiner un block
            }
            ctx.restore();// garde le context comme il était avant
        };

        // fonction pour faire avancer le serpent
        this.avancerSnake = function(){
            var newPosition = this.body[0].slice(); // on copie l'élément de la tête
            switch(this.direction){
                case "left":
                    newPosition[0]--; // on diminue la position du x de 1
                    break;
                case "right":
                    newPosition[0]++; // on augmente la position du x de 1
                    break;
                case "up":
                    newPosition[1]--; // on diminue la position du y de 1
                    break;
                case "down":
                    newPosition[1]++; // on augmente la position du y de 1
                    break;
                default:
                    throw("direction invalide"); // permet d'afficher un défaut à l'écran
            }
            this.body.unshift(newPosition); // permet de rajouter la nouvelle position à la première place du tableau array
            if(!this.mangeApple ){
                this.body.pop(); // on supprime la dernière position du tableau array
            }else{
                this.mangeApple = false;
            }
        };

        //fonction qui permet d'avoir la nouvelle direction du serpent
        this.setDirection = function(newDirection){
            var permiseDirection ; // directions permisses en fonction de la direction actuelle
            switch(this.direction){
                case "left":
                case "right":
                    permiseDirection = ["up", "down"];
                    break;
                case "up":
                case "down":
                    permiseDirection = ["left", "right"];
                    break;
                default:
                    throw("direction invalide"); // permet d'afficher un défaut à l'écran
            }
            if(permiseDirection.indexOf(newDirection) >-1){ // direction permisse retourne l'index de permiseDirection
                this.direction = newDirection;
            }
        };

        // fonction qui vérifie si le serpent n'entre pas en collision sur lui même ou sur les murs du canvas
        this.checkCollision = function(){
            var murCollision = false ; // variable pour checker la collision sur un mur
            var snakeCollision = false; // variable pour checker la collision sur lui même
            var headSnake =  this.body[0];// tête du serpent pour voir si le serpent est entré en collision
            var restSnake = this.body.slice(1); // permet de récupèrer tout les blocks du serpent sauf la tête
            var xHead = headSnake[0]; // coordonnée x de la tête du serpent
            var yHead = headSnake[1]; // coordonnée y de la tête du serpent
            var minX = 0;
            var minY = 0;
            var maxX = (canvas.width / blockSize) - 1;
            var maxY = (canvas.height / blockSize) - 1;
            var isNotBetweenHorizontalMur = xHead < minX || xHead > maxX ; // variable pour savoir si la tête est entre les murs horizontales
            var isNotBetweenVerticalMur = yHead < minY || yHead > maxY ; // variable pour savoir si la tête est entre les murs verticaux

            // test de la collision sur les murs
            if(isNotBetweenHorizontalMur || isNotBetweenVerticalMur ){
                murCollision = true; // collision sur le mur
            }

            // test de la collision sur le reste du corps du serpent
            for(var i = 0; i< restSnake.length ; i++){
                // on vérifie si la tête du serpent ne passe pas sur un des blocks du reste du serpent
                if (xHead === restSnake[i][0] && yHead === restSnake[i][1]){ // on vérifie si meme x et meme y
                    snakeCollision = true; // collision du serpent sur le corps
            }
            // on retourne soit la collision sur le mur ou soit sur la collision du serpent sur le reste du corps
                return murCollision || snakeCollision;
        };
    }
        this.eatApple = function(appleToEat){
                var headSnake = this.body[0];

                if (headSnake[0] === appleToEat.position[0] && headSnake[1] === appleToEat.position[1]) { // vérification des coordonnées de la tête du serpent avec les coordonnées de la pomme
                    return true;
                }else{
                    return false;
                };
        };
    }

    // fonction prototype de la pomme
    function Apple(position){
        this.position = position; // récupère la position de la pomme

        // fonction pour dessiner la pomme
        this.dessinerApple = function (){
            ctx.save(); // sauvegarde le context du canvas
            ctx.fillStyle = "#D60000";
            ctx.beginPath();
            var radius = blockSize/2; // rayon de la pomme
            var xApple = this.position[0]*blockSize + radius; // on obtient le x de la position de la pomme
            var yApple = this.position[1]*blockSize + radius; // on obtient le y de la position de la pomme
            ctx.arc(xApple,yApple, radius, 0 , Math.PI*2, true);// on dessine le cercle
            ctx.fill();
            ctx.restore(); // garde le context comme il était avant
        };

        // donne une nouvelle position à une pomme
        this.setNewPosition = function(){
            var newXApple = Math.round(Math.random()*((canvas.width / blockSize)- 1 ));
            var newYApple = Math.round(Math.random()*((canvas.height / blockSize) - 1 ));
            this.position = [newXApple, newYApple] ; // coordonnées d'une nouvelle position de la pomme
        };

        // permet de vérifier si la pomme se trouve sur le serpent
        this.onSnake = function(checkSnake){
            var onSnake = false;// variable pour savoir si la pomme est sur le serpent

            for (var i=0; i< checkSnake.body.length; i++){
                // on vérifie que les coordonnées de la pomme ne sont pas identiques à une coordonnées du corps du serpent
                if(this.position[0]=== checkSnake.body[i][0] && this.position[1]=== checkSnake.body[i][1]){
                    onSnake = true;
                }
            }
            return onSnake;
        };
    }

    // fonction de rafraichissement du canvas
    function rafraichirCanvas(){
        snake.avancerSnake(); // on fait avancer le serpent
        if(snake.checkCollision()) {// on vérifie si collision ou pas
            gameOver();
        }else {

            if(snake.eatApple(apple)){
                score += 10;
                snake.mangeApple = true;
                // le serpent a mangé la pomme
                do{
                    apple.setNewPosition(); // change la position de la pomme
                }while(apple.onSnake(snake));



            }
            // ctx.fillStyle = "#1aff77"; // couleur de remplissage dans le canvas du trait
            ctx.clearRect(0, 0, canvas.width, canvas.height); // on efface tout le canvas
            // ctx.fillRect(xCoord,yCoord,30,30); // rectangle de départ du serpent
            snake.dessinerSnake(); // on dessine le serpent
            apple.dessinerApple(); // on dessine la pomme
            drawScore();
            timeout = setTimeout(rafraichirCanvas, delay); //fonction pour relancer le rafraichissement du canvas
        }
    }

    // fonction pour la gestion du game over
    function gameOver(){
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = "15px Verdana";
        ctx.fillText("GAME OVER", 5,15);
        ctx.fillText("APPUYER SUR LA TOUCHE ENTREE OU ESPACE POUR REJOUER", 5,40);
        ctx.restore();

    }

    // fonction pour redémarer le jeu
    function restartGame(){
        snake = new Snake([[6,4],[5,4],[4,4]], "right"); // on crée le serpent
        apple = new Apple([10,10]); // on crée la pomme
        score = 0;
        clearTimeout(timeout);
        rafraichirCanvas();
    }

    // fonction pour afficher le score
    function drawScore(){
        ctx.save();
        ctx.font = "15px Verdana";
        ctx.fillText("SCORE",canvas.width -70,20);
        ctx.fillText(score.toString(),canvas.width -30, 40 );
        ctx.restore();
    }




    // fonction d'initialisation du programme
    function init() {

        canvas = document.getElementById('canvasSnake');
        ctx = canvas.getContext('2d'); // choix du dessin dans le canvas
        snake = new Snake([[6,4],[5,4],[4,4]], "right"); // on crée le serpent
        apple = new Apple([10,10]); // on crée la pomme
        score = 0;
        rafraichirCanvas();
    }

    // appel de la fonction d'initialisation du programme
    init();
});
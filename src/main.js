/*
Name: Jackie Huang
Title: Rocket Patrol Revamped
Time: 15 hours

--List of mods--
1-point tier:
    - Track a high score that persists across scenes and display it in the UI (1)
    - Implement the 'FIRE' UI text from the original game (1)
    - Add your own (copyright-free) looping background music to the Play scene (1)
    - Allow the player to control the Rocket after it's fired (1)
    - Implement the speed increase that happens after 30 seconds in the original game (1)

3-point tier: 
    - Create 4 new explosion sound effects and randomize which one plays on impact (3)
    - Implement parallax scrolling for the background (3)
    - Display the time remaining (in seconds) on the screen (3)

5-point tier:
    - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)


Sources cited:
    - arrow function
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

    - setting up the timer
    https://rexrainbow.github.io/phaser3-rex-notes/docs/site/timer/



*/



let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
} 

let game = new Phaser.Game(config);
let scoreConfig;
let highScore = 0;
let currentScore;
// let timeTotal;
// let timeRemain;

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
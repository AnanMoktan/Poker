"use strict";
// Define the deck of cards
var scores = localStorage.getItem("score");
// Save the default value of the input element
var defaultValue = parseInt($("#bet_amount").val());
var betamt;

const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace",
];
let DECK = [];
var hand = [];

/** //CHECK OF rOYAL FLUSH
const hand = [{rank:"Ace",suit:"clubs"},
            {rank:"King", suit:"clubs"},
            {rank:"Queen", suit:"clubs"},
            {rank:"Jack", suit:"clubs"},
            {rank:"10", suit:"clubs"}];**/

// Define the function to create the deck
function createDeck() {
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      DECK.push({ rank, suit });
    }
  }
}

// Define the function to shuffle the deck
function shuffleDeck() {
  for (let i = DECK.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [DECK[i], DECK[j]] = [DECK[j], DECK[i]];
  }
}

// Define the function to deal a hand
function dealHand() {
  let newcards = [];
  for (let index = 0; index < 5; index++) {
    newcards[index] = DECK[index];
  }
  return newcards;
}
//animate function
function anim() {
  $("#yourcards img").css("left", "-100%");

  // Animate each image to slide from left to right
  $("#yourcards img").each(function (index) {
    $(this)
      .delay(250 * index)
      .animate({ left: "0" }, 1000);
  });
}

// Define the function to evaluate the hand
function evaluateHand(hand) {
  const ranks = hand.map((card) => card.rank);
  const suits = hand.map((card) => card.suit);
  if (
    new Set(suits).size === 1 &&
    ranks.includes("10") &&
    ranks.includes("Jack") &&
    ranks.includes("Queen") &&
    ranks.includes("King") &&
    ranks.includes("Ace")
  ) {
    scores += 10 * betamt;
    $("#data_table tr:eq(1)").addClass("bg-warning");
    return "Royal Flush";
  }
  if (
    new Set(suits).size === 1 &&
    ranks.every((rank) => RANKS.indexOf(rank) !== -1) &&
    Math.max(...ranks.map((rank) => RANKS.indexOf(rank))) -
      Math.min(...ranks.map((rank) => RANKS.indexOf(rank))) ===
      4 &&
    new Set(ranks).size === 5||
    ranks.includes("5") &&
    ranks.includes("4") &&
    ranks.includes("3") &&
    ranks.includes("2") &&
    ranks.includes("Ace")&& new Set(suits).size === 1 
  ) {
    $("#data_table tr:eq(2)").addClass("bg-warning");
    scores += 5 * betamt + 5 * betamt;
    return "Straight Flush";
  }
  if (
    new Set(ranks).size === 2 &&
    (ranks.filter((rank) => ranks.indexOf(rank) === 0).length === 1 ||
      ranks.filter((rank) => ranks.indexOf(rank) === 4).length === 1)
  ) {
    $("#data_table tr:eq(3)").addClass("bg-warning");
    scores += 8 * betamt;
    return "Four of a Kind";
  }
  if (new Set(ranks).size === 2) {
    $("#data_table tr:eq(4)").addClass("bg-warning");
    scores += 7 * betamt;
    return "Full House";
  }
  if (new Set(suits).size === 1) {
    $("#data_table tr:eq(5)").addClass("bg-warning");
    scores += 5 * betamt;
    return "Flush";
  }
  /**test value ranks = ['2','4','4','5','6']; false i.e result passed**/
  if (
    ranks.every((rank) => RANKS.indexOf(rank) !== -1) &&
    Math.max(...ranks.map((rank) => RANKS.indexOf(rank))) -
      Math.min(...ranks.map((rank) => RANKS.indexOf(rank))) ===
      4 &&
    new Set(ranks).size === 5||
    ranks.includes("5") &&
    ranks.includes("4") &&
    ranks.includes("3") &&
    ranks.includes("2") &&
    ranks.includes("Ace")
  ) {
    $("#data_table tr:eq(6)").addClass("bg-warning");
    scores += 5 * betamt;
    return "Straight";
  }
  if (
    new Set(ranks).size === 3 &&
    ranks.some((rank) => ranks.filter((r) => r === rank).length === 3)
  ) {
    $("#data_table tr:eq(7)").addClass("bg-warning");
    scores += 3 * betamt;
    return "Three of a Kind";
  }
  if (new Set(ranks).size === 3) {
    $("#data_table tr:eq(8)").addClass("bg-warning");
    scores += 2 * betamt;
    return "Two Pairs";
  }
  if (new Set(ranks).size === 4) {
    $("#data_table tr:eq(9)").addClass("bg-warning");
    scores += 1 * betamt;
    return "One Pair";
  }

  return "High Card";
}


$(document).ready(() => {
  if (typeof Storage !== "undefined") {
    // Retrieve the saved score from local storage

    if (scores !== null) {
      if (scores == 0 || scores < 0) {
        $("#gamestatus").text("game over please press reset to play again");
      }
      scores = localStorage.getItem("score");
      // Update the score display with the saved score
      $("#score").text("Score:" + scores);
    } else {
      scores = 100;
      localStorage.setItem("score", scores);
      $("#score").text("Score:" + scores);
    }
  }

  createDeck();
  shuffleDeck();
  hand = dealHand();

  /**hand = [{rank:"Ace",suit:"clubs"},
     {rank:"3", suit:"clubs"},
     {rank:"3", suit:"spades"},
     {rank:"3", suit:"diamonds"},
     {rank:"3", suit:"hearts"}];  //test hand*/
  for (let index = 0; index < hand.length; index++) {
    if (index < 2) {
      let cardimg = document.createElement("img");
      cardimg.src = "img/" + hand[index].rank + "-" + hand[index].suit + ".png";

      $("#yourcards").append(cardimg);
    } else {
      let cardimg = document.createElement("img");
      cardimg.src = "img/53.png";

      $("#yourcards").append(cardimg);
    }
  }
  anim();
  $("#switch").click(() => {
    //toogle
    if ($("#switch h3").text() === "Bet") {
      betamt = parseInt($("#bet_amount").val());

      if (isNaN(betamt)) {
        alert("Please enter only number.");
        betamt = 0;
        location.reload();
      }
      if (betamt < 0 || betamt > scores || betamt > 10) {
        alert("you entered invalid amount please re-enter");
        betamt = 0;
        location.reload();
      }
      scores -= betamt;
      console.log("Your hand is:", hand);
      console.log("Your hand evaluation is:", evaluateHand(hand));
      console.log(betamt);
      console.log(scores);
      localStorage.setItem("score", scores);
      $("#yourcards").empty();

      for (let index = 0; index < hand.length; index++) {
        if (index < 5) {
          let cardimg = document.createElement("img");
          cardimg.src = "img/" + hand[index].rank + "-" + hand[index].suit + ".png";
    
          $("#yourcards").append(cardimg);
        } else {
          var newDiv = $('<div>').addClass('cards')


// Create a new image element with the specified source and alt text
var newImgf = $('<img>').attr('src', 'img/53.png').attr('alt', 'cardfront').attr('class','front');

// Append the new image to the new div

newDiv.append(newImgf);




// Create a new image element with the specified source and alt text
let cardimg = document.createElement("img");
cardimg.src = "img/" + hand[index].rank + "-" + hand[index].suit + ".png";
cardimg.classList.add("back");
// Append the new image to the new div

newDiv.append(cardimg);

// Append the new div to an existing element with ID 'myContainer'
$('#yourcards').append(newDiv);
          
        }
      }
      
      $(".cards").flip();
      
        $("#gamestatus").text("please click card to see");
      
      
      $("#score").text("Score:" + scores);
      $("#switch h3").text("Next Game");

    } else {
      /*$("#yourcards").empty();
      $('#bet_amount').val(defaultValue);
    
    // Set the initial position of the image

shuffleDeck();
hand= dealHand();
for (let index = 0; index < hand.length; index++) {
  if(index<2){
   let cardimg = document.createElement("img");
   cardimg.src ="img/" + hand[index].rank + "-" + hand[index].suit +".png";
 
   $("#yourcards").append(cardimg);
   
  }else{
   let cardimg = document.createElement("img");
   cardimg.src ="img/53.png";
 
   $("#yourcards").append(cardimg);
  }
   
   
 }*/
 $("#gamestatus").text("");
      location.reload();
      $("#switch h3").text("Bet");
      //animate
      //anim();
      
    }
  });
  $("#reset").click(() => {
    $("#gamestatus").text("");
    localStorage.removeItem("score");
    location.reload();
  });
});

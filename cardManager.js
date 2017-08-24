"use latest";

module.exports = (function()
{
   
   let cards = [];

   return {

       createCard : function(cardName, cardValue){

         cards.push({cardName: cardName, cardValue: cardValue});
       },
       getCards: function(){

           return cards;
       }
   };
})();
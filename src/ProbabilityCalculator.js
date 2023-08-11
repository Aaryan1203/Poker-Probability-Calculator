const Calculator = require("poker-odds-machine").Calculator;

const calculateProbabilities = (playerCards, communityCards) => {
  if (!playerCards || playerCards.length === 0) {
    return {
      win: 0,
      tie: 0,
    };
  }

  if (!communityCards) {
    communityCards = [];
  }

  const transformedPlayerCards = playerCards.map((playerHand) => {
    return playerHand.map((card) => transformCard(card)).join(",");
  });

  const transformedCommunityCards = communityCards
    .map((card) => transformCard(card))
    .join(",")
    .trim()
    .replace(/,+$/, "");
    
  const input = {
    hands: transformedPlayerCards,
    numPlayers: playerCards.length,
    board: transformedCommunityCards,
    boardSize: 5,
    handSize: playerCards[0].length,
    numDecks: 1,
    returnHandStats: true,
    returnTieHandStats: true,
    iterations: 10000,
  };

  const c = new Calculator(input);
  const simulationResults = c.simulate();

  return transformedPlayerCards.map((cardCombo) => ({
    win: simulationResults[cardCombo].winPercent,
    tie: simulationResults[cardCombo].tiePercent,
  }));
};

export default calculateProbabilities;

function transformCard(card) {
  if (!card || card.cardName === null) {
    return;
  }
  let cardName = card.cardName;

  let cardSuit;
  switch (card.cardSuit) {
    case "spade":
      cardSuit = "s";
      break;
    case "heart":
      cardSuit = "h";
      break;
    case "club":
      cardSuit = "c";
      break;
    case "diamond":
      cardSuit = "d";
      break;
    default:
      throw new Error("Invalid card suit");
  }

  return cardName + cardSuit;
}

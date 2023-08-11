import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import "./App.css";
import hearts from "./images/hearts.png";
import diamonds from "./images/diamonds.png";
import clubs from "./images/clubs.png";
import spades from "./images/spades.png";
import React, { useState } from "react";
import calculateProbabilities from "./ProbabilityCalculator";
import Chatbot from "./Chatbot";

function Card({ className, onClick, cardDetails }) {
  if (!cardDetails || !cardDetails.cardSuit) {
    return <div className={`card ${className}`} onClick={onClick}></div>;
  }

  let suitImage;

  switch (cardDetails.cardSuit) {
    case "spade":
      suitImage = spades;
      break;
    case "heart":
      suitImage = hearts;
      break;
    case "club":
      suitImage = clubs;
      break;
    case "diamond":
      suitImage = diamonds;
      break;
    default:
      suitImage = "";
      break;
  }

  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{ backgroundColor: "white" }}
    >
      {cardDetails && (
        <>
          <span style={{ paddingLeft: "4px" }}>{cardDetails.cardName}</span>
          <img src={suitImage} alt="suit" className="suit-image" />
        </>
      )}
    </div>
  );
}

function DeckCard({
  cardNumber,
  cardName,
  cardSuit,
  selectedCard,
  setSelectedCard,
  usedDeckCards,
  setUsedDeckCards,
  setPlayerCards,
  communityCards,
  setCommunityCards,
  playerCards,
}) {
  let suitImage;

  switch (cardSuit) {
    case "spade":
      suitImage = spades;
      break;
    case "heart":
      suitImage = hearts;
      break;
    case "club":
      suitImage = clubs;
      break;
    case "diamond":
      suitImage = diamonds;
      break;
    default:
      break;
  }

  return (
    <div
      className={`deck-card deck-card-${cardNumber} ${
        selectedCard.type === "deck" && selectedCard.cardNumber === cardNumber
          ? "selected-card"
          : ""
      } ${usedDeckCards.has(cardNumber) ? "used-deck-card" : ""}`}
      onClick={() => {
        if (usedDeckCards.has(cardNumber)) {
          return;
        }
        if (selectedCard.type === "player") {
          const newPlayerCards = [...playerCards];
          const replacedCard =
            newPlayerCards[selectedCard.playerIndex][selectedCard.cardIndex];
          newPlayerCards[selectedCard.playerIndex][selectedCard.cardIndex] = {
            cardNumber: cardNumber,
            cardName: cardName,
            cardSuit: cardSuit,
          };
          setPlayerCards(newPlayerCards); // This line updates the playerCards state

          setUsedDeckCards((prevUsedDeckCards) => {
            const newUsedDeckCards = new Set(prevUsedDeckCards);
            if (replacedCard) {
              newUsedDeckCards.delete(replacedCard.cardNumber);
            }
            newUsedDeckCards.add(cardNumber);
            return newUsedDeckCards;
          });
          setSelectedCard({});
        } else if (selectedCard.type === "community") {
          const newCommunityCards = [...communityCards];
          const replacedCard = newCommunityCards[selectedCard.cardIndex];
          newCommunityCards[selectedCard.cardIndex] = {
            cardNumber: cardNumber,
            cardName: cardName,
            cardSuit: cardSuit,
          };
          setSelectedCard({});
          setUsedDeckCards((prevUsedDeckCards) => {
            const newUsedDeckCards = new Set(prevUsedDeckCards);
            if (replacedCard) {
              newUsedDeckCards.delete(replacedCard.cardNumber);
            }
            newUsedDeckCards.add(cardNumber);
            return newUsedDeckCards;
          });
          setCommunityCards(newCommunityCards);
        }
      }}
    >
      <span style={{ paddingLeft: "4px" }}>{cardName}</span>
      <img src={suitImage} alt="suit" className="suit-image" />
    </div>
  );
}

function Deck({
  selectedCard,
  setSelectedCard,
  usedDeckCards,
  setUsedDeckCards,
  communityCards,
  playerCards,
  setPlayerCards,
  setCommunityCards,
}) {
  const cardSuits = ["spade", "heart", "club", "diamond"];
  const cardRanks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
  ];

  const deckGroups = cardSuits.map((suit, groupIndex) => {
    return (
      <div key={groupIndex} className="deck-group">
        {new Array(13).fill(null).map((_, cardIndex) => {
          const totalCardIndex = groupIndex * 13 + cardIndex;

          return (
            <DeckCard
              key={cardIndex}
              cardNumber={totalCardIndex + 1}
              cardName={`${cardRanks[cardIndex]}`}
              cardSuit={suit}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              usedDeckCards={usedDeckCards}
              setUsedDeckCards={setUsedDeckCards}
              communityCards={communityCards}
              playerCards={playerCards}
              setPlayerCards={setPlayerCards}
              setCommunityCards={setCommunityCards}
            />
          );
        })}
      </div>
    );
  });

  return <div className="deck">{deckGroups}</div>;
}

function Player({
  playerNumber,
  numCards,
  numPlayers,
  selectedCard,
  setSelectedCard,
  playerCards,
  probability,
}) {
  const [isActive, setIsActive] = useState(playerNumber <= 2);
  const cards = playerCards[playerNumber - 1];
  const cardOpacity = isActive ? 1 : 0.5;
  const addPlayerButton = isActive ? "-" : "+";
  const activeCardClass = isActive ? "active-card" : "non-active-card";

  let playerClass = "";
  switch (numPlayers) {
    case 6:
      playerClass = "player-6";
      break;
    case 8:
      playerClass = "player-8";
      break;
    default:
      playerClass = "player-default";
  }

  return (
    <div className={`player ${playerClass}`}>
      <div className="player-button">
        <h2>{playerNumber === 1 ? "My cards" : `Player ${playerNumber}`}</h2>
        {playerNumber !== 1 && playerNumber !== 2 && (
          <button
            onClick={() => setIsActive(!isActive)}
            className="add-player-button"
          >
            {addPlayerButton}
          </button>
        )}
      </div>
      <div className="cards" style={{ opacity: cardOpacity }}>
        {cards.map((_, index) => (
          <Card
            key={index}
            className={`${activeCardClass} ${
              selectedCard.type === "player" &&
              selectedCard.playerIndex === playerNumber - 1 &&
              selectedCard.cardIndex === index
                ? "selected-card"
                : ""
            }`}
            onClick={() => {
              if (isActive) {
                setSelectedCard((prevSelectedCard) => ({
                  type: "player",
                  playerIndex: playerNumber - 1,
                  cardIndex: index,
                  cardDetails: prevSelectedCard.cardDetails,
                }));
              }
            }}
            cardDetails={cards[index]}
          />
        ))}
      </div>
      <div className="probability">
        <div>Win: {(probability.win || 0).toFixed(2)}%</div>
        <div>Tie: {(probability.tie || 0).toFixed(2)}%</div>
      </div>
    </div>
  );
}

function CommunityCard({
  index,
  selectedCard,
  setSelectedCard,
  communityCards,
}) {
  const isPreviousCardFilled = (i) => {
    for (let j = 0; j < i; j++) {
      if (!communityCards[j]) return false;
    }
    return true;
  };

  if (!communityCards[index]) {
    return (
      <div
        className={`community-card ${
          selectedCard?.type === "community" &&
          selectedCard?.cardIndex === index
            ? "selected-card"
            : ""
        }`}
        onClick={() => {
          if (isPreviousCardFilled(index)) {
            setSelectedCard({
              type: "community",
              cardIndex: index,
            });
          }
        }}
      />
    );
  }

  const cardDetails = communityCards[index];
  const suitImage =
    cardDetails && cardDetails.cardSuit ? getImage(cardDetails.cardSuit) : "";

  return (
    <div
      className={`community-card ${
        selectedCard.type === "community" && selectedCard?.cardIndex === index
          ? "selected-card"
          : ""
      }`}
      onClick={() => {
        setSelectedCard({
          type: "community",
          cardIndex: index,
          cardDetails: cardDetails,
        });
      }}
      style={{ background: "white" }}
    >
      <span style={{ paddingLeft: "6px" }}>
        {cardDetails ? cardDetails.cardName : ""}
      </span>
      <img src={suitImage} alt="suit" className="community-suit-image" />
    </div>
  );
}

function getImage(suit) {
  switch (suit) {
    case "spade":
      return spades;
    case "heart":
      return hearts;
    case "club":
      return clubs;
    case "diamond":
      return diamonds;
    default:
      return "";
  }
}

function ResetButton({ reset }) {
  return (
    <button onClick={reset} className="reset-button">
      Reset Deck
    </button>
  );
}

function PokerGame({ numCards, numPlayers }) {
  const [selectedCard, setSelectedCard] = useState({
    type: "player",
    playerIndex: 0,
    cardIndex: 0,
    cardDetails: null,
  });
  const [usedDeckCards, setUsedDeckCards] = useState(new Set());
  const [communityCards, setCommunityCards] = useState(Array(5).fill(null));
  const [playerCards, setPlayerCards] = useState(
    Array.from({ length: numPlayers }, () => Array(numCards).fill(null))
  );

  function hasCompleteCards(cards) {
    return cards.every((card) => card !== null);
  }

  const completePlayerCards = playerCards.filter(hasCompleteCards);

  console.log("p" + completePlayerCards);
  console.log("c" + communityCards);

  const probabilities = calculateProbabilities(
    completePlayerCards,
    communityCards
  );

  const reset = () => {
    setSelectedCard({
      type: null,
      playerIndex: null,
      cardIndex: null,
      cardDetails: null,
    });
    setUsedDeckCards(new Set());
    setPlayerCards(
      Array.from({ length: numPlayers }, () => Array(numCards).fill(null))
    );
    setCommunityCards(Array(5).fill(null));
  };

  const communityCardElements = [
    <div key={0} className="community-cards-group">
      {communityCards.slice(0, 3).map((_, index) => (
        <CommunityCard
          key={index}
          index={index}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          setCommunityCards={setCommunityCards}
          communityCards={communityCards}
        />
      ))}
    </div>,
    <div key={1} className="community-cards-group">
      <CommunityCard
        key={1}
        index={3}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        setCommunityCards={setCommunityCards}
        communityCards={communityCards}
      />
    </div>,
    <div key={2} className="community-cards-group">
      <CommunityCard
        key={2}
        index={4}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        setCommunityCards={setCommunityCards}
        communityCards={communityCards}
      />
    </div>,
  ];

  const players = new Array(numPlayers)
    .fill(null)
    .map((_, index) => (
      <Player
        key={index}
        playerNumber={index + 1}
        numCards={numCards}
        numPlayers={numPlayers}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        playerCards={playerCards}
        probability={probabilities[index] || {}}
      />
    ));

  return (
    <div className="App">
      <div className="title">Poker Probability Calculator</div>
      <div className="table-and-chat">
        <div className="table-wrapper">
          <NavBar />
          <ResetButton calssName="reset-button" reset={reset} />
          <div className="poker-table">
            {players}
            <div className="community-cards">
              <div className="community-cards-group">
                {communityCardElements}
              </div>
            </div>
          </div>
          <Deck
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            usedDeckCards={usedDeckCards}
            setUsedDeckCards={setUsedDeckCards}
            communityCards={communityCards}
            playerCards={playerCards}
            setPlayerCards={setPlayerCards}
            setCommunityCards={setCommunityCards}
          />
          <Chatbot
            playerCards={completePlayerCards}
            communityCards={communityCards}
          />
        </div>
      </div>
      <div className="descriptions-box">
        <div className="descriptions-content">
          <div className="description-title">
            Educational Tool for Beginners
          </div>
          <div>
            New to poker? Learn the ropes with our intuitive odds calculator,
            providing real-time insights into the game's intricacies
          </div>
        </div>
        <div className="descriptions-content">
          <div className="description-title">Real-time Competitive Edge</div>
          <div>
            In the heat of the game, gain an instant edge over your opponents.
            Get insights into your chances and make informed decisions on the
            fly
          </div>
        </div>
        <div className="descriptions-content">
          <div className="description-title">Virtual Poker Assistant</div>
          <div>
            Navigating a complex hand? Our integrated chatbot, offers tailored
            advice for your specific situation and quick poker tips.
          </div>
        </div>
      </div>
    </div>
  );
}

function TexasHoldem() {
  return <PokerGame numCards={2} numPlayers={8} />;
}

function Omaha() {
  return <PokerGame numCards={4} numPlayers={6} />;
}

function FiveCardOmaha() {
  return <PokerGame numCards={5} numPlayers={6} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/texas-holdem" element={<TexasHoldem />} />
        <Route path="/omaha" element={<Omaha />} />
        <Route path="/five-card-omaha" element={<FiveCardOmaha />} />
      </Routes>
    </Router>
  );
}

export default App;

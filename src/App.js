import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import "./App.css";
import hearts from "./images/hearts.png";
import diamonds from "./images/diamonds.png";
import clubs from "./images/clubs.png";
import spades from "./images/spades.png";
import React, { useState } from "react";

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
  communityCards,
  setPlayerCards,
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
        if (selectedCard.type === "player") {
          const newPlayerCards = [...playerCards];
          newPlayerCards[selectedCard.playerIndex][selectedCard.cardIndex] = {
            cardNumber: cardNumber,
            cardName: cardName,
            cardSuit: cardSuit,
          };
          setSelectedCard({});
          setUsedDeckCards((prevUsedDeckCards) => {
            const newUsedDeckCards = new Set(prevUsedDeckCards);
            newUsedDeckCards.add(cardNumber);
            return newUsedDeckCards;
          });
        } else if (selectedCard.type === "community") {
          const newCommunityCards = [...communityCards];
          newCommunityCards[selectedCard.cardIndex] = {
            cardNumber: cardNumber,
            cardName: cardName,
            cardSuit: cardSuit,
          };
          setSelectedCard({});
          setUsedDeckCards((prevUsedDeckCards) => {
            const newUsedDeckCards = new Set(prevUsedDeckCards);
            newUsedDeckCards.add(cardNumber);
            return newUsedDeckCards;
          });
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
              playerCards={playerCards} // pass the playerCards to DeckCard
              setPlayerCards={setPlayerCards} // pass the setPlayerCards to DeckCard
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
        <h2>Player {playerNumber}</h2>
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
    </div>
  );
}

function CommunityCard({
  index,
  selectedCard,
  setSelectedCard,
  communityCards,
}) {
  if (!communityCards[index]) {
    return (
      <div
        className={`community-card ${
          selectedCard?.type === "community" && selectedCard?.index === index
            ? "selected-card"
            : ""
        }`}
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
    type: null,
    playerIndex: null,
    cardIndex: null,
    cardDetails: null,
  });
  const [usedDeckCards, setUsedDeckCards] = useState(new Set());
  const [communityCards, setCommunityCards] = useState(Array(5).fill(null));
  const [playerCards, setPlayerCards] = useState(
    Array.from({ length: numPlayers }, () => Array(numCards).fill(null))
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
      />
    ));

  return (
    <div className="App">
      <div className="table-wrapper">
        <NavBar />
        <ResetButton calssName="reset-button" reset={reset} />
        <div className="poker-table">
          {players}
          <div className="community-cards">
            <div className="community-cards-group">{communityCardElements}</div>
          </div>
        </div>
        <Deck
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          usedDeckCards={usedDeckCards}
          setUsedDeckCards={setUsedDeckCards}
          communityCards={communityCards}
          playerCards={playerCards}
          setPlayerCards={setPlayerCards} // pass the setPlayerCards to Deck
        />
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

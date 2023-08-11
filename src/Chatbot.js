import React, { useState } from "react";

function Chatbot({ playerCards, communityCards }) {
  const [userInput, setUserInput] = useState("");

  const transformedPlayerCards = playerCards
    .map((playerHand, index) => {
      return `Player ${index + 1}: ${playerHand
        .map((card) => transformCard(card))
        .join(", ")}`;
    })
    .join(", ");

  const transformedCommunityCards = communityCards
    .map((card) => transformCard(card))
    .join(" ");

    const handleInputChange = (e) => {
      setUserInput(e.target.value);
      
      e.target.style.height = 'auto';
      
      e.target.style.height = `${e.target.scrollHeight}px`;
  };
  const handleSubmit = () => {
    console.log("User's question:", userInput);
  };

  return (
    <div className="chat-bot">
      <div>
        Poker AI
      </div>
      <div className="input-container">
        <textarea
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your question here..."
          className="input-button"
        />
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
}

export default Chatbot;

function transformCard(card) {
  if (!card || card.cardName === null) {
    return;
  }
  let cardName = card.cardName;
  let cardSuit = card.cardSuit;

  return cardName + " of " + cardSuit + "s";
}

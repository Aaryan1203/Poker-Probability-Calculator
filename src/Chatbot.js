import React, { useState } from "react";

async function getData({ prompt, playerCards, communityCards }) {
  var systemRole =
    "You are a poker master training a beginner." +
    "The user is going to provide you with the cards that they have," +
    "as well as the community cards (if they exist). Your job is to give as best" +
    "advice as you can on what the player should do regarding betting, folding, or bluffing." +
    "Make sure to respond in only 3-4 sentances";
  try {
    const gptResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemRole,
            },
            {
              role: "user",
              content: `Player cards: ${playerCards}. Community cards: ${communityCards}. ${prompt}`,
            },
          ],
        }),
      }
    );
    const response = await gptResponse.json();
    console.log(response);
    console.log(
      `input: Player cards: ${playerCards}. Community cards: ${communityCards}. ${prompt}`
    );
    return response["choices"][0]["message"]["content"];
  } catch (error) {
    throw error;
  }
}

function Chatbot({ playerCards, communityCards }) {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");

  const player1Cards =
    playerCards && playerCards[0] && playerCards[0].length > 0
      ? playerCards[0]
          .map((card) => transformCard(card))
          .filter(Boolean)
          .join(", ")
      : "";

  const transformedCommunityCards = communityCards
    .map((card) => transformCard(card))
    .join(" ");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  const handleSubmit = async () => {
    console.log("User's question:", userInput);
    try {
      const response = await getData({
        prompt: userInput,
        playerCards: player1Cards,
        communityCards: transformedCommunityCards,
      });
      setOutput(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setUserInput("");
  };

  return (
    <div className="chat-bot">
      <div>Poker AI</div>
      <div className="output">{output}</div>
      <div className="input-container">
        <textarea
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your question here..."
          className="input-button"
        />
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
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

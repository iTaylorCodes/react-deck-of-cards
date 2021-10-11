import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";

const BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  // Gets deck from API
  useEffect(() => {
    const getDeck = async () => {
      const res = await axios.get(`${BASE_URL}/new/shuffle`);
      setDeck(res.data);
    };
    getDeck();
  }, [setDeck]);

  // Draws a card from deck via API
  useEffect(() => {
    const handleDrawCard = async () => {
      let { deck_id } = deck;

      try {
        let res = await axios.get(`${BASE_URL}/${deck_id}/draw`);

        if (res.data.remaining === 0) {
          throw new Error("No cards left in the deck!");
        }

        const card = res.data.cards[0];

        setCards((cards) => [
          ...cards,
          {
            id: card.code,
            name: card.value + " of " + card.suit,
            image: card.image,
          },
        ]);
      } catch (e) {
        alert(e);
      }
    };

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await handleDrawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  return (
    <div className="Deck">
      <button onClick={toggleAutoDraw}>
        {autoDraw ? "Stop drawing" : "Draw cards"}
      </button>
      <div className="Deck-cardarea">
        {cards.map((card) => (
          <Card key={card.id} name={card.name} image={card.image} />
        ))}
      </div>
    </div>
  );
};

export default Deck;

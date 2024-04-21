import { useEffect, useState } from "react";
import { Flashcard } from "./Flashcard";
import type { Card, Deck as DeckType } from "../types";
import { CardManager, DeckManager } from "../data";
import { CardChangeCallback } from "../data/CardManager";
import { formatDate } from "../helpers";

interface DeckProps {
  deck: DeckType;
}

export const Deck: React.FC<DeckProps> = ({ deck }) => {
  const deckManager = DeckManager.getInstance();
  const cardManager = CardManager.getInstance();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCards, setSortedCards] = useState<Array<Card>>([]);

  const cardChangeCallback: CardChangeCallback = () => {
    setSortedCards([...cardManager.getCards(deck.id)]);
  };

  useEffect(() => {
    cardManager.subscribe(cardChangeCallback);
    return () => cardManager.unsubscribe(cardChangeCallback);
  }, []);

  const handleDeleteDeck = () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      deckManager.deleteDeck(deck.id);
    }
  };

  const handleUpdateDeckTitle = () => {
    const newTitle = prompt("New title for this deck:", deck.title);
    if (newTitle) {
      deckManager.updateDeckTitle(deck.id, newTitle);
    }
  };

  function handleAddCard() {
    const front = prompt("Front of card:");
    const back = prompt("Back of card:");
    if (front && back) {
      cardManager.createCard(deck.id, front, back);
    }
  }

  return (
    <div className="deck-component">
      <h2 className="deck-component__title">
        {deck.title} - Cards: {sortedCards.length}
        <button onClick={() => handleUpdateDeckTitle()}>Edit</button>
        <button onClick={() => handleDeleteDeck()}>Delete</button>
      </h2>
      <p>Last Updated: {formatDate(deck.lastUpdated)}</p>
      <div>
        <input type="text" placeholder="Search Flashcards" />
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
      </div>
      <button
        className="deck-component__card-button"
        onClick={() => handleAddCard()}
      >
        Add Card
      </button>
      <div className="deck-component__card-container">
        {sortedCards.length > 0 ? (
          sortedCards.map((card) => <Flashcard key={card.id} card={card} />)
        ) : (
          <p>No flashcards found.</p>
        )}
      </div>
    </div>
  );
};

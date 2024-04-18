import React from 'react';
import Flashcard from './Flashcard';
import './Deck.css'; // Import the CSS file

function Deck({ deck, addCardToDeck, deleteDeck, updateDeckTitle, deleteCard, updateCard }) {
  const handleDeleteDeck = () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      deleteDeck(deck.id);
    }
  };

  const handleUpdateDeckTitle = () => {
    const newTitle = prompt("New title for this deck:", deck.title);
    if (newTitle) {
      updateDeckTitle(deck.id, newTitle);
    }
  };

  const handleAddCard = () => {
    const front = prompt('Front of card:');
    const back = prompt('Back of card:');
    if (front && back) {
      addCardToDeck(deck.id, front, back);
    }
  };

  return (
    <div className="deck-container">
      <h2>{deck.title} <button onClick={handleUpdateDeckTitle}>Edit</button> <button onClick={handleDeleteDeck}>Delete</button></h2>
      <button className="card-button" onClick={handleAddCard}>Add Card</button>
      <div className="card-container">
        {deck.cards.map((card) => (
          <Flashcard
            key={card.id}
            card={card}
            deleteCard={deleteCard}
            updateCard={updateCard}
            deckId={deck.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Deck;

import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import './Deck.css'; // Import the CSS file

function Deck({ deck, addCardToDeck, deleteDeck, updateDeckTitle, deleteCard, updateCard }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedFlashcards, setSortedFlashcards] = useState(deck.cards);

  useEffect(() => {
    let filtered = deck.cards.filter(card => card.front.toLowerCase().includes(searchTerm.toLowerCase()) || card.back.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.front.localeCompare(b.front));
    } else {
      filtered.sort((a, b) => b.front.localeCompare(a.front));
    }

    setSortedFlashcards(filtered);
  }, [searchTerm, deck.cards, sortOrder]);
  
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
      <h2>{deck.title} - Cards: {deck.cards.length}<button onClick={handleUpdateDeckTitle}>Edit</button> <button onClick={handleDeleteDeck}>Delete</button></h2>
      <div>
        <input
          type="text"
          placeholder="Search Flashcards"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <button className="card-button" onClick={handleAddCard}>Add Card</button>
      <div className="card-container">
        {sortedFlashcards.length > 0 ? sortedFlashcards.map((card) => (
          <Flashcard
            key={card.id}
            card={card}
            deleteCard={deleteCard}
            updateCard={updateCard}
            deckId={deck.id}
          />
        )) : <p>No flashcards found.</p>}
      </div>
    </div>
  );
}

export default Deck;

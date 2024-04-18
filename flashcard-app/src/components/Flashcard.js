import React, { useState } from 'react';
import './Flashcard.css';

function Flashcard({ card, deleteCard, updateCard, deckId }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard = (e) => {
    e.stopPropagation(); // Prevent triggering of the flipping event
    deleteCard(deckId, card.id);
  };

  const handleUpdateCard = (e) => {
    e.stopPropagation(); // Prevent triggering of the flipping event
    const front = prompt("New front text:", card.front);
    const back = prompt("New back text:", card.back);
    if (front && back) {
      updateCard(deckId, card.id, front, back);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-wrapper">
      <div className="controls">
        <button onClick={handleUpdateCard}>Edit</button>
        <button onClick={handleDeleteCard}>Delete</button>
      </div>
      <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
        <div className="flashcard-front">
          {card.front}
        </div>
        <div className="flashcard-back">
          {card.back}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;

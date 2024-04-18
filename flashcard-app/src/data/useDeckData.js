import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function useDeckData() {
  const [decks, setDecks] = useState([]);

  const addDeck = (title) => {
    const newDeck = { id: uuidv4(), title, cards: [] };
    setDecks([...decks, newDeck]);
  };

  const deleteDeck = (deckId) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
  };

  const updateDeckTitle = (deckId, newTitle) => {
    const updatedDecks = decks.map(deck => deck.id === deckId ? { ...deck, title: newTitle } : deck);
    setDecks(updatedDecks);
  };

  const addCardToDeck = (deckId, front, back) => {
    const updatedDecks = decks.map(deck => {
      if (deck.id === deckId) {
        const newCard = { id: uuidv4(), front, back };
        return { ...deck, cards: [...deck.cards, newCard] };
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  const updateCard = (deckId, cardId, front, back) => {
    const updatedDecks = decks.map(deck => {
      if (deck.id === deckId) {
        const updatedCards = deck.cards.map(card => card.id === cardId ? { ...card, front, back } : card);
        return { ...deck, cards: updatedCards };
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  const deleteCard = (deckId, cardId) => {
    const updatedDecks = decks.map(deck => {
      if (deck.id === deckId) {
        const filteredCards = deck.cards.filter(card => card.id !== cardId);
        return { ...deck, cards: filteredCards };
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  return { decks, addDeck, deleteDeck, updateDeckTitle, addCardToDeck, updateCard, deleteCard };
}

export default useDeckData;

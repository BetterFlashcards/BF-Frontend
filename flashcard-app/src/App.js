import React from 'react';
import Deck from './components/Deck';
import useDeckData from './data/useDeckData';  // Assuming useDeckData is in the data folder

function App() {
  const { decks, addDeck, deleteDeck, updateDeckTitle, addCardToDeck, updateCard, deleteCard } = useDeckData();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flashcards App</h1>
        <button onClick={() => addDeck(prompt("Enter new deck title:"))}>Add New Deck</button>
      </header>
      {decks.map((deck) => (
        <Deck
          key={deck.id}
          deck={deck}
          addCardToDeck={addCardToDeck}
          deleteDeck={deleteDeck}
          updateDeckTitle={updateDeckTitle}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      ))}
    </div>
  );
}

export default App;

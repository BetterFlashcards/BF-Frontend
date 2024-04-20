import React, { useState, useEffect } from 'react';
import Deck from './components/Deck';
import useDeckData from './data/useDeckData';  // Assuming useDeckData is in the data folder

function App() {
  const { decks, addDeck, deleteDeck, updateDeckTitle, addCardToDeck, updateCard, deleteCard } = useDeckData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedDecks, setSortedDecks] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    let filtered = decks.filter(deck => deck.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setSortedDecks(filtered);
  }, [searchTerm, decks, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flashcards App</h1>
        <input type="text" placeholder="Search Decks" onChange={e => setSearchTerm(e.target.value)} />
        <button onClick={() => addDeck(prompt("Enter new deck title:"))}>Add New Deck</button>
        <button onClick={toggleSortOrder}>Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}</button>
      </header>
      {sortedDecks.length > 0 ? sortedDecks.map((deck) => (
        <Deck
          key={deck.id}
          deck={deck}
          addCardToDeck={addCardToDeck}
          deleteDeck={deleteDeck}
          updateDeckTitle={updateDeckTitle}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      )) : <p>No decks found!</p>}
    </div>
  );
}

export default App;

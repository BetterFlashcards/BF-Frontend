import { useState, useEffect } from "react";
import { Deck } from "./components/Deck";
import { DeckManager } from "./data";
import type { Deck as DeckType } from "./types";
function App() {
  const deckManager = DeckManager.getInstance();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDecks, setSortedDecks] = useState<Array<DeckType>>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const deckCallback = (decks: Array<DeckType>) => {
    setSortedDecks([...decks]);
  };

  useEffect(() => {
    deckManager.subscribe(deckCallback);
    return () => {
      deckManager.unsubscribe(deckCallback);
    };
  }, []);

  useEffect(() => {
    let filtered = deckManager
      .getDecks()
      .filter((deck) =>
        deck.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setSortedDecks(filtered);
  }, [searchTerm, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder: string | null) =>
      prevOrder === "asc" ? "desc" : "asc"
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flashcards App</h1>
        <input
          type="text"
          placeholder="Search Decks"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() =>
            deckManager.createDeck(prompt("Enter new deck title:") || "")
          }
        >
          Add New Deck
        </button>
        <button onClick={toggleSortOrder}>
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
      </header>
      {sortedDecks.length > 0 ? (
        sortedDecks.map((deck) => <Deck key={deck.id} deck={deck} />)
      ) : (
        <p>No decks found!</p>
      )}
    </div>
  );
}

export default App;

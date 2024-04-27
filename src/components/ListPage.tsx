import { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, FormControl, Button, ButtonGroup } from 'react-bootstrap';
import { Deck } from "./Deck";
import { DeckManager } from "../data";
import type { Deck as DeckType } from "../types";

function Home() {
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
    <Container className="App">
      <Row className="App-header">
        <Col xs={12}>
          <h1>Your Deck</h1>
        </Col>
        <Col xs={12}>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Search Decks"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12}>
          <ButtonGroup>
            <Button
              variant="primary"
              onClick={() =>
                deckManager.createDeck(prompt("Enter new deck title:") || "")
              }
            >
              Add New Deck
            </Button>
            <Button variant="secondary" onClick={toggleSortOrder}>
              Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      {sortedDecks.length > 0 ? (
        sortedDecks.map((deck) => <Deck key={deck.id} deck={deck} />)
      ) : (
        <p>No decks found!</p>
      )}
    </Container>
  );
}
export default Home;

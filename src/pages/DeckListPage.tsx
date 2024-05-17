import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  ButtonGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { Deck } from "../components/Deck";
import { DeckManager } from "../data";
import type { Deck as DeckType } from "../types";

const DeckListPage: React.FC = () => {
  const deckManager = DeckManager.getInstance();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDecks, setSortedDecks] = useState<Array<DeckType>>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [deckCount, setDeckCount] = useState<number>(0);

  const [show, setShow] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [newDeckDescription, setNewDeckDescription] = useState<string>("");
  const [validated, setValidated] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeckToDelete, setTargetDeckToDelete] = useState(0);

  const deckCallback = (decks: Array<DeckType>) => {
    setSortedDecks([...decks]);
    setDeckCount(decks.length);
  };

  useEffect(() => {
    deckManager.subscribe(deckCallback);
    deckManager.fetchDecks();
    // setSortedDecks([...deckManager.getDecks()]);
    // setDeckCount(deckManager.getDecks().length);

    return () => {
      deckManager.unsubscribe(deckCallback);
    };
  }, []);

  useEffect(() => {
    let filtered = deckManager
      .getDecks()
      .filter((deck) =>
        deck.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedDecks(filtered);
  }, [searchTerm, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder: string | null) =>
      prevOrder === "asc" ? "desc" : "asc"
    );
  };

  function handleCreateNewDeck(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    deckManager.createDeck(newDeckName, newDeckDescription);
    setValidated(false);
    setShow(false);
    setNewDeckName("");
    setNewDeckDescription("");
  }

  function openDeleteModal(deckId: number) {
    setShowDeleteModal(true);
    setTargetDeckToDelete(deckId);
  }

  function handleDeleteDeck() {
    deckManager.deleteDeck(targetDeckToDelete);
    setShowDeleteModal(false);
  }

  return (
    <Container fluid="lg" className="mt-5">
      <Row>
        <Col xs={8}>
          <h1>All Decks</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-end flex-wrap">
          <ButtonGroup>
            <Button variant="primary" onClick={() => setShow(true)}>
              Add New Deck
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <div className="mt-5">
        {deckCount > 0 ? (
          <>
            <InputGroup className="mb-3">
              <FormControl
                type="text"
                placeholder="Search Decks"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="secondary" onClick={toggleSortOrder}>
                Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
              </Button>
            </InputGroup>
            <Row className="gy-4">
              {sortedDecks.map((deck) => (
                <Col sm={12} md={6} lg={4} xl={3} key={deck.id}>
                  <Deck deck={deck} onDelete={openDeleteModal} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <p>No decks found!</p>
        )}
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Form noValidate validated={validated} onSubmit={handleCreateNewDeck}>
          <Modal.Header closeButton>
            <Modal.Title>Enter new deck details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.titleControl"
            >
              <Form.Label>Deck title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Deck title"
                required
                autoFocus
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter title.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.descriptionControl"
            >
              <Form.Label>Deck description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this deck</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDeleteDeck()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeckListPage;

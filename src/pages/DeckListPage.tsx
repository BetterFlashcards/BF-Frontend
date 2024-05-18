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
  Card,
} from "react-bootstrap";
import { FaPlus, FaSort } from "react-icons/fa";
import { Deck } from "../components/Deck";
import { DeckService } from "../data";
import type { Deck as DeckType } from "../types";
import { useNavigate } from "react-router-dom";
// import "./DeckListPage.scss";

const DeckListPage: React.FC = () => {
  const deckService = DeckService.getInstance();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDecks, setSortedDecks] = useState<Array<DeckType>>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [deckCount, setDeckCount] = useState<number>(0);

  const [show, setShow] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [validated, setValidated] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeckToDelete, setTargetDeckToDelete] = useState(0);

  const deckCallback = (decks: Array<DeckType>) => {
    setSortedDecks([...decks]);
    setDeckCount(decks.length);
  };

  useEffect(() => {
    deckService.subscribe(deckCallback);
    deckService.fetchDecks();
    return () => {
      deckService.unsubscribe(deckCallback);
    };
  }, []);

  useEffect(() => {
    let filtered = deckService
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

  async function handleCreateNewDeck(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const newDeck = await deckService.createDeck({
      name: newDeckName,
      language: language,
    });
    if (newDeck) {
      navigate(`/decks/${newDeck.id}`);
    }
    setValidated(false);
    setShow(false);
    setNewDeckName("");
    setLanguage("");
  }

  function openDeleteModal(deckId: number) {
    setShowDeleteModal(true);
    setTargetDeckToDelete(deckId);
  }

  function handleDeleteDeck() {
    deckService.deleteDeck(targetDeckToDelete);
    setShowDeleteModal(false);
  }

  return (
    <Container fluid="lg" className="deck-list-page mt-5">
      <Row>
        <Col xs={8}>
          <h1>All Decks</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-end flex-wrap">
          <ButtonGroup>
            <Button variant="primary" onClick={() => setShow(true)}>
              <FaPlus /> Add New Deck
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
                <FaSort /> Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
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
              <Form.Label>Deck Language</Form.Label>
              <Form.Control
                type="text"
                placeholder="Language"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
          <Modal.Title>Are you sure you want to delete this deck?</Modal.Title>
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
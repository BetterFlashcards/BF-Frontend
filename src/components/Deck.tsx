import type { Deck as DeckType } from "../types";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DeckManager } from "../data";

interface DeckProps {
  deck: DeckType;
  onDelete: (deckId: number) => void;
}

export const Deck: React.FC<DeckProps> = ({ deck, onDelete }) => {
  const deckManager = DeckManager.getInstance();
  const navigate = useNavigate();

  const handleUpdateDeckTitle = () => {
    const newTitle = prompt("New title for this deck:", deck.name);
    if (newTitle) {
      deckManager.updateDeckTitle(deck.id, newTitle);
    }
  };

  return (
    <BCard className="deck-component">
      <BCard.Header>
        <div className="d-flex align-items-center justify-content-between">
          <span className="card-count">Cards: {deckManager.getCardCountByDeck(deck.id)}</span>
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={handleUpdateDeckTitle}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deck.id);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </BCard.Header>
      <BCard.Body onClick={() => navigate(`/decks/${deck.id}`)}>
        <BCard.Title>{deck.name}</BCard.Title>
        <BCard.Text>{deck.language}</BCard.Text>
      </BCard.Body>
      <BCard.Footer className="text-muted">Last updated:</BCard.Footer>
    </BCard>
  );
};

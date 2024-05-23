import React, { MouseEventHandler, useState } from "react";
import type { Card } from "../types";
import { CardService } from "../data";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";

interface FlashcardProps {
  card: Card;
  onDelete: (card: Card) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, onDelete }) => {
  const cardService = CardService.getInstance();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onDelete(card);
  };

  const handleUpdateCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const front = prompt("New front text:", card.front_text);
    const back = prompt("New back text:", card.back_text);
    if (front && back) {
      cardService.updateCard(card.id, front, back);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <BCard
      className={`flashcard-component ${isFlipped ? "flipped" : ""}`}
      onClick={handleClick}
    >
      <BCard.Body>
        <div className="flashcard-content">
          <div className="flashcard-front">{card.front_text}</div>
          <div className="flashcard-back">{card.back_text}</div>
        </div>
      </BCard.Body>
      <BCard.Footer className="flashcard-controls">
        <div className="d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={handleUpdateCard}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteCard}>
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </BCard.Footer>
    </BCard>
  );
};

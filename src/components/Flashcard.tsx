import React, { MouseEventHandler, useState } from "react";
import type { Card } from "../types";
import { CardManager } from "../data";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";

interface FlashcardProps {
  card: Card;
}
export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const cardManager = CardManager.getInstance();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (card.id) cardManager.deleteCard(card.id);
  };
  const handleUpdateCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const front = prompt("New front text:", card.front);
    const back = prompt("New back text:", card.back);
    if (front && back) {
      cardManager.updateCard(card.id, front, back);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <BCard className="flashcard-component">
      <BCard.Body>
        <div
          className={`flashcard-component__content ${
            isFlipped ? "flashcard-component__content_flipped" : ""
          }`}
          onClick={handleClick}
        >
          <div className="flashcard-component__content__front">
            {card.front}
          </div>
          <div className="flashcard-component__content__back">{card.back}</div>
        </div>
      </BCard.Body>
      <BCard.Footer className="flashcard-component__controls">
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

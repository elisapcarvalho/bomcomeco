document.addEventListener("DOMContentLoaded", () => {
  const availableCards = [
    {
      name: "schoolbag",
      text: "SCHOOLBAG",
    },
    {
      name: "pen",      
      text: "PEN",
    },
    {
      name: "eraser",      
      text: "ERASER",      
    },
    {
      name: "book",
      text: "BOOK",
    },
    {
      name: "pencil",
      text: "PENCIL",
    },
    {
      name: "pencil-case",
      text: "PENCIL CASE",
    },
    {
      name: "notebook",
      text: "NOTEBOOK",
    },
  ];

  const sounds = {
    'schoolbag': new Audio('sounds/schoolbag.mp3'),
    'pen': new Audio('sounds/pen.mp3'),
    'eraser': new Audio('sounds/eraser.mp3'),
    'book': new Audio('sounds/book.mp3'),
    'pencil': new Audio('sounds/pencil.mp3'),
    'pencil-case': new Audio('sounds/pencil-case.mp3'),
    'notebook': new Audio('sounds/notebook.mp3'),
  };

  const cards = [];
  const cardsChosenId = [];
  let matches = 0;

  const grid = document.querySelector(".grid");
  const commandsContainer = document.querySelector(".commands");

  function showCommands() {
    commandsContainer.style.display = "flex";
    grid.classList.add("disabledDiv");
  };

  function flipCard() {
    this.removeEventListener("click", flipCard);

    const cardId = this.getAttribute("data-id");
    cardsChosenId.push(cardId);
    this.setAttribute("alt", cards[cardId].name);
    this.setAttribute("src", cards[cardId].showText ? `images/${cards[cardId].name}-text.png` : `images/${cards[cardId].name}.png`);
    sounds[cards[cardId].name].play();
    if (cardsChosenId.length === 2) {
      setTimeout(showCommands(), 3500);
    }
  }

  const flipCardBack = (card) => {
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.png");
    card.addEventListener("click", flipCard);
  };

  const updateMatches = (qty) => {
    matches = qty;
    if (matches === availableCards.length) {
      document.getElementById("restart").style.display = "block";

      document.getElementById("result").textContent = "GOOD JOB! YOU FOUND ALL PAIRS!";
      document.getElementById("result").classList.add("good-job");
    } else {
      document.getElementById(
        "result"
      ).textContent = `YOU FOUND ${matches} PAIRS OF ${availableCards.length}`;
    }
  };

  const setCardOk = (card) => {
    card.removeEventListener("click", flipCard);
    card.setAttribute("src", "images/ok.png");
  };

  const checkIfCardsMatch = (isCorrect) => {
    commandsContainer.style.display = "none";
    grid.classList.remove("disabledDiv");

    console.log(`${cardsChosenId[0]} - ${cardsChosenId[1]}`);
    const card0 = document.querySelector(`.card-${cardsChosenId[0]}`);
    const card1 = document.querySelector(`.card-${cardsChosenId[1]}`);
    if (isCorrect) {
      setCardOk(card0);
      setCardOk(card1);
      updateMatches(++matches);
    } else {
      flipCardBack(card0);
      flipCardBack(card1);
    }
    cardsChosenId.splice(0, 2);
  };

  const createCard = (id) => {
    const card = document.createElement("img");
    card.setAttribute("data-id", id);
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.png");
    card.classList.add(`card-${id}`);
    card.addEventListener("click", flipCard);
    return card;
  };

  const suffleCards = () => {
    cards.length = 0;

    availableCards.forEach((card) => {
      cards.push({...card, showText: false});
      cards.push({...card, showText: true});
    });

    cards.sort(() => 0.5 - Math.random());
  };

  const createBoard = () => {
    updateMatches(0);
    suffleCards();
    grid.querySelectorAll("*").forEach((n) => n.remove());
    for (let i = 0; i < cards.length; i++) {
      grid.appendChild(createCard(i));
    }
    commandsContainer.style.display = "none";
    document.getElementById("result").classList.remove("good-job");
    document.getElementById("restart").style.display = "none";
  };

  document.getElementById("correctAnswer").addEventListener("click", () => checkIfCardsMatch(true));
  document.getElementById("incorrectAnswer").addEventListener("click", () => checkIfCardsMatch(false));
  document.getElementById("restart").addEventListener("click", createBoard);

  createBoard();
});

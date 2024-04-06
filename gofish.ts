type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

enum Suit {
  Spades = "s",
  Hearts = "h",
  Clubs = "c",
  Diamonds = "d",
}

enum Status {
  Win = "Win",
  Lose = "Lose",
  Playing = "Playing",
}

interface rankValues {
  [key: string]: number;
}

type Card = `${Rank}${Suit}`;

class Deck {
  private deck: Card[];

  constructor() {
    this.deck = [
      "2s",
      "2h",
      "2d",
      "2c",
      "3s",
      "3h",
      "3d",
      "3c",
      "4s",
      "4h",
      "4d",
      "4c",
      "5s",
      "5h",
      "5d",
      "5c",
      "6s",
      "6h",
      "6d",
      "6c",
      "7s",
      "7h",
      "7d",
      "7c",
      "8s",
      "8h",
      "8d",
      "8c",
      "9s",
      "9h",
      "9d",
      "9c",
      "10s",
      "10h",
      "10d",
      "10c",
      "Js",
      "Jh",
      "Jd",
      "Jc",
      "Qs",
      "Qh",
      "Qd",
      "Qc",
      "Ks",
      "Kh",
      "Kd",
      "Kc",
      "As",
      "Ah",
      "Ad",
      "Ac",
    ];
  }
  // Fisher - Yates shuffling aglo (Knuth shuffle)
  public shuffle(): void {
    const length = this.deck.length;
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public drawCard(): Card | undefined {
    // Draw a card from the deck
    if (this.deck.length) {
      return this.deck.pop();
    }
    return undefined;
  }
  public getDeckSize(): number {
    return this.deck.length;
  }
}

const deck = new Deck();
console.log(deck);
deck.shuffle();
console.log(deck);

class GoFish {
  private readonly ranks: Rank[];
  private readonly suits: Suit[];
  private readonly rankValues: rankValues;
  private numPlayers: number;
  private deck: Deck;
  public order: Person[];
  constructor(numPlayers: number) {
    this.ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    this.deck = new Deck();
    this.rankValues = {
      "2c": 1,
      "2d": 2,
      "2h": 3,
      "2s": 4,
      "3c": 5,
      "3d": 6,
      "3h": 7,
      "3s": 8,
      "4c": 9,
      "4d": 10,
      "4h": 11,
      "4s": 12,
      "5c": 13,
      "5d": 14,
      "5h": 15,
      "5s": 16,
      "6c": 17,
      "6d": 18,
      "6h": 19,
      "6s": 20,
      "7c": 21,
      "7d": 22,
      "7h": 23,
      "7s": 24,
      "8c": 25,
      "8d": 26,
      "8h": 27,
      "8s": 28,
      "9c": 29,
      "9d": 30,
      "9h": 31,
      "9s": 32,
      "10c": 33,
      "10d": 34,
      "10h": 35,
      "10s": 36,
      Jc: 37,
      Jd: 38,
      Jh: 39,
      Js: 40,
      Qc: 41,
      Qd: 42,
      Qh: 43,
      Qs: 44,
      Kc: 45,
      Kd: 46,
      Kh: 47,
      Ks: 48,
      Ac: 49,
      Ad: 50,
      Ah: 51,
      As: 52,
    };
    this.suits = [Suit.Clubs, Suit.Hearts, Suit.Spades, Suit.Diamonds];
    this.numPlayers = numPlayers;
    this.order = [];
  }

  deal(...args: Person[]): string {
    // Deal cards
    // Lets say 5 cards each for now
    // Could refactor here to deal in a fair way (i.e deal 1 card at a time to each player until count is reached)
    for (const person of args) {
      console.log(person);
      for (let i = 0; i < 5; i++) {
        if (this.deck.getDeckSize() > 0) {
          const pop = this.deck.drawCard();
          if (pop) {
            person.hand.push(pop);
          }
        }
      }
    }
    for (const person of args) {
      if (this.winCheck(person)) {
        return `${person.name} wins!`;
      }
    }
    return "Cards Dealt!";
  }
  determineOrderAndShuffle(...args: Person[]): void {
    // Populate hands
    for (const person of args) {
      this.order.push(person);
    }
    this.deck.shuffle();
    // for (const person of args) {
    //   person.hand.push(this.deck.pop());
    // }
    // // Compare hands
    // let startPlayer: Person | undefined = undefined;
    // let maxHand: number = Number.NEGATIVE_INFINITY;
    // for (const person of args) {
    //   if (!startPlayer) {
    //     startPlayer = person;
    //     maxHand = this.rankValues[person.hand[0]];
    //   } else if (this.rankValues[person.hand[0]] < maxHand) {
    //     startPlayer = person;
    //   }
    // }
    // console.log(startPlayer, "this is who is starting");
  }
  validMove(currentPlayer: Person, card: string) {
    for (const c of currentPlayer.hand) {
      if (c[0] === card[0]) return true;
    }
    return false;
  }
  fish(currentPlayer: Person, fishedPlayer: Person, card: string): string {
    // Need to have at least one of the cards that you are asking for
    // If player makes a catch, can proceed fishing
    if (currentPlayer !== this.order[0]) {
      return "It's not your turn";
    }

    let validMove = false;
    const newFishedHand: string[] = [];
    for (let i = 0; i < fishedPlayer.hand.length; i++) {
      if (currentPlayer.hand[i][0] === card[0]) validMove = true;
      if (fishedPlayer.hand[i][0] !== card[0]) {
        newFishedHand.push(card);
      } else {
        currentPlayer.hand.push(card);
      }
    }

    if (!validMove) {
      return "Invalid Move";
    }
    if (newFishedHand.length === fishedPlayer.hand.length) {
      // Current player draws a card
      // fishedPlayer did have the card
      const cardDrawn: Card | undefined = this.deck.drawCard();
      if (cardDrawn) {
        currentPlayer.hand.push(cardDrawn);
        this.nextTurn();
        return "Go Fish";
      }
      currentPlayer.status = Status.Lose;
      return `${currentPlayer.name} lost!`;
    } else {
      if (this.winCheck(currentPlayer))
        return `${currentPlayer.name} wins, game over!`;
      fishedPlayer.hand = newFishedHand;
      return "Go again!";
    }
    // need to check churrent player and fished palyers hand to see if they lost or won
  }

  nextTurn() {
    if (this.order.length) {
      const pop = this.order.shift();
      if (pop) this.order.push(pop); // Non Null Assertion Operator
    }
  }
  winCheck(player: Person): boolean {
    const d: { [key: string]: number } = {};
    for (let i = 0; i < player.hand.length; i++) {
      let compare: string | undefined = undefined;
      if (player.hand[i][0] === "1") {
        compare = "10";
      } else {
        compare = player.hand[i];
      }
      if (!d[compare]) {
        d[compare] = 1;
      }
      d[compare] += 1;
      if (d[compare] === 4) {
        player.status = Status.Win;
        return true;
      }
    }
    return false;
  }
}

class Person {
  public name: string;
  public hand: string[];
  public status: Status.Playing | Status.Win | Status.Lose;

  constructor(name: string) {
    this.name = name;
    this.hand = [];
    // Could be better to keep hand count, so we don't have to recount every time
    this.status = Status.Playing;
  }
}

// const game1 = new GoFish(2);
// const albert = new Person("albert");
// const caitlin = new Person("caitlin");
// game1.shuffle();
// game1.determineOrderAndShuffle(albert, caitlin);
// game1.deal(albert, caitlin);
// console.log(albert);
// console.log(caitlin);
// console.log(game1.fish(albert, caitlin, "4"));
// console.log(albert);
// console.log(caitlin);

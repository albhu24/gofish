import { PersonMatch } from "aws-sdk/clients/rekognition";
import { bool } from "aws-sdk/clients/signer";

class GoFish {
  public ranks: string[];
  public deck: string[] | any;
  public players: number;
  public suits: string[];
  public numberOfPlayers: number;
  public order: Person[];
  public rankValues: { [key: string]: number };
  constructor(n: number) {
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
    this.suits = ["s", "h", "c", "d"];
    this.deck = [];
    this.players = 0;
    this.numberOfPlayers = n;
    this.order = [];
  }
  shuffle(): void {
    this.deck = [];
    const dealt = new Set();
    while (this.deck.length < 52) {
      const randomRank = Math.floor(Math.random() * 13);
      const randomSuit = Math.floor(Math.random() * 4);
      if (dealt.has(this.ranks[randomRank] + this.suits[randomSuit])) {
        continue;
      }
      this.deck.push(this.ranks[randomRank] + this.suits[randomSuit]);
      dealt.add(this.ranks[randomRank] + this.suits[randomSuit]);
    }
  }
  deal(...args: Person[]): void {
    for (const person of args) {
      console.log(person);
      for (let i = 0; i < 5; i++) {
        if (this.deck.length > 0) person.hand.push(this.deck.pop());
      }
    }
    // Deal cards
    // Lets say 5 cards each for now
  }
  determineOrderAndShuffle(...args: Person[]): void {
    // Populate hands
    for (const person of args) {
      this.order.push(person);
    }
    this.shuffle();
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
  fish(currentPlayer: Person, fishedPlayer: Person, card: string): string {
    // Need to have at least one of the cards that you are asking for
    // If player makes a catch, can proceed fishing
    if (!currentPlayer.hand.includes(card)) {
      return "Invalid Move";
    }
    let compare: string | undefined = undefined;
    if (card[0] === "1") {
      compare = "10";
    } else {
      compare = card;
    }
    const newFishedHand: string[] = [];
    for (let i = 0; i < fishedPlayer.hand.length; i++) {
      if (
        fishedPlayer.hand.length[i].slice(0, 1) !== compare ||
        fishedPlayer.hand.length[i].slice(0, 2) !== compare
      ) {
        newFishedHand.push(compare);
      } else {
        currentPlayer.hand.push(compare);
      }
    }
    if (newFishedHand.length === fishedPlayer.hand.length) {
      // Current player draws a card
      // didnt have the card in the first place
      this.draw(currentPlayer);
      return "Go Fish";
    } else {
      if (this.winCheck(currentPlayer))
        return `${currentPlayer.name} wins, game over!`;
      fishedPlayer.hand = newFishedHand;
      return "Go again!";
    }
    // need to check churrent player and fished palyers hand to see if they lost or won
  }
  endTurnCheck() {
    // Check for
    // Dra
  }
  nextTurn() {
    const finished = this.order[0];
    this.order.shift();
    this.order.push(finished);
  }
  winCheck(player: Person): boolean {
    const d = {};
    for (let i = 0; i < player.hand.length; i++) {
      let compare: string | undefined = undefined;
      if (player.hand.length[i][0] === "1") {
        compare = "10";
      } else {
        compare = player.hand[i][0];
      }
      if (!d[compare]) {
        d[compare] = 1;
      }
      d[compare] += 1;
      if (d[compare] === 4) {
        player.status = "win";
        return true;
      }
    }
    return false;
  }
  endGame() {}
  draw(person: Person): void {
    // If no cards in hand, then draw 1
    // If no cards left in deck, they are out of thee game
    if (!this.deck.length) {
      person.status = "lose";
      return;
    }
    person.hand.push(this.deck.pop());
    return;
  }
}

class Person {
  public name: string;
  public hand: string[];
  public status: "alive" | "lose" | "win";

  constructor(name: string) {
    this.name = name;
    this.hand = [];
    this.status = "alive";
  }
}

const game1 = new GoFish(2);
const albert = new Person("albert");
const caitlin = new Person("caitlin");
game1.shuffle();
console.log(game1.deck);
game1.determineOrderAndShuffle(albert, caitlin);
console.log(game1.order);
console.log(game1.deck);

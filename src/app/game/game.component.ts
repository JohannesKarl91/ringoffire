import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  game$: Observable<any>;
  coll = collection(this.firestore, 'games');


  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.coll = collection(this.firestore, 'games');

    this.newGame();
    this.route.params.subscribe((params) => {
      console.log('id is', params['id']);

      this.game$ = collectionData(this.coll);
      this.game$.subscribe((newGame) => {
        console.log('Game data:', newGame);
      });
    });
  }

  newGame() {
    this.coll = collection(this.firestore, 'games');
    this.game = new Game();
    setDoc(doc(this.coll), { 'games': this.game.toJSON() });
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.stack.length > 0 && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      //console.log('New card is', this.currentCard);
      //console.log('this game is', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length; // z.B. 3/3 = 1 Rest 0 

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 500)
    }

    if (this.game.players.length == 0) {
      alert('Please add a Player before picking a new card.')
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}

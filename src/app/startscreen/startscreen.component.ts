import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
  }

  newGame() {
    let game = new Game();
    this.firestore
      .collection('games')
      .add(game.toJSON())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });

  }

}

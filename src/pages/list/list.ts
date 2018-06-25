import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';

import { Storage } from '@ionic/storage';   //STORAGE
import  _ from 'underscore';                //_.findWhere  etc.

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string, id: number}>;

  activityItems: Array< 
    { id: number, name: string, type: string, location: string, 
      time:number, distance:number, descript:string, noecard:boolean,
      weblink: string }>
    = Array 
    (
      {
        id: 1, name: "Heurigenpartie xxl", type: "Sport", location: "Enzersfeld Kellergasse", 
        time:3 , distance:5, 
        descript:"Mit Freunden in die Kellergasse wandern und dort guten Wein trinken und Fettes Fleisch essen", 
        noecard:false,
        weblink: "heurigenlink"
      } 
      , {
         id: 2,name: "Marterlwanderung", type: "Kultur", location: "Grossebersdorf Hauptplatz", 
        time:4 , distance: 10, 
        descript: "Treffen mit Gleichgesinnten und gemütliche Wanderung im Gemeindegebiet" , 
        noecard:true,
        weblink: "www.grossebersdorf.at"
      } 
      , {
        id: 3, name: "Radtour", type: "Sport", location: "Rund um Manhartsbrunn", 
        time:2 , distance: 10, 
        descript: "Gemütliche Runde um die Nachbargemeinden, ca 400hm " , 
        noecard:true,
        weblink: "www.meinrad.at"
      } 
    );

  restoredItems;
  sortedItems;
  myStorage:Storage;
  sortOption;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    //für local storage
    //this.storage.set('activities', this.activityItems); // einmalig laufen lassen, ab dann holen und füllen
    this.myStorage = storage;
    // !!! Der rest passiert im callback ionViewWillEnter() ... siehe unten
  }

  //############### LIFECYCLE callbacks
  ionViewWillEnter() { //systemcallback von IONIC!
    console.log("Entering ListView");
    this.restoreItems(this.myStorage);
  }

  ionViewWillLeave() {
    this.storage.set('sortoption', this.sortOption); //gewählte sortieroption speichern
  }

  //############### EVENT handler
  itemTapped(event, thatitem) { // wenn ein item in der liste angeklick't wird
    this.navCtrl.push(ItemDetailsPage, {
      item: thatitem,  complete:this.restoredItems  //, store: this.myStorage
    });
  }
    
  optionChecked(option) { // wenn eine option in der radiobuttonzeile angeclickt wird
    console.log("Option Changed: " + option);
    this.createList();
  }
    
  goToOptions() { // wenn der "options" button gedrückt wird
    alert ("optons will provide  SORT & SELECT CHOICES   but not yet available  :-(")
  }


  //############## STORAGE GET
  restoreItems(storage: Storage) {
    storage.get('activities').then((val) => { //key value pair holen  (speichern siehe unten)
      this.restoredItems = val;
  //    this.createList();
      this.restoreOptions(storage); // !! ineinander verschachtelte abfragen,  weil nur ganz innen alle daten fertig sind
 
      //nur weil ichs wissen will ...
      storage.length().then((val) => { 
        console.log("StorageLength");
        console.log(val);       
      });  
    });    
  }  

  restoreOptions(storage: Storage) {
    storage.get('sortoption')
    .then  ((val) => { //key value pair holen  (speichern siehe ionViewWilLeave)
      this.sortOption = val;
      this.createList();
      console.log("Restored Sort option2 " + this.sortOption);    
    });  
  };


  //############## Die sonstigen Methoden
  createList() {
    // this.restoreOptions(this.storage); --> nun genested in restoreItems !!
    //  do {} while (!this.sortOption); // wehe wehe .. killt den browser  
    console.log("Restored Sort option4 " + this.sortOption);
  
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    this.items = [];
    
    console.log("THIS2");
    console.log(this.restoredItems);

    this.sortList(this.sortOption);

    var i = 0;
    var numOfActivities = this.restoredItems.length;     
    for(i = 0; i < numOfActivities; i++) {
      this.items.push(
        {title:this.restoredItems[i].name,
          note:this.restoredItems[i].type,
          icon:this.icons[Math.floor(Math.random() * this.icons.length)],
          id: this.restoredItems[i].id
      });
    }

    //Auffüller damit man scroll sieht
    for(i++; i < 15; i++) {
      this.items.push({
        title: 'Aktivität ' + i,
        note: 'index' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)],
        id: i
      });
    }
  }

  sortList(keyToSortBy) {
    this.sortedItems = _.sortBy(this.restoredItems, keyToSortBy);
    console.log("Sorted by: " + keyToSortBy);
    console.log(this.sortedItems);
    this.restoredItems = this.sortedItems;
  }





  //############### OSOLETE
  async waitForOptionGEHTNICHT(val) { // um waitfor zu verwenden muß es wohl einen eigen funktion sein, die man als async definieren kann
    this.sortOption = await val;
    console.log("Restored Sort option1 " + this.sortOption);
  }

  waitForOption(val) { // Warten auf ergebnis des async task
  //  do {} while (!val);  // DAS geht schon gar nicht !!!
    this.sortOption = val;
    console.log("Restored Sort option1 " + this.sortOption);
  }
 

  
}

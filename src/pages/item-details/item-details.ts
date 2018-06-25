import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';   //STORAGE
import  _ from 'underscore';                //_.findWhere  etc.

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})

export class ItemDetailsPage {
  selectedItem: any;  // die ID des in der liste gewählten eintrages
  selectedItemDetails: any; //zwischenPuffer = referenz auf einzelnes item
  itemDetails:any ; //echte kopie des einzelitems, die in der maske weiterbearbeitet werden kann ohne die itemsList zu ändern
  itemsList: any; //lokale kopie aller gespeicherten Aktivitäten
  reducedList: any; //lokale kopie nach einem löschvorgang
  update: boolean = true;


  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item'); // das in der liste selektirte item
    this.itemsList = navParams.get('complete'); // die komplette itemsListe
//console.log(this.itemsList);
    this.selectedItemDetails = _.findWhere (this.itemsList, {id : this.selectedItem.id}); //objekt mit der gewünschten ID holen
//console.log(this.selectedItemDetails);
    this.itemDetails = Object.assign({}, this.selectedItemDetails ); //DAS macht eine echte kopie, statt einer referenz
  
    console.log("itemSelected " + this.selectedItem.title+ " id=" + this.selectedItem.id);
    console.log("itemDetails2 ");
    console.log(this.itemDetails);
  }

  getNextId() { // durchsucht die gesamte itemsList und findet den höchsten wert für ID
    var maxIdObject;
    console.log("GetNextId");
    maxIdObject = _.max(this.itemsList, function(activity){return activity.id;} );
    var newId =  maxIdObject.id + 1 ;

    console.log(newId);
    return newId;
  }

  btnNew() { //Löscht einträge in eingabemaske und bereitet neue ID vor
    this.clearFields(); //alles leer machen und neue ID vorereiten
    this.update = false;
  }

  btnUpdateSave() { // je nach einstellung wird dieselbe ID überschriben oder ein neuer eintrag erstellt
    console.log("Original");
    console.log(this.itemsList);

    if(this.update) {  //wenn  update dann vorher alten satz löschen
      this.deleteItemInList(this.itemDetails.id);
    }

    this.itemsList = this.itemsList.concat({  // Alles (neues Objekt) in die gesamttabelle kopieren
      //concat, das andere push :-) ...ginge auch mit push !
      id: this.itemDetails.id, 
      name: this.itemDetails.name, 
      type: this.itemDetails.type, 
      location: this.itemDetails.location, 
      time:this.itemDetails.time, 
      distance:this.itemDetails.distance, 
      descript:this.itemDetails.descript, 
      noecard:this.itemDetails.noecard,
      weblink: this.itemDetails.weblink
    });
    console.log("Updated/Saved");
    console.log(this.itemsList);
    
    this.storage.set('activities', this.itemsList).then(() => {; //ab ins geheime storage
      this.storage.length().then((val) => { 
        console.log(val);
      });
    });
    //alert("Aktivität gespeichert")
    // Hier müsste man jetzt automatisch in die liste zurückkehren und diese aktuell aufbauen
    this.navCtrl.pop();

  }

  btnDel(idToDelete) {
    this.deleteItemInList(idToDelete);
    this.storage.set('activities', this.itemsList).then(() => {; //ab ins geheime storage
      this.storage.length().then((val) => { 
        console.log(val);
      });
    });

    // Hier müsste man jetzt automatisch in die liste zurückkehren und diese aktuell aufbauen
    this.navCtrl.pop();
  }

  deleteItemInList(idToDelete) {
    console.log("DelID: " + idToDelete);
    this.reducedList = 
      _.without(this.itemsList, 
        _.findWhere(this.itemsList, {
        id: idToDelete })
      );
    console.log(this.reducedList);
    this.itemsList = this.reducedList; //zurückspeichern
    console.log(this.itemsList);  
  }

  clearFields() {
    this.itemDetails.id =  this.getNextId(); // neue ID vorbereiten 
    this.itemDetails.name = "";
    this.itemDetails.type = null;
    this.itemDetails.location = ""; 
    this.itemDetails.time = 0;
    this.itemDetails.distance = 0 ;
    this.itemDetails.descript = ""; 
    this.itemDetails.noecard = false;
    this.itemDetails.weblink = "";
  }

  btnAsNew() { // speichert bestehenden eintrag (eventuell verändert) als neuen eintrag (neue ID) ab
    this.update = false;
    this.itemDetails.id =  this.getNextId(); // neue ID vorbereiten
    this.btnUpdateSave();
  }
}

/*
* BOOLFLIX

- Milestone 1: 
Creare un layout base con una searchbar (una input e un button) in cui possiamo 
scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il 
bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. 
Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni 
film trovato:  
1. Titolo 
2. Titolo Originale 
3. Lingua Originale 
4. Voto (media) 
Utilizzare un template Handlebars per mostrare ogni singolo film trovato.

- Milestone 2: 
Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da 
permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, 
lasciando le restanti vuote (troviamo le icone in FontAwesome). Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze 
piene (o mezze vuote :P).
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome). 
 
Riferimento template:
● Titolo: Barnyard - Ritorno al cortile 
● Titolo Originale: Back at the Barnyard 
● Lingua:  (bandiera o lingua) 
● Voto:  (stelle da 1 a 5) 
● Tipo: Tv o Film 
 
Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca 
dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici).
*/

$(document).ready(function() {

  // Referenze
  var searchInput = $('.search-input');
  var searchBtn = $('.search-btn');
  var movieTvList = $('.movie-tv_container');
  var moviesAPI = 'https://api.themoviedb.org/3/search/movie';
  var tvAPI = 'https://api.themoviedb.org/3/search/tv';

  // Init Handlebars
  var source = $('#movie-tv_template').html();
  var template = Handlebars.compile(source);

  // Al click del bottone viene eseguito il seguente codice
  searchBtn.click(function(){
    printAPIMovies(moviesAPI, searchInput, movieTvList, template);
    printAPItv(tvAPI, searchInput, movieTvList, template);
  });

  // Al keyup del tasto Invio viene eseguito il seguente codice
  searchInput.keyup(function(event){
    if ( event.which == 13 || event.keyCode == 13 ) {
      printAPIMovies(moviesAPI, searchInput, movieTvList, template);
      printAPItv(tvAPI, searchInput, movieTvList, template);
    }
  });

}); // End document ready


/*******************
* FUNZIONI
*******************/

// Funzione che chiama API e stampa film
function printAPIMovies(newAPI, newInput, newList, template){
  // Azzeramento iniziale lista per visualizzare solo titoli cercati
  resetText(newList);
  // Titolo cercato
  var newSearch = newInput.val().trim().toLowerCase();
  // Validazione in caso di input vuoto
  if ( newSearch !== '' ) {
    // Chiamata AJAX
    $.ajax({
      url: newAPI,
      method: 'GET',
      data: {
        api_key: '6f57d63573fa7a5d41001c1a27914d68',
        query: newSearch,
        language: 'it-IT'
      },
      success: function(result){
        // Array contenente gli oggetti
        var objects = result.results;
        printMovie(objects, newList, template);
      }, // Fine success
      error: function(){
        console.log('Si è verificato un errore');
      } // Fine error
    }); // Fine chiamata AJAX
  } // Fine if
  else {
    newList.append('<span>Prego, inserire un titolo valido</span>');
    newInput.focus();
  } // Fine else
};

// Funzione che chiama API e stampa serie tv
function printAPItv(newAPI, newInput, newList, template){
  // Azzeramento iniziale lista per visualizzare solo titoli cercati
  resetText(newList);
  // Titolo cercato
  var newSearch = newInput.val().trim().toLowerCase();
  // Validazione in caso di input vuoto
  if ( newSearch !== '' ) {
    // Chiamata AJAX
    $.ajax({
      url: newAPI,
      method: 'GET',
      data: {
        api_key: '6f57d63573fa7a5d41001c1a27914d68',
        query: newSearch,
        language: 'it-IT'
      },
      success: function(result){
        // Array contenente gli oggetti
        var objects = result.results;
        printTV(objects, newList, template);
      }, // Fine success
      error: function(){
        console.log('Si è verificato un errore');
      } // Fine error
    }); // Fine chiamata AJAX
  } // Fine if
  else {
    newList.append('<span>Prego, inserire un titolo valido</span>');
    newInput.focus();
  } // Fine else
};

// Funzione reset markup
function resetText(newElement){
  newElement.text('');
};

// Funzione che converte numeri in icona fontawesome
function getStarsVote(num){
  // arrotondo numero per eccesso
  var newNum = Math.round(num) / 2;
  // definisco le icone
  var stars = '<i class="far fa-star"></i>';
  var starsVote = '<i class="fas fa-star"></i>';
  // variabile sulla quale costruisco il markup
  var vote = '';
  // ciclo for per assegnare al markup i numeri convertiti in stelle
  for ( var i = 0; i < 5; i++ ) {
    if ( newNum > i ) {
      vote = vote + starsVote;
    }
    else {
      vote = vote + stars;
    }
  }
  return vote;
};

// Funzione che converte lingua in bandiera corrispondente
function getLanguageFlag(language){
  // variabili sulle quali costruisco il markup
  var lang = [
    'en',
    'it'
  ];
  var flag = '';
  // avendo solo due bandiere a disposizione, se la lingua non corrisponde a una di queste viene visualizzata come testo
  if ( lang.includes(language) ) {
    flag = '<img class="language-flag" src="' + 'img/' + language + '.svg' + '" + alt="' + language + '">';
  }
  else {
    flag = language;
  }
  return flag;
};

function printMovie(objects, newList, template){
  // Validazione in caso di titolo non trovato
  if ( objects.length > 0 ) {
    // Ciclo for per definire gli oggetti e stamparli
    for ( var i = 0; i < objects.length; i++ ) {
      // dati degli oggetti
      var objectsInfo = objects[i];
      // copio i dati nei nuovi oggetti
      var itemToPrint = {
        itemTitle: objectsInfo.title,
        itemOriginalTitle: objectsInfo.original_title,
        itemOriginalLanguage: getLanguageFlag(objectsInfo.original_language),
        itemVote: getStarsVote(objectsInfo.vote_average),
        itemType: 'Film'
      }
      // Stampo i nuovi oggetti
      var html = template(itemToPrint);
      newList.append(html);
    } // Fine ciclo for
  } // Fine if
  else {
    newList.append('<span>Nessun film trovato</span><br>');
    newInput.select();
  } // Fine else
};

function printTV(objects, newList, template){
  // Validazione in caso di titolo non trovato
  if ( objects.length > 0 ) {
    // Ciclo for per definire gli oggetti e stamparli
    for ( var i = 0; i < objects.length; i++ ) {
      // dati degli oggetti
      var objectsInfo = objects[i];
      // copio i dati nei nuovi oggetti
      var itemToPrint = {
        itemTitle: objectsInfo.name,
        itemOriginalTitle: objectsInfo.original_name,
        itemOriginalLanguage: getLanguageFlag(objectsInfo.original_language),
        itemVote: getStarsVote(objectsInfo.vote_average),
        itemType: 'Serie TV'
      }
      // Stampo i nuovi oggetti
      var html = template(itemToPrint);
      newList.append(html);
    } // Fine ciclo for
  } // Fine if
  else {
    newList.append('<span>Nessuna serie TV trovata</span><br>');
    newInput.select();
  } // Fine else
};
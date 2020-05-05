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
              itemOriginalLanguage: objectsInfo.original_language,
              itemVote: objectsInfo.vote_average,
              itemType: 'Film'
            }
            // Stampo i nuovi oggetti
            var html = template(itemToPrint);
            newList.append(html);
          } // Fine ciclo for
        } // Fine if
        else {
          alert('Nessun titolo trovato');
          newInput.select();
        } // Fine else
      }, // Fine success
      error: function(){
        console.log('Si è verificato un errore');
      } // Fine error
    }); // Fine chiamata AJAX
  } // Fine if
  else {
    alert('Prego, inserire valore');
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
              itemOriginalLanguage: objectsInfo.original_language,
              itemVote: objectsInfo.vote_average,
              itemType: 'Serie TV'
            }
            // Stampo i nuovi oggetti
            var html = template(itemToPrint);
            newList.append(html);
          } // Fine ciclo for
        } // Fine if
        else {
          alert('Nessun titolo trovato');
          newInput.select();
        } // Fine else
      }, // Fine success
      error: function(){
        console.log('Si è verificato un errore');
      } // Fine error
    }); // Fine chiamata AJAX
  } // Fine if
  else {
    alert('Prego, inserire valore');
    newInput.focus();
  } // Fine else
};

// Funzione reset markup
function resetText(newElement){
  newElement.text('');
};
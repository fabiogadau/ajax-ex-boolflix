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

// Funzione che chiama API e stampa i film
function printAPIMovies(newAPI, newInput, newList, template){
  // Azzeramento iniziale movieList per visualizzare solo titoli cercati
  resetText(newList);
  // Titolo cercato
  var newSearch = newInput.val().trim().toLowerCase();
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
      // Array contenente i film
      var objects = result.results;
      // Ciclo for per definire gli oggetti di movies e stamparli
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
      }/// Fine ciclo for
    },
    error: function(){
      console.log('Si è verificato un errore');
    }
  }); // Fine chiamata AJAX
};

function printAPItv(newAPI, newInput, newList, template){
  // Azzeramento iniziale movieList per visualizzare solo titoli cercati
  resetText(newList);
  // Titolo cercato
  var newSearch = newInput.val().trim().toLowerCase();
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
      // Array contenente i film
      var objects = result.results;
      // Ciclo for per definire gli oggetti di movies e stamparli
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
      }/// Fine ciclo for
    },
    error: function(){
      console.log('Si è verificato un errore');
    }
  }); // Fine chiamata AJAX
};

function resetText(newElement){
  newElement.text('');
};
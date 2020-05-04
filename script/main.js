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
  var searchMovieInput = $('.search-movie_input');
  var searchMovieBtn = $('.search-movie_btn');
  var movieList = $('.movie-list');
  var moviesAPI = 'https://api.themoviedb.org/3/search/movie';

  // Init Handlebars
  var source = $('#movie-template').html();
  var template = Handlebars.compile(source);

  // Al click del bottone viene eseguito il seguente codice
  searchMovieBtn.click(function(){
    var newMovieSearch = searchMovieInput.val().trim().toLowerCase();
    // Chiamata AJAX
    $.ajax({
      url: moviesAPI,
      method: 'GET',
      data: {
        api_key: '6f57d63573fa7a5d41001c1a27914d68',
        query: newMovieSearch,
        language: 'it-IT'
      },
      success: function(result){
        // Array contenente i film
        var movies = result.results;
        // Ciclo for per definire gli oggetti di movies e stamparli
        for ( var i = 0; i < movies.length; i++ ) {
          // dati degli oggetti
          var movieInfo = movies[i];
          // copio i dati nei nuovi oggetti
          var movieToPrint = {
            movieTitle: movieInfo.title,
            movieOriginalTitle: movieInfo.original_title,
            movieOriginalLanguage: movieInfo.original_language,
            movieVote: movieInfo.vote_average
          }
          // Stampo i nuovi oggetti
          var html = template(movieToPrint);
          movieList.append(html);
        } // Fine ciclo for
      },
      error: function(){
        console.log('Si è verificato un errore');
      }
    }); // Fine chiamata AJAX
  });
  
}); // End document ready
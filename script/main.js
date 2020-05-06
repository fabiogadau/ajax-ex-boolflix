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

- Milestone 3: 
In questa milestone come prima cosa  faremo un refactor delle chiamate ajax 
creando un’unica funzione alla quale passeremo la url, la apy key, la query, il 
type, ecc… In questo modo potremo chiamare la ricerca sia con il keypress su 
enter che con il click. 
 
Poi, aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata 
dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella 
porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base 
delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la 
dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo 
link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi 
aggiungere la parte finale dell’URL passata dall’API.

- Milestone 4: 
Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, 
creando un layout completo simil-Netflix: 
● Un header che contiene logo e search bar 
● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma 
di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio 
la poster_path con w342) 
● Andando con il mouse sopra una card (on hover), appaiono le informazioni 
aggiuntive già prese nei punti precedenti più la overview 
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
    printAPIData(moviesAPI, searchInput, movieTvList, template, 'Film');
    printAPIData(tvAPI, searchInput, movieTvList, template, 'Serie TV');
  });

  // Al keyup del tasto Invio viene eseguito il seguente codice
  searchInput.keyup(function(event){
    if ( event.which == 13 || event.keyCode == 13 ) {
      printAPIData(moviesAPI, searchInput, movieTvList, template, 'Film');
      printAPIData(tvAPI, searchInput, movieTvList, template, 'Serie TV');
    }
  });

}); // End document ready


/*******************
* FUNZIONI
*******************/

// Funzione che chiama API e stampa film
function printAPIData(newAPI, newInput, newList, template, type){
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
         // Validazione e print
        if ( objects.length > 0 ) {
          printObjects(objects, newList, template, type);
        } // Fine if
        else {
          newList.append('<span>Nessun titolo trovato</span>');
          newInput.select();
        } // Fine else
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

// Funzione che stampa gli oggetti
function printObjects(objects, newList, template, type){
  // Ciclo for per definire gli oggetti e stamparli
  for ( var i = 0; i < objects.length; i++ ) {
    // dati degli oggetti
    var objectsInfo = objects[i];
    // variabili che assegneranno i titoli
    var title, originalTitle;
    // conditional che prende il titolo in caso di film o serie tv
    if ( type == 'Film' ) {
      title = objectsInfo.title;
      originalTitle = objectsInfo.original_title;
    }
    else if ( type == 'Serie TV' ) {
      title = objectsInfo.name;
      originalTitle = objectsInfo.original_name;
    }
    // copio i dati nei nuovi oggetti
    var itemToPrint = {
      itemTitle: title,
      itemOriginalTitle: originalTitle,
      itemOriginalLanguage: getLanguageFlag(objectsInfo.original_language),
      itemVote: getStarsVote(objectsInfo.vote_average),
      itemType: type,
      itemPoster: getPoster(objectsInfo.poster_path)
    }
    // Stampo i nuovi oggetti
    var html = template(itemToPrint);
    newList.append(html);
  } // Fine ciclo for
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

// Funzione che ottiene immagine corrispondente all'elemento
function getPoster(poster){
  // variabile che sarà l'immagine visualizzata
  var img;
  // conditional in caso di immagine non presente
  if ( poster == null ) {
    img = 'img/no-poster.png';
  }
  else {
    img = 'https://image.tmdb.org/t/p/w342' + poster;
  }
  return img;
};
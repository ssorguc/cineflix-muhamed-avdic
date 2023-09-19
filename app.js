"use strict";

//Globalne varijable
const arrows = document.querySelectorAll(".arrow");
const arrows_left = document.querySelectorAll(".arrow-left");
const movieLists = document.querySelectorAll(".movie-list");

const API_KEY = 'api_key=31acf177cdd17a054fb6326a70f96ec5';
const BASE_URL = 'https://api.themoviedb.org/3';
const POPULAR_URL = BASE_URL + '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&' + API_KEY;
const TOP_RATED_URL = BASE_URL + '/movie/top_rated?language=en-US&page=1%27&' + API_KEY;
const TRENDING_URL = BASE_URL + '/trending/movie/day?language=en-US5&' + API_KEY;

const POPULAR_URL_TV = BASE_URL + '/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&' + API_KEY;
const TOP_RATED_URL_TV = BASE_URL + '/tv/top_rated?language=en-US&page=1%27&' + API_KEY;
const TRENDING_URL_TV = BASE_URL + '/trending/tv/day?language=en-US5&' + API_KEY;

let isMovie = localStorage.getItem('movie');

//Funkcije
function getData(url, id) {
  fetch(url).then(res => res.json()).then(data => {
    listData(data.results, id);
  })
}

function openMovie(id, media_type, ElementID) {
  let listHTML = `
        <iframe src="https://vidsrc.to/embed/${media_type}/${id}" frameborder="0" allow="autoplay;" height="300" width="550" allowfullscreen></iframe>
    `;
  document.getElementById(ElementID).innerHTML = listHTML;
}

function listData(movieList, id) {
  document.getElementById(id).innerHTML = "";
  movieList.forEach(function(element) {
    if (element.media_type != "person") {
      let title = element.title
      let poster_path = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${element.poster_path}`;
      if (element.title === undefined) {
        title = element.name;
      }
      if (element.poster_path === null) {
        poster_path = "assets/image_not_found.png"
      }
      let listHTML = `
            <div class="movie-list-item">
                <img style="cursor: pointer;" onclick="saveData('${element.id}','${title}'); window.location.href='singlePage.html'" class="movie-list-item-image" src="${poster_path}">
                <span style="cursor: pointer;" onclick="saveData('${element.id}','${title}'); window.location.href='singlePage.html'"class="movie-list-item-title">${title}</span
            </div>
            `;
      document.getElementById(id).innerHTML += listHTML;
    }
  });
}

function searchBar(searchTerm) {
  document.getElementById("search-list").innerHTML = '';
  if (searchTerm.length > 2) {
    let url = 'https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1&query=' + searchTerm + '&api_key=31acf177cdd17a054fb6326a70f96ec5'
    fetch(url).then(res => res.json()).then(data => {
      document.getElementById("search-list").innerHTML = "";
      data.results.forEach(function(element) {
        if (element.media_type != "person") {
          let title = element.title
          let release_year = element.release_date;
          let poster_path = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${element.poster_path}`;
          if (element.title === undefined) {
            title = element.name;
            release_year = element.first_air_date;
          }
          if (element.poster_path === null) {
            poster_path = "assets/image_not_found.png"
          }
          let listHTML = `
                <div onclick="saveData('${element.id}','${title}'); window.location.href='singlePage.html'" class = "search-list-item">
                    <div class = "search-item-thumbnail">
                        <img src = "${poster_path}">
                    </div>
                    <div class = "search-item-info">
                        <h3>${title}</h3>
                        <p>${release_year.slice(0, 4)}</p>
                    </div>
                </div> 
                `;
          document.getElementById("search-list").innerHTML += listHTML;
        }
      });
    })
  }
}

function saveData(id, title) {
  localStorage.setItem("id", id);
  localStorage.setItem("title", title);
}

function fillPage() {
  let media_type = "";
  let id = "";
  let url2 = 'https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1&query=' + localStorage.getItem("title") + '&api_key=31acf177cdd17a054fb6326a70f96ec5'
  fetch(url2).then(res => res.json()).then(element2 => {
    media_type = element2.results[0].media_type;
    id = localStorage.getItem("id");
    let url = `https://api.themoviedb.org/3/${media_type}/${id}?language=en-US&api_key=31acf177cdd17a054fb6326a70f96ec5`
    fetch(url).then(res => res.json()).then(element => {
      let title = element.title
      let release_year = element.release_date;
      let poster_path = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${element.poster_path}`;
      let release_date = new Date(release_year).toString();
      if (element.title === undefined) {
        title = element.name;
        release_year = element.first_air_date;
      }
      if (element.poster_path === null) {
        poster_path = "assets/image_not_found.png"
      }
      let listHTML = `
        <div class = "movie-poster">
            <img src = "${poster_path}" alt = "movie poster">
        </div>
        <div class = "movie-info">
            <h1 class = "movie-title">${title}</h1>
            <br>
            <ul class = "movie-misc-info">
                <li class = "year">Year: ${release_year.slice(0, 4)}</li>
                <li class = "released">Released: ${release_date.slice(4, 15)}</li>
            </ul>
            <br>
            <p class = "plot"><b>Plot:</b> ${element.overview}</p>
        </div>
            `;
      openMovie(id, media_type, "openMovie");
      document.getElementById("result-grid").innerHTML = listHTML;
    })
  })
}

function setupMovie() {
  getData(POPULAR_URL, "popular");
  getData(TOP_RATED_URL, "top-rated");
  getData(TRENDING_URL, "trending");
  isMovie = true;
}

function setupTV() {
  getData(POPULAR_URL_TV, "popular");
  getData(TOP_RATED_URL_TV, "top-rated");
  getData(TRENDING_URL_TV, "trending");
  isMovie = false;
}


arrows.forEach((arrow, i) => {
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    clickCounter++;
    if (clickCounter < 10) {
      movieLists[i].style.transform = `translateX(${movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
        }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });
});

function setup() {
  if (isMovie === true) {
    setupMovie();
  } else {
    setupTV();
  }
}

arrows_left.forEach((arrow, i) => {
  arrow.addEventListener("click", () => {
    if (movieLists[i].computedStyleMap().get("transform")[0].x.value < 0) {
      movieLists[i].style.transform = `translateX(${movieLists[i].computedStyleMap().get("transform")[0].x.value + 300
        }px)`;
    }
  });
  arrow.addEventListener("mouseout", () => {
    if (movieLists[i].computedStyleMap().get("transform")[0].x.value > 0) {
      movieLists[i].style.transform = "translateX(0)";
    }
  });
});


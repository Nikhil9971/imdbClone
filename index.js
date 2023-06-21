const movieSearchBox = document.getElementById('movieSearchBox');
const searchList = document.getElementById('searchList');
const resultGrid = document.getElementById('resultGrid');
const favPost = document.querySelector(".favPost");



function refreshAll(){
    remove();
    localStorage.clear();
    location.reload();
}


const favList = localStorage.getItem("key1") ? JSON.parse(localStorage.getItem("key1")) : [] ;

if(favList != []){
    addSection();
}


async function loadMovies(searchTerm) {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=98662308`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hideSearchList');
        loadMovies(searchTerm);
    }
    else {
        searchList.classList.add('hideSearchList');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('searchListItem');
        if (movies[idx].Poster != "N/A") {
            moviePoster = movies[idx].Poster;
        }
        else {
            moviePoster = "no_image_available.jpeg";
        }
        movieListItem.innerHTML = `
        <div class="searchItemThumbnail">
            <img src = "${moviePoster}"> 
        </div>
        <div class="searchItemInfo">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

let details={};

function loadMovieDetails() {
    const searchListMovies = document.querySelectorAll('.searchListItem');
    searchListMovies.forEach(movie => {
        movie.addEventListener("click", async () => {
            searchList.classList.add('hideSearchList');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=98662308`);
            const movieDetails = await result.json();
            details = movieDetails;
            displayMovieDetails(movieDetails);
        })
    })
}


function displayMovieDetails(movieDetails) {
    let flag = 0;
    for(var i in favList){
        if(details.imdbID == favList[i].id){
            flag=1;
        }
    }
    if(flag==0){
        resultGrid.innerHTML = `
            <div class="moviePoster">
                <img src = "${movieDetails.Poster != "N/A" ? movieDetails.Poster : "no_image_available.jpeg"}" alt = "movie poster">
            </div>
            <div class="movieInfo">
                <h3 class="movieTitle">${movieDetails.Title}</h3>
                <ul class="movieMiscInfo">
                    <li class="year">${movieDetails.Year}</li>
                    <li class="rated">${movieDetails.Rated}</li>
                    <li class="released">${movieDetails.Released}</li>
                </ul>
                <p class="genre"><b>Genre:</b>${movieDetails.Genre}</p>
                <p class="writer"><b>Writers: </b></>${movieDetails.Writer}</p>
                <p class="actors"><b>Actors: </b>${movieDetails.Actors}</p>
                <p class="plot"><b>Plot: </b>${movieDetails.Plot}</p>
                <p class="language">Language: ${movieDetails.Language}</p>
                <p class="awards"><b><i class="fa-solid fa-award"></i></b>${movieDetails.Awards}</p>
                <button id="addToFavorite" onclick="add()">Add to favourites</button>
            </div>
            `;
    }
    else{
        resultGrid.innerHTML = `
            <div class="moviePoster">
                <img src = "${details.Poster != "N/A" ? details.Poster : "no_image_available.jpeg"}" alt = "movie poster">
            </div>
            <div class="movieInfo">
                <h3 class="movieTitle">${details.Title}</h3>
                <ul class="movieMiscInfo">
                    <li class="year">${details.Year}</li>
                    <li class="rated">${details.Rated}</li>
                    <li class="released">${details.Released}</li>
                </ul>
                <p class="genre"><b>Genre:</b>${details.Genre}</p>
                <p class="writer"><b>Writers: </b></>${details.Writer}</p>
                <p class="actors"><b>Actors: </b>${details.Actors}</p>
                <p class="plot"><b>Plot: </b>${details.Plot}</p>
                <p class="language">Language: ${details.Language}</p>
                <p class="awards"><b><i class="fa-solid fa-award"></i></b>${details.Awards}</p>
               
            </div>
            `;
            flag=0;
    }
}

window.addEventListener("click", (event) => {
    if (event.target.className != "formControl") {
        searchList.classList.add('hideSearchList');
    }
});

function fav(poster, title, year, rated, released, genre, writers, actors, plot, language, awards,id) {
    this.poster = poster;
    this.title = title;
    this.year = year;
    this.rated = rated;
    this.released = released;
    this.genre = genre;
    this.writers = writers;
    this.actors = actors;
    this.plot = plot;
    this.language = language;
    this.awards = awards;
    this.id = id;
}

function remove(){
    const div = document.querySelectorAll(".favItems");
    div.forEach((value)=>{
        value.remove();
    })
}

function addSection(){
    for(let i in favList){
        const outerDiv = document.querySelector(".favSection")
        const div = document.createElement("div");
        div.setAttribute("class","favItems");

        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("class","favPost");
        innerDiv.addEventListener("click",()=>{
            resultGrid.innerHTML = `
            <div class="moviePoster">
                <img src = "${favList[i].poster != "N/A" ? favList[i].poster : "no_image_available.jpeg"}" alt = "movie poster">
            </div>
            <div class="movieInfo">
                <h3 class="movieTitle">${favList[i].title}</h3>
                <ul class="movieMiscInfo">
                    <li class="year">${favList[i].year}</li>
                    <li class="rated">${favList[i].rated}</li>
                    <li class="released">${favList[i].released}</li>
                </ul>
                <p class="genre"><b>Genre:</b>${favList[i].genre}</p>
                <p class="writer"><b>Writers: </b></>${favList[i].writer}</p>
                <p class="actors"><b>Actors: </b>${favList[i].actors}</p>
                <p class="plot"><b>Plot: </b>${favList[i].plot}</p>
                <p class="language">Language: ${favList[i].language}</p>
                <p class="awards"><b><i class="fa-solid fa-award"></i></b>${favList[i].awards}</p>
               
            </div>
            `;
        })
        innerDiv.innerHTML = `<img src="${favList[i].poster}">`;
        div.append(innerDiv);
        const innerDiv2 = document.createElement("div");
        innerDiv2.setAttribute('id','favDetails');
        innerDiv2.innerHTML = `
            <div id="favTitle">${favList[i].title}</div>
            <div>${favList[i].year}</div>
        `;
        div.append(innerDiv2);
        const btn = document.createElement("button");
        btn.setAttribute("class","removeBtn");
        btn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        btn.addEventListener("click",()=>{
            favList.splice(i,1);
            localStorage.setItem("key1",JSON.stringify(favList));
            location.reload();

        });
        div.append(btn);
        outerDiv.append(div);
    }
}




function add() {
    const x = new fav(details.Poster, details.Title, details.Year, details.Rated, details.Released, details.Genre, details.Writer, details.Actors, details.Plot, details.Language, details.Awards, details.imdbID);
    favList.push(x);
    localStorage.setItem("key1",JSON.stringify(favList));
    const btn = document.getElementById("addToFavorite");
    btn.classList.add('hideSearchList');
    remove();
    addSection();
}




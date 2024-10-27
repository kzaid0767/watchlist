const form = document.querySelector('#form')
const resultsContainer = document.querySelector('#results')
const watchlistContainer = document.querySelector('#watchlist')
const watchlistPage = document.getElementById('watchlistBody')

const apiKey = '6910ebc2'

let tempArr = JSON.parse(localStorage.getItem("movies")) ? JSON.parse(localStorage.getItem("movies")) :[]
let detailedArr = []

//renders movies from localstorage if available
if(watchlistContainer){
    if(tempArr.length){
        render(tempArr)
    }
}

if(form){
    form.addEventListener('submit',handleFetch)
}

//Gets the search results
function handleFetch(e) {
    e.preventDefault()
    detailedArr = []
    const formdata = new FormData(form)
    const name = formdata.get('name')
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${name}`)
        .then(res => res.json())
        .then(data =>{
            if(data.Response){
                getMovieDetail(data.Search)
                } else{
                    alert(`${data.Error} Please try another search`)
                }})
        .catch(err=> resultsContainer.innerHTML = `
                <div class="tempDiv">
                    <p>Unable to complete the search. Please try another search.</p>
                </div>
            
            `)
    
}

//Fetches movie details from API
async function getMovieDetail(arr){
    for(let el of arr){
        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${el.imdbID}`)
        const data = await res.json()
        detailedArr.push(data)
    }   
    render(detailedArr)

}

//Event listeners to add and remove from local storage
document.addEventListener('click',handleClick)
if(watchlistPage){
    watchlistPage.addEventListener('click', handleClick)
}
function handleClick(e){
    let add = e.target.dataset.add
    let remove = e.target.dataset.remove
    if(add){
        let obj = detailedArr.filter(movie =>  movie.imdbID ===add)[0]
        tempArr.unshift(obj)
        localStorage.setItem("movies",JSON.stringify(tempArr))
    }
    if(remove){
        tempArr = tempArr.filter(movie =>  movie.imdbID !== remove)
        render(tempArr)
        localStorage.setItem("movies",JSON.stringify(tempArr))
    }
}

//Renders the movie array
function render(arr){
    let htmlString=''
    if(watchlistContainer){
        if(!arr.length){
            htmlString = `
                <div class="tempDiv">
                    <p>Your watchlist is empty</p>
                    <div class="emptyList">
                        <a href="./index.html"> <i class="fa-solid fa-circle-plus"></i> Let's add some movies!</a>
                    </div>
                </div>
            `
        }else {
            htmlString = arr.map(movie => `
                        <div class="each-movie">
                            <div class="pic-holder">
                                <img src="${movie.Poster}" alt="a poster of ${movie.Title}">
                            </div>
                            <div class="movie-details">
                                <div class="top">
                                    <h3>${movie.Title}</h3>
                                    <i class="fa-solid fa-star"></i>
                                    <p>${movie.imdbRating}</p>
                                </div>
                                <div class="mid">
                                    <p>${movie.Runtime}</p>
                                    <p id="genre">${movie.Genre}</p>
                                    <i class="fa-solid fa-circle-minus" data-remove="${movie.imdbID}"></i>
                                    <p>Watchlist</p>
                                </div>
                                <div class="bottom">
                                    <p>${movie.Plot}</p>
                                </div>
                            </div>
                        </div>
                `).join('')
        }
        watchlistContainer.innerHTML = htmlString
    } 
    if(resultsContainer){
        htmlString = arr.map(movie => `
                <div class="each-movie">
                    <div class="pic-holder">
                        <img src="${movie.Poster}" alt="a poster of ${movie.Title}">
                    </div>
                    <div class="movie-details">
                        <div class="top">
                            <h3>${movie.Title}</h3>
                            <i class="fa-solid fa-star"></i>
                            <p>${movie.imdbRating}</p>
                        </div>
                        <div class="mid">
                            <p>${movie.Runtime}</p>
                            <p id="genre">${movie.Genre}</p>
                            <i class="fa-solid fa-circle-plus" data-add="${movie.imdbID}"></i>
                            <p>Watchlist</p>
                        </div>
                        <div class="bottom">
                            <p>${movie.Plot}</p>
                        </div>
                    </div>
                </div>
        `).join('')
        resultsContainer.innerHTML = htmlString
    }
}




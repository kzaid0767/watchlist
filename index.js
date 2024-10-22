const form = document.querySelector('#form')
const resultsContainer = document.querySelector('#results')

let apiKey = '6910ebc2'



form.addEventListener('submit',handleFetch)

async function handleFetch(e) {
    e.preventDefault()
    const formdata = new FormData(form)
    const name = formdata.get('name')
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${name}`)
    const data = await res.json()
    console.log(data)
}
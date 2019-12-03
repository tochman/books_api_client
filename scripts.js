const apiUrl = 'http://localhost:3002/books'

const fetchData = async () => {
  let data = await (await fetch(apiUrl)).json()
  return data
}


const displayBooks = () => {
  let displayElement = document.getElementById('display')
  displayElement.innerHTML = ''
  fetchData().then((books) => {
    books.forEach(book => {
      const showDisplayElement = document.createElement('div')
      let html = `<p>${book.title} by ${book.author}</p>`

      showDisplayElement.innerHTML = html
      displayElement.appendChild(showDisplayElement)
    })
  })
}
const submitHandler = async () => {
  event.preventDefault()
  fetch('http://localhost:3002/books', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ author: event.target.author.value, title: event.target.title.value })
  }).then((resp) => {
    console.log(resp.json())
  })
}

document.addEventListener('DOMContentLoaded', () => {
  displayBooks()
})
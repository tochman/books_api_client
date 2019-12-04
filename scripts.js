const apiUrl = 'http://localhost:3002/books';

const fetchData = async () => {
  let data = await (await fetch(apiUrl, { credentials: 'include' })).json();
  return data
};

const displayBooks = () => {
  let displayElement = document.getElementById('display');
  displayElement.innerHTML = '';
  fetchData().then((books) => {
    books.forEach(book => {
      const showDisplayElement = document.createElement('div');
      let html = `<p>The book ${book.title}, is written by ${book.author}</p>`;

      showDisplayElement.innerHTML = html;
      displayElement.appendChild(showDisplayElement)
    })
  })
};
const submitHandler = async () => {
  event.preventDefault();
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
};

let connection = new WebSocket('ws://localhost:8080'); // open the connection
connection.addEventListener('message', message => {
  let alerts = document.getElementsByClassName('alert');
  while (alerts[0]) {
    alerts[0].parentNode.removeChild(alerts[0]); // verwijder alle zichtbare meldingen
  }
  let incomingMessage = {};
  try {
    incomingMessage = JSON.parse(message.data) // kijk of we het inkomende bericht kunnen parsen
  } catch {
    incomingMessage.message = message.data // anders gebruiken we de string
  }

  let headerElement = document.getElementById('header');
  let incomingMessageDisplay = document.createElement('div');
  let htmlTemplate = `
    <div class="alert">
      <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
      ${incomingMessage.message}
    </div>`;
  incomingMessageDisplay.innerHTML = htmlTemplate;
  headerElement.insertAdjacentElement('afterend', incomingMessageDisplay);
  if (incomingMessage.status === 'success') {
    // here we are checking if the message was sent as part of the book creation flow.
    // if it is, we are fetching the books anew.
    displayBooks()
  }
});

document.addEventListener('DOMContentLoaded', () => {
  displayBooks()
});
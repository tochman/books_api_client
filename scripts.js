const apiUrl = 'http://localhost:3002/books';

const fetchData = async () => {
  return await (await fetch(apiUrl, {credentials: 'include'})).json();
};

const displayBooks = () => {
  let displayElement = document.getElementById('display');
  displayElement.innerHTML = '';
  fetchData().then((books) => {
    books.forEach(book => {
      const showDisplayElement = document.createElement('div');
      showDisplayElement.innerHTML = `<p>${book.title} by ${book.author}</p>`;
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
    alerts[0].parentNode.removeChild(alerts[0]); // remove any alerts already displayed
  }
  let incomingMessage = {};
  try {
    incomingMessage = JSON.parse(message.data) // check if the incoming message can be parsed
  } catch {
    incomingMessage.message = message.data // otherwise use the string
  }

  let headerElement = document.getElementById('header'); // get hold of the #header element
  let incomingMessageDisplay = document.createElement('div'); // create a new div that will be used to display the message
  incomingMessageDisplay.innerHTML = `
    <div class="alert">
      <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
      ${incomingMessage.message}
    </div>`;
  headerElement.insertAdjacentElement('afterend', incomingMessageDisplay); // add the message to the UI below the #header element
  if (incomingMessage.status === 'success') {
    // here we are checking if the message was sent as part of the book creation flow.
    // if it is, we are fetching the books anew.
    displayBooks()
  }
});

document.addEventListener('DOMContentLoaded', () => {
  displayBooks()
});

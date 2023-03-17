import bot from './assets/bot.svg';   // import bot image
import user from './assets/user.svg';     // import user image

const form = document.querySelector('form');      // get form element
const chatContainer = document.querySelector('#chat_container');      // get chat container element

let loadInterval;   // variable to store setInterval function for loader

function loader(element)    // function to show loader in chat container
{
  element.textContent = '';   // clear element text content

  loadInterval = setInterval(() =>    // set interval to add dots to element
  {
    element.textContent += '.';   // add dot to element text content

    if (element.textContent === '....')     // if element text content is equal to .... then clear element text content
    {
      element.textContent = '';   // clear element text content 
    }

  }, 300);      // set interval to 300ms
}

function typeText(element, text)    // function to type text in element with 20ms interval
{
  let i = 0;    // variable to store index of text

  let interval = setInterval(() =>    // set interval to type text in element
  {
    if(i < text.length)     // if index is less than text length
    {
      element.innerHTML += text.charAt(i);     // add character at index to element innerHTML
      i++;      // increment index
    }
    else{   // if index is equal to text length
      clearInterval(interval);    // clear interval to stop typing
    }
  }, 20);     // set interval to 20ms
}

function generateUniqueId()     // function to generate unique id
{
  const timestamp = Date.now();     // get current timestamp in milliseconds
  const randomNumber = Math.random();     // get random number between 0 and 1 (not including 1)
  const hexadecimalString = randomNumber.toString(16);      // convert random number to hexadecimal string (base 16)

  return `id-${timestamp}-${hexadecimalString}`;    // return unique id string
}

function chatStripe (isAi, value, uniqueId)   // function to create chat stripe
{
  return (    // return chat stripe html
    `
    <div class="wrapper ${isAi && 'ai'}">   
      <div class="chat">    
        <div class="profile">     
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
      <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>

    `
  )
}

const handleSubmit = async (e) => {     // function to handle form submit
  e.preventDefault();     // prevent default form submit action

  const data = new FormData(form);     // get form data

  // user chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));     // add user chat stripe to chat container

  form.reset();     // reset form

  // bot chat stripe
  const uniqueId = generateUniqueId();     // generate unique id for bot chat stripe
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);     // add bot chat stripe to chat container

  chatContainer.scrollTop = chatContainer.scrollHeight;     // scroll chat container to bottom

  const messageDiv = document.getElementById(uniqueId);     // get bot chat stripe element

  loader(messageDiv);     // show loader in bot chat stripe

  //fetch data from server

  const response = await fetch('http://codenexus.onrender.com/', 
  {     // fetch data from server
    method: 'POST',     // set method to POST
    headers: {      // set headers
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })     // set body to form data
  })

  clearInterval(loadInterval);    // clear loadInterval to stop loader
  messageDiv.innerHTML = '';      // clear bot chat stripe innerHTML

  if(response.ok)
  {
    const data = await response.json();    // get response data
    const parsedData = data.bot.trim();    // get bot response

    typeText(messageDiv, parsedData);     // type bot response in bot chat stripe
  } else {
    const err = await response.text();    // get error response

    messageDiv.innerHTML = "Something went wrong!";

    alert(err);     // show error alert
  }
}

form.addEventListener('submit', handleSubmit);     // add event listener to form submit
form.addEventListener('keyup', (e) => {     // add event listener to form keyup
  if(e.keyCode === 13)    // if key code is equal to 13 (enter key)
  {
    handleSubmit(e);    // call handleSubmit function
  }
});

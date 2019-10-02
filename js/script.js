window.onload = function() {
  const wait = time => new Promise(resolve => setTimeout(resolve, time));

  var messages = document.querySelectorAll('.message');
  var messageIndex = 0;
  var lastMessage = '';

  function displayMessage(item, index) {
    message = item.innerHTML;
    messageBody = item.firstChild;
    messageBody.classList.add('hide');
    item.innerHTML += '<span class="bulls"><span>&bull;</span><span>&bull;</span><span>&bull;</span></span>';
    item.classList.add('typing');
    item.classList.remove('hide');

    wait(message.length * 25).then (() => {
      bulls = item.lastChild;
      item.innerHTML = message;
      item.classList.remove('typing');
      item.classList.add('sent');
    });
  }

  var displayMessages = function() {
    var message = messages[messageIndex];
    var nextMessage = messages[messageIndex + 1];
    if (!message) return;
    lastMessage = messages[messageIndex].innerHTML;
    displayMessage(message, messageIndex);
    ++messageIndex;

    setTimeout(displayMessages, (message.innerHTML.length * 25));
  }

  displayMessages();
}
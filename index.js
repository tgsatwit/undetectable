var myHeaders = new Headers();
myHeaders.append("api-key", "1695390264322x180995456079005020");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "content": "YOUR TEXT GOES HERE.",
  "readability": "High School",
  "purpose": "General Writing",
  "strength": "More Human"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.undetectable.ai/submit", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

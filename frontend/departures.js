var xhttp = new XMLHttpRequest();
 
xhttp.open('GET', 'http://localhost:3300/postcode/N44EB', true);
 
xhttp.setRequestHeader('Content-Type', 'application/json');
 
xhttp.onload = function() {
    var bsList = JSON.parse(xhttp.response);
    console.log(bsList);
    document.querySelector("#busid1").innerHTML = bsList[0].id;

}
 
xhttp.send();
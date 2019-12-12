function postcodeToBSList() {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', 'http://localhost:3300/postcode/N44EB', true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        var bsList = JSON.parse(xhttp.response);
        console.log(bsList);
        document.querySelector("#busid1").innerHTML = bsList[0].commonName + " " + bsList[0].id[bsList[0].id.length - 1];
        document.querySelector("#busid2").innerHTML = bsList[1].commonName + " " + bsList[1].id[bsList[1].id.length - 1];

        var busList1 = document.querySelector("#busList1");

        for (var i = 0; i < bsList[0].arrivals.length; i++) {
            var newItem = document.createElement("li");
            var bus = bsList[0].arrivals[i];
            newItem.innerHTML = bus.line + " to " + bus.destination + " " + bus.relArrival;
            busList1.insertBefore(newItem, busList1.childNodes[i].nextSibling);
        }

        var busList2 = document.querySelector("#busList2");

        for (var i = 0; i < bsList[1].arrivals.length; i++) {
            var newItem = document.createElement("li");
            var bus = bsList[1].arrivals[i];
            newItem.innerHTML = bus.line + " to " + bus.destination + " " + bus.relArrival;
            busList2.insertBefore(newItem, busList2.childNodes[i].nextSibling);
        }
    }

    xhttp.send();
}
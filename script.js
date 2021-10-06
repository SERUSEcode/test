async function getCountryJson(){ //Hämtar json data ifrån land filen och sedan skickar tillbaka json arrayen
    const response = await fetch('land.json');
    const data = await response.json();

    return data;
}

async function getCitiesJson(){//Hämtar json data ifrån stan filen och sedan skickar tillbaka json arrayen
    const response = await fetch('stad.json');
    const data = await response.json();

    return data;
}

//Skapar meny och knappar 
window.onload = async function onload() {
    
    //Hämtar json data
    const countryArray = await getCountryJson();
    
    //Skapar menyn
    let createMenu = document.createElement("nav");
    createMenu.id = "menu";
    document.body.appendChild(createMenu);

    //loopar igenom för att skriva ut alla länder och knappar till länderna 
    for (let i = 0; i < countryArray.length; i++) {

        let newDiv = document.createElement('div');
        newDiv.id = "visitedContainer" + countryArray[i].id;
        document.getElementById("menu").appendChild(newDiv);

        //skapar en ny a och skickar ut alla länder i menyn
        let newLinkCountry = document.createElement('a'); //Skapar ny link
        newLinkCountry.id = "linkID" + countryArray[i].id; //Lägger till id till nya a elementet
        newLinkCountry.setAttribute("onclick","showCity(this.id)"); //Lägger till onklick på a elementet
        newLinkCountry.innerHTML = countryArray[i].countryname; //Lägger till text i a elementet
        document.getElementById("visitedContainer" + countryArray[i].id).appendChild(newLinkCountry); //Lägger in det i html

        let newLink = document.createElement("a");
        newLink.innerHTML = "Städer" + "&nbsp" + "jag" + "&nbsp" + "besökt";
        newLink.type = "submit";
        newLink.id = "visitedButtonID" + countryArray[i].id;
        newLink.setAttribute("onclick","visitedSite(this.id)");
        document.getElementById("visitedContainer" + countryArray[i].id).appendChild(newLink);
    }
}

//Skapar div, och text för städerna
async function showCity(idButton){

    //Hämtar JSON filer
    const countryArray = await getCountryJson();
    const citiesArray = await getCitiesJson();

    //Skapar ny div om det inte redan finns
    var myElement = document.getElementById('output');
    if(myElement === null) {
        let newDiv = document.createElement("div");
        newDiv.id = "output";
        document.body.appendChild(newDiv);
    }
    
    document.getElementById('output').innerHTML = ""; //Tar bort alla städer innan det skickas till sidan

    let newTitleText = document.createElement('p');
    document.getElementById("output").appendChild(newTitleText); //Lägger in det i html

    for (let i = 0; i < citiesArray.length; i++) {
        
        if ("linkID" + citiesArray[i].countryid == idButton) {
            let newText = document.createElement('p'); //Skapar ny p element
        
            newText.id = "cityButtonID" + citiesArray[i].id; //Lägger till id till nya p elementet
            newText.setAttribute("onclick","showInfo(this.id)"); //Lägger till onklick på p elementet
            newText.innerHTML = citiesArray[i].stadname; //Lägger till text i p elementet
            document.getElementById("output").appendChild(newText); //Lägger in det i html
        }
    }
}

//Visar information om klickad stad
async function showInfo(cityID){

    //Hämtar data för båds json filerna 
    const countryArray = await getCountryJson();
    const citiesArray = await getCitiesJson();
    let coutryID = 0;

    //Skapar en div för all data att samlas i 
    var myElement = document.getElementById('information');
    if(myElement === null) {
        let newDiv = document.createElement("div");
        newDiv.id = "information";
        document.body.appendChild(newDiv);
    }

    cityID = cityID.replace(/[^0-9]/g, ''); //Tar bort alla bokstäver så jag får id
    cityID = cityID - 1; //Av någon anledning så får jag siffra med ett i förhögt tal så ska komm in 1 men får 2. Ska felsöka vidare men hittade inget första 2 timmarna

    document.getElementById('information').innerHTML = ""; //Tar bort alla städer innan det skickas till sidan


    //Skapar knap för att spara citiesen
    let newButton = document.createElement("button");
    newButton.innerHTML = "Besökt";
    newButton.type = "submit";
    newButton.id = "infoButtonID" + citiesArray[cityID].id;
    newButton.setAttribute("onclick","saveCity(this.id)");
    document.getElementById("information").appendChild(newButton);


    //Skapar texten för information av citiesen
    let newText = document.createElement('p'); //Skapar ny p element
    newText.id = citiesArray[cityID].stadname; //Lägger till id till nya p elementet
    newText.innerHTML = citiesArray[cityID].stadname + " är en stad med " + citiesArray[cityID].population + " antal invånare"; //Lägger till text i p elementet
    document.getElementById("information").appendChild(newText); //Lägger in det i html
}

function saveCity(infoButtonID){

    //Allt nedan används för att uppdatera localstoradge 
    infoButtonID = infoButtonID.replace(/[^0-9]/g, ''); //Tar bort alla bokstäver så jag får id
    var new_data = infoButtonID;

    //Om arrayen är i localstorage är tom så fyller den
    if (localStorage.getItem('info') == null) {
        localStorage.setItem('info', '[]');
    }

    //skickar in ny data till localstorage
    var old_data = JSON.parse(localStorage.getItem('info'));
    if(old_data != null) {
        old_data.push(new_data);
    }

    localStorage.setItem('info', JSON.stringify(old_data));
}

//Skapar och vissar alla städer man har klickat i som sed
async function visitedSite(countryID){
    
    //Hämtar data för båda json filerna 
    const countryArray = await getCountryJson();
    const citiesArray = await getCitiesJson();

    //Skapar variablar för senare kalkylationer
    let citieID = 0;
    let totalPopulation = 0;

    var retriveData = localStorage.getItem("info");
    var localstoradgeArray = JSON.parse(retriveData);

    countryID = countryID.replace(/[^0-9]/g, '');//Tar bort alla bokstäver så jag får id
    citieID = countryID; //stämmer när man ska skriva ut städer sen 
    countryID = countryID - 1; //Gör så att man kan skriva ut länderna i texten

    var myElement = document.getElementById('visitedSites'); 
    if(myElement === null) {
        let newDiv = document.createElement("div");
        newDiv.id = "visitedSites";
        document.body.appendChild(newDiv);
    }

    document.getElementById('visitedSites').innerHTML = ""; //Tar bort alla städer innan det skickas till sidan

    //Skapar ny text och knappar
    let newTextTitle = document.createElement("p");
    newTextTitle.innerHTML = "Besökta städer i " + countryArray[countryID].countryname;
    document.getElementById("visitedSites").appendChild(newTextTitle);

    let newButton = document.createElement("button");
    newButton.innerHTML = "Rensa historik";
    newButton.type = "submit";
    newButton.id = "infoButtonID";
    newButton.setAttribute("onclick","clearcities()");
    document.getElementById("visitedSites").appendChild(newButton);

    for (let i = 0; i < localstoradgeArray.length; i++) {
        
        for (let x = 0; x < citiesArray.length; x++) {

            if (citiesArray[x].id == localstoradgeArray[i]) {

                if (citiesArray[x].countryid == citieID) {

                    let newTextCities = document.createElement('p'); 
                    newTextCities.innerHTML = citiesArray[x].stadname; 
                    document.getElementById("visitedSites").appendChild(newTextCities);

                    totalPopulation += citiesArray[x].population;
                }
            }
        }
    }

    let newTextPopulation = document.createElement('p'); 
    newTextPopulation.innerHTML = "Totalt antal invånare: " + totalPopulation; 
    document.getElementById("visitedSites").appendChild(newTextPopulation)
}

//Rensar localStorage
function clearcities() {
    localStorage.clear();
}
// Sélectionnez les éléments HTML
const iconAgenda = document.getElementById("iconAgenda");
const popupAgenda = document.getElementById("popupAgenda");
const closeBtnAgenda = document.getElementById("closeAgenda");
const scheduleBody = document.getElementById("schedule-body");

const iconConv = document.getElementById("iconConv");
const popupConv = document.getElementById("popupConv");
const closeBtnConv = document.getElementById("closeConv");

const iconVerdict = document.getElementById("iconVerdict");
const popupVerdict = document.getElementById("popupVerdict");
const closeBtnVerdict = document.getElementById("closeVerdict");

const iconSearch = document.getElementById("iconSearch");
const popupSearch = document.getElementById("popupSearch");
const closeBtnSearch = document.getElementById("closeSearch");

const conversationList = document.getElementById("conversation-list");
const chatContainer = document.getElementById("chat-container");

const loupeIcon = document.getElementById("searchImage");
const searchInput = document.getElementById("search-input");

const verdictButtonInnocent = document.getElementById(
  "verdict-button-innocent"
);
const verdictButtonDrague = document.getElementById("verdict-button-drague");
const verdictButtonHarcelementt = document.getElementById(
  "verdict-button-harcelement"
);
const verdictButtonAgression = document.getElementById(
  "verdict-button-agression"
);

const popupFinish = document.getElementById("popupFinish");

let data = {}; // Utilisez let au lieu de this.data

// Fonction pour générer la liste des conversations
function generateConversationList() {
  conversationList.innerHTML = ""; // Effacez la liste existante
  // Parcourez les données JSON pour générer les conversations
  data["case1"].conversations.forEach((conversationName) => {
    const name =
      conversationName[0]["sender"] + " " + conversationName[1]["sender"];
    const conversation = document.createElement("li");
    conversation.classList.add("conversation-item");
    conversation.textContent = name;
    conversation.index = data["case1"].conversations.indexOf(conversationName);
    conversationList.appendChild(conversation);
  });
  conversationList.appendChild(closeBtnConv);
}

// Fonction pour afficher les messages d'une conversation
function displayMessages(conversationIndex) {
  chatContainer.innerHTML = ""; // Effacez le contenu précédent du conteneur de chat

  // Récupérez les messages de la conversation sélectionnée
  const conversation = data["case1"].conversations[conversationIndex];

  const messageGroupContainer = document.createElement("div");
  messageGroupContainer.classList.add("conversation-messages");

  // Affichez chaque message dans la conversation
  conversation.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>Expéditeur : </strong>${message.sender}<br><br>${message.message}<br><br><strong>${message.date}</strong>`;
    messageGroupContainer.appendChild(messageElement);
  });

  // Ajoutez la conversation au conteneur de chat
  chatContainer.appendChild(messageGroupContainer);
}

// Événement au clic sur l'icône d'agenda
iconAgenda.addEventListener("click", () => {
  const edtData = data["case1"].edt;

  // Afficher la popup de l'agenda
  popupAgenda.style.display = "block";
  const scheduleBody = document.getElementById("schedule-body");
  const daysOfWeek = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
  scheduleBody.innerHTML = "";

  // Boucle pour chaque heure (8h à 17h)
  for (let hour = 8; hour <= 17; hour++) {
    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    if (hour === 8) {
      timeCell.textContent = `${hour}h`;
    } else {
      timeCell.textContent = `${hour}:00`;
    }
    row.appendChild(timeCell);

    for (const day of daysOfWeek) {
      const dayData = edtData[day];
      if (dayData && dayData["événement"]) {
        const event = dayData["événement"].find((event) => {
          const eventStartTime = parseInt(event.name.match(/^\d+/)[0], 10);
          return eventStartTime === hour;
        });

        if (event) {
          // S'il y a un événement à cette heure et jour, l'ajouter à la cellule
          const eventCell = document.createElement("td");
          eventCell.innerHTML = `${event.name} <br><br> </strong> ${event.participant} </strong>`;
          row.appendChild(eventCell);
        } else {
          // S'il n'y a pas d'événement, ajouter une cellule vide
          row.innerHTML += "<td></td>";
        }
      }
    }

    scheduleBody.appendChild(row);
  }
});

// ...

// Événement pour la sélection de conversation
conversationList.addEventListener("click", (e) => {
  if (e.target.classList.contains("conversation-item")) {
    // Mettre en surbrillance la conversation sélectionnée
    const conversationItems =
      conversationList.querySelectorAll(".conversation-item");
    conversationItems.forEach((item) => item.classList.remove("active"));
    e.target.classList.add("active");

    // Afficher les messages de la conversation sélectionnée
    const selectedConversation = e.target.index;
    displayMessages(selectedConversation);
  }
});
iconVerdict.addEventListener("click", () => {
  popupVerdict.style.display = "block";

  const vilain = data["case1"].verdict.vilain;
  console.log(vilain);
  document.getElementById("vilain-name").innerHTML = vilain;
});

// Événement pour afficher la fenêtre de conversation
iconConv.addEventListener("click", () => {
  scheduleBody.innerHTML = "";
  popupConv.style.display = "flex";
});

iconSearch.addEventListener("click", () => {
  popupSearch.style.display = "flex";
});

// Événement pour fermer l'agenda
closeBtnAgenda.addEventListener("click", () => {
  popupAgenda.style.display = "none";
});

// Événement pour fermer la fenêtre de conversation
closeBtnConv.addEventListener("click", () => {
  popupConv.style.display = "none";
});

closeBtnVerdict.addEventListener("click", () => {
  popupVerdict.style.display = "none";
});

closeBtnSearch.addEventListener("click", () => {
  popupSearch.style.display = "none";
});

// Charger le fichier JSON (utilisez le chemin approprié vers votre fichier JSON)
fetch("../json/case.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData; // Mettez à jour les données avec le JSON chargé
    generateConversationList(); // Générez la liste des conversations initiale
  })
  .catch((error) =>
    console.error("Erreur lors du chargement du fichier JSON : ", error)
  );

verdictButtonInnocent.addEventListener("click", () => {
  setFinish("innocent", data["case1"].verdict.inocent);
});
verdictButtonDrague.addEventListener("click", () => {
  setFinish("drague", data["case1"].verdict.drague);
});
verdictButtonHarcelementt.addEventListener("click", () => {
  setFinish("harcelement", data["case1"].verdict.harcelement);
});
verdictButtonAgression.addEventListener("click", () => {
  setFinish("agression", data["case1"].verdict.agression);
});

function setFinish(title, text) {
  popupFinish.style.display = "flex";
  document.getElementById("finish-title").innerHTML =
    "Vous avez choisit : " + title;

  document.getElementById("finish-titleContent").innerHTML = text.titre;
  document.getElementById("finish-content").innerHTML = text.text;
}

loupeIcon.addEventListener("click", () => {
  const searchValue = searchInput.value;
  const temoignages = data["case1"].temoignages;

  const filteredTemoignages = temoignages.findIndex(
    (temoignage) => temoignage.name.toUpperCase() === searchValue.toUpperCase()
  );

  document.getElementById("temoin-container-title").innerHTML =
    "temoignage de : " + temoignages[filteredTemoignages].name;

  document.getElementById("temoin-container-text").innerHTML =
    temoignages[filteredTemoignages].text;
});

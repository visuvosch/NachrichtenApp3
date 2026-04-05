const apikey = 'f3101490673fab5e28de865714bfd957';
let aktuelleSprache = 'de'; // Speichert die aktuelle Sprache
////////////////////////////////////////////////////////////////////////////////////

async function getNews(category = 'general') {
    
    const container = document.getElementById('news-container');
    var sprache = aktuelleSprache;
    

    // 1. Container leeren, bevor neue News geladen werden //////////////
    container.innerHTML = '<p style="text-align:center;">Lade News...</p>';

    const country = aktuelleSprache === 'de' ? 'de' : 'us';
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${sprache}&country=${country}&apikey=${apikey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Falls mal keine News kommen oder ein Fehler auftritt
        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = '<p>Keine Nachrichten gefunden.</p>';
            return;
        }

        // News rendern
        renderNews(data.articles);
    }catch (error) {
       container.innerHTML = '<p>Fehler beim Laden der News.</p>';
       console.error(error);
   }
}// Ende der getNews Funktion
// Hilfsfunktion für die Buttons////////////////////////////////////////////////////
function changeCategory(cat) {
    getNews(cat);
}
////////////////////////////////////////////////////////////////////////////
// Funktion zum Wechsel der Sprache
function ändereSprache(sprache) {
    aktuelleSprache = sprache;
    // Buttons aktualisieren
    const deutschBtn = document.getElementById('deutschButton');
    const englischBtn = document.getElementById('englischButton');
    
    if (sprache === 'de') {
        deutschBtn.style.backgroundColor = '#007bff';
        englischBtn.style.backgroundColor = '#333';
    } else {
        englischBtn.style.backgroundColor = '#007bff';
        deutschBtn.style.backgroundColor = '#333';
    }
    
    // News neu laden
    getNews();
}

// Erster Aufruf beim Laden der Seite (startet mit Deutsch)///////////////////////////////////////////
getNews();




// Button-Styling initialisieren//////////////////////////////////////////////////////////////
document.getElementById('deutschButton').style.backgroundColor = '#007bff';

// ///////Diese Funktion wird aufgerufen, wenn man auf "Suchen" klickt /////////////////////




async function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query.trim() === "") return; // Suche nicht starten, wenn das Feld leer ist

    const container = document.getElementById('news-container');
    container.innerHTML = '<p style="text-align:center;">Suche nach "' + query + '"...</p>';

    // WICHTIG: Hier nutzen wir den /search Endpunkt statt /top-headlines
    const country = aktuelleSprache === 'de' ? 'de' : 'us';

   //url für Suche//
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=${aktuelleSprache}&country=${country}&max=10&apikey=${apikey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderNews(data.articles); // Wir lagern das Anzeigen in eine eigene Funktion aus
    } catch (error) {
        console.error("Suche fehlgeschlagen:", error);
        container.innerHTML = '<p>Fehler bei der Suche aufgetreten.</p>';
    }
}

// Damit wir Code sparen, erstellen wir eine extra Funktion zum Anzeigen der Karten////////////////
function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = '';

    if (!articles || articles.length === 0) {
        container.innerHTML = '<p>Keine Treffer für diesen Suchbegriff.</p>';
        return;
    }

    const cards = [];
    articles.forEach(article => {
        // Datum und Zeit formatieren basierend auf der Sprache
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const locale = aktuelleSprache === 'de' ? 'de-DE' : 'en-US';
        const formattedDate = new Date(article.publishedAt).toLocaleString(locale, dateOptions);

        // Den Namen der Quelle holen (z.B. "Spiegel" oder "Tagesschau")
        const sourceName = article.source.name || "Unbekannt";

        const card = `
        <div class="news-card">
            <div class="image-container">
                <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="News">
                <span class="source-badge">${sourceName}</span>
            </div>
            <div class="news-card-content">
                <span class="news-date">${formattedDate} Uhr</span>
                <h3>${article.title}</h3>
                <p>${article.description ? article.description.substring(0, 100) : 'Keine Beschreibung'}...</p>
                <a href="${article.url}" target="_blank" class="news-link">Mehr lesen →</a>
                <hr>
            </div>
        </div>`;
        cards.push(card);
    });
    container.innerHTML = cards.join('');
} // Ende der renderNews Funktion




//////////////////////////////////////////////////////////////////////////////////////////////////        
function zurueckNachOben() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}      
    
 ////////////////////////////Ende der Nachrichten2.js Datei //////////////////////////////////////////                    
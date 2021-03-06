// Load a book from disk
function loadBook(filename, displayName) {
    let currentBook = "";
    let url = "books/" + filename;

    // Reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchStat").innerHTML = "";
    document.getElementById("keyword").innerHTML = "";

    // Create a server request to load our book
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocStats(currentBook);

            // Remove line breaks and carriage returns and replace with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            const el = document.getElementById("fileContent");
            el.scrollTop = 0;
        }
    };
}

// Get the stats for the book.
function getDocStats(fileContent) {
    const docLength = document.getElementById("docLength");
    const wordCount = document.getElementById("wordCount");
    const charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    let uncommonWords = [];

    // Filter out the uncommon words.
    uncommonWords = filterStopWords(wordArray);

    // Count every word in the wordArray.
    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    // Sort the array.
    let wordList = sortProperties(wordDictionary);

    // Return the top 5 words.
    const top5Words = wordList.slice(0, 6);

    // Return teh least 5 words.
    const least5Words = wordList.slice(-6, wordList.length);

    // Write the values to the page.
    ulTemplate(top5Words, document.getElementById("mostUsed"));
    ulTemplate(least5Words, document.getElementById("leastUsed"));

    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;
}

function ulTemplate(items, element) {
    let rowTemplate = document.getElementById("template-ul-items");
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }
    element.innerHTML = resultsHTML;
}

function sortProperties(object) {
    // First convert the object to an array.
    let returnArray = Object.entries(object);

    // Sort the array.
    returnArray.sort(function (first, second) {
        return second[1] - first[1];
    })

    return returnArray;
}

// Filter out stop words.
function filterStopWords(wordArray) {
    const commonWords = getStopWords();
    const commonObject = {};
    const uncommonArray = [];

    for (i = 0; i < commonWords.length; i++) {
        commonObject[commonWords[i].trim()] = true;
    }

    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObject[word]) {
            uncommonArray.push(word);
        }
    }

    return uncommonArray;
}

// A list of stop words we don't want to include in stats.
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// Highlight the words in search.
function performMark() {

    // Read the keyword.
    const keyword = document.getElementById("keyword").value;
    const display = document.getElementById("fileContent");

    let newContent = "";

    // Find all the currently marked items.
    let spans = document.querySelectorAll('mark');

    for (var i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    const regExp = new RegExp(keyword, "gi");
    const replaceText = "<mark id='markme'>$&</mark>";
    const bookContent = display.innerHTML;

    // Add the mark to the book content.
    newContent = bookContent.replace(regExp, replaceText);

    display.innerHTML = newContent;
    const count = document.querySelectorAll('mark').length;
    document.getElementById("searchStat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        const element = document.getElementById("markme");
        element.scrollIntoView();
    };

}
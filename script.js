'use strict';

// put your own value below!
const apiKey = 'pWemLF6yK0aYJBIeI5A8aJyMKdablajyg0gWz3AC';
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){

        const address = responseJson.data[i].addresses.map(a => {
            if (a.type === 'Physical'){
                return `<p>${a.line1} ${a.line2} ${a.line3} ${a.city}, ${a.stateCode} ${a.postalCode}</p>`
            }
        });

        $('#results-list').append(
            `<li>
                <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
                <p>(${responseJson.data[i].states})</p>
                ${address}
                <p>${responseJson.data[i].description}</p>
                <hr>
            </li>`
        )};

    //display the results section
    $('#results').removeClass('hidden');
};

function getNationalParks(query, limit=10) {
    const params = {
        stateCode: query,
        limit: limit,
        fields: 'addresses',
        api_key: apiKey
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
        if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText);
})
.then(responseJson => displayResults(responseJson))
.catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
});
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
    const stateList = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(stateList, maxResults);
});
}

$(watchForm);
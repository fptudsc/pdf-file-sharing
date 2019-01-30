document.addEventListener('DOMContentLoaded', function () {
    const url = '/api/sources/myOwnSources';
    const displaySources = document.querySelector('.display-sources');

    sendGetRequest(url, function (response) {
        const sources = JSON.parse(response);
        displaySources.innerHTML = sources.map(s => `
            <div class="col col-lg-4 text-center bg-light m-2 p-4">
                <h1>${s.title}</h1>
                <iframe src=${s.url} width="400" height="400"></iframe>
                <a href="/sources/view/${s.id}" class="btn btn-info">View</a>
                <a href="/sources/delete/${s.id}" class="btn btn-danger">Delete</a>
            </div>
        `).join('');
    });
});
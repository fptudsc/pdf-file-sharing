document.form_profile.addEventListener('submit', function (e) {
    e.preventDefault();

    changeState({ message: 'Saving . . .' });

    saveChanges(this, res => {
        const message = JSON.parse(res).message
        changeState({ message });
        this.password.value = '';
    });
});

function saveChanges(form, callback) {
    const url = '/api/users/saveProfile';
    const profile = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    };

    sendPostRequest(url, profile, callback);
}

function createElement(type, attrs = {}, childs = []) {
    const element = document.createElement(type);
    
    Object.entries(attrs).forEach(([k, v]) => element.setAttribute(k, v));

    childs.forEach(c => element.appendChild(c));

    return element;
}

function changeState(state) {
    const result = document.querySelector('.result');
    const messageElement = createElement('div', { class: 'alert alert-warning' });
    const content = document.createTextNode(state.message);

    messageElement.appendChild(content);

    if (result.lastChild != result.firstChild)
        result.lastChild.remove();
    result.appendChild(messageElement);
}
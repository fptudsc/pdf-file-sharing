function getCookie(name) {
    let value = '';
    let parts = document.cookie.split("; " + name + "=");
    if (parts.length === 2) 
        value = parts.pop().split(";").shift();
        
    return { key: name, value };
}
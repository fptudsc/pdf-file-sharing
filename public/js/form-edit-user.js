window.addEventListener('DOMContentLoaded', function() {
    const formEditUser = document.querySelector('.form-edit-user');

    const handleFormResponse = res => {
        const { errors } = JSON.parse(res);
        if (!errors)
            location.reload(true);

        document.querySelectorAll('.alert.alert-danger.text-center')
            .forEach(element => 
                element.parentElement.removeChild(element));

        for (let k in errors) {
            let errorField = document.querySelector(`label[for="${k}"]`);
            let errorAlert;

            if (errorField.previousElementSibling)
                errorAlert = errorField.previousElementSibling;
            else
                errorAlert = document.createElement('div');
            
            errorAlert.className = 'alert alert-danger text-center';
            errorAlert.textContent = errors[k];
            errorField.parentElement.insertBefore(errorAlert, errorField);
        }

        console.log(errors);
    }

    formEditUser.addEventListener('submit', function (e) {
        e.preventDefault();
        const { _method, firstName, lastName, username, password, passwordPair }  = this;
        updateUser = _method.value === 'PUT' ?  sendPutRequest : sendPostRequest;

        updateUser(
            location.href,
            { 
                firstName: firstName.value, 
                lastName: lastName.value, 
                username: username.value, 
                password: password.value,
                passwordPair: passwordPair.value
            },
            handleFormResponse
        );
    });
})
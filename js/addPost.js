let peticion = new XMLHttpRequest();
peticion.open('GET', 'http://localhost:3000/users'); //Obtenemos usuarios disponibles para añadir comentario
peticion.send();

peticion.addEventListener('load', function() {
    if (peticion.status === 200) {
        let users = JSON.parse(peticion.responseText); //Usuarios del JSON
        var sel = document.getElementById('usersSelect');
        for(let j of users) {
            var opt = document.createElement('option');
            let username = j.name; //Nombre de cada usuario
            opt.innerHTML = username;
            opt.value = j.id;
            sel.appendChild(opt);
        }
    }else{
        console.log("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
    }
});

const peticion2=new XMLHttpRequest();

const titleEl = document.querySelector('#title');
const contentEl = document.getElementById('postContent');
const authorIdEl = document.querySelector('#usersSelect');
const form = document.querySelector('#addPost');

    
    
const checkTitle = () => {

    let valid = false;

    const min = 3,
        max = 30;

    const title = titleEl.value.trim();

    if (!isRequired(title)) {
        showError(titleEl, 'El título del post no puede estar vacío.');
    } else if (!isBetween(title.length, min, max)) {
        showError(titleEl, `El título del post debe tener entre ${min} y ${max} caracteres.`)
    } else {
        showSuccess(titleEl);
        valid = true;
    }
    return valid;
};
    
const checkContent = () => {

    let valid = false;

    const min = 20,
        max = 350;

    const content = contentEl.value;
    console.log(content);

    if (!isRequired(content)) {
        showError(contentEl, 'El contenido del post no puede estar vacío.');
    } else if (!isBetween(content.length, min, max)) {
        showError(contentEl, `El contenido del post debe tener entre ${min} y ${max} caracteres.`)
    } else {
        showSuccess(contentEl);
        valid = true;
    }
    return valid;
};
    
const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
    
    
const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};
    
const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}
    
    
form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();

    // validate fields
    let isTitleValid = checkTitle(),
        isContentValid = checkContent();

    let isFormValid = isTitleValid &&
        isContentValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        let title = titleEl.value;
        let content = contentEl.value;
        let authorId = authorIdEl.value;

        //La fecha
        const today = new Date().toISOString().slice(0, 10);
        let post = {title: title, body: content, date: today, authorId: authorId};
        peticion.open('POST', 'http://localhost:3000/posts');
        peticion.setRequestHeader('Content-type', 'application/json');  // Siempre tiene que estar esta línea si se envían datos
        peticion.send(JSON.stringify(post));
        peticion.addEventListener('load', function() {
            if (peticion.status === 201) {
                console.log("Post añadido");
                titleEl.value=''
                contentEl.value=''
            }else {
                console.log("Error al añadir el post");
            }
        })
    }      
});
    
    
const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'title':
            checkTitle();
            break;
        case 'content':
            checkContent();
            break;
    }
}));
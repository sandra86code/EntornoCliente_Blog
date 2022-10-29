var url_string = window.location.href;
var url = new URL(url_string);
var postId = url.searchParams.get("id");

var options = {year: 'numeric', month: 'long', day: 'numeric' }; //Para formatear las fechas

let peticion = new XMLHttpRequest();
peticion.open('GET', `http://localhost:3000/posts/?id=${postId}`); //Obtener datos del post
peticion.send();


peticion.addEventListener('load', function() {
    if (peticion.status === 200) {
        let post = JSON.parse(peticion.responseText); 
        let postTitle = post[0].title;              //Título del post
        document.getElementById("title").innerHTML = postTitle;
        let postDate = new Date(post[0].date);      //Fecha del post
        document.getElementById("postDate").innerHTML = postDate.toLocaleDateString("es-ES", options);
        let postContent = post[0].content;          //Contenido del post
        document.getElementById("postContent").innerHTML = postContent;
        let authorId = post[0].authorId;            //Id del autor del post para usarlo en la siguiente peticion
        
        //Petición 2
        let peticion2 = new XMLHttpRequest();
        peticion2.open('GET', `http://localhost:3000/users?id=${authorId}`); //Obtener datos del autor del post
        peticion2.send();

        peticion2.addEventListener('load', function() {
            if (peticion2.status === 200) {
                //Petición 3
                let peticion3 = new XMLHttpRequest();
                peticion3.open('GET', 'http://localhost:3000/users'); //Obtenemos usuarios disponibles para añadir comentario
                peticion3.send();

                peticion3.addEventListener('load', function() {
                    if (peticion3.status === 200) {
                        let user = JSON.parse(peticion2.responseText); 
                        let authorName = user[0].name;      //Nombre del autor del post
                        document.getElementById("authorName").innerHTML = authorName;
                
                        let users = JSON.parse(peticion3.responseText); //Usuarios del JSON
                        var sel = document.getElementById('usersSelect');
                        
                        let peticion4 = new XMLHttpRequest();
                        peticion4.open('GET', `http://localhost:3000/comments/?postId=${postId}`); //Obtenemos comentarios de este post
                        peticion4.send();
                        peticion4.addEventListener('load', function() {
                            if (peticion4.status === 200) {
                                let comments = JSON.parse(peticion4.responseText); //Comentarios
                                for(let j of users) {
                                    var opt = document.createElement('option');
                                    let username = j.name; //Nombre de cada usuario
                                    opt.innerHTML = username;
                                    opt.value = j.id;
                                    sel.appendChild(opt);
                                }
                                for(let j of comments) {                         
                                    console.log(j.authorId);
                                    let peticion5 = new XMLHttpRequest();
                                    peticion5.open('GET', `http://localhost:3000/users?id=${j.authorId}`); //Obtenemos autor del comentario
                                    peticion5.send();

                                    peticion5.addEventListener('load', function() {
                                        if (peticion5.status === 200) {
                                            let userComment = JSON.parse(peticion5.responseText);
                                            let authorCommentName = userComment[0].name;
                                            let postDate = new Date(j.date);
                                            let bodyComment = j.body;
                                            
                                            let row = `<div class="comment"><p>Autor: ${authorCommentName}</p><p>Fecha de publicación: ${postDate.toLocaleDateString("es-ES", options)}</p><p>${bodyComment}</p></div>`;
                                            document.getElementById("comments").innerHTML += row;
                                            
                                        }else {
                                            console.log("Error " + peticion5.status + " (" + peticion5.statusText + ") en la petición");
                                        }
                                    });
                                }
                            }else {
                                console.log("Error " + peticion4.status + " (" + peticion4.statusText + ") en la petición");
                            }
                        });
                    }else {
                        console.log("Error " + peticion3.status + " (" + peticion3.statusText + ") en la petición");
                    }
                });
            }else {
                console.log("Error " + peticion2.status + " (" + peticion2.statusText + ") en la petición"); 
            }
        });
    }else {
        console.log("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
    }
});


//Validación formulario
let peticion6 = new XMLHttpRequest();

const form = document.querySelector('#addComment');
const authorIdEl = document.querySelector('#usersSelect');
const bodyComment = document.getElementById('bodyComment');






const checkBodyComment = () => {
    let valid = false;

    let body = bodyComment.value;
    if (!isRequired(body)) {
        showError(bodyComment, 'Texto requerido.');
    } else {
        showSuccess(bodyComment);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;

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
    let isBodyCommentValid = checkBodyComment();

    let isFormValid = isBodyCommentValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        let body = bodyComment.value;
        let authorId = authorIdEl.value;
        let newPostId = postId;
        const today = new Date().toISOString().slice(0, 10);

        let newComment = {body: body, authorId: authorId, postId: newPostId, date: today};
        
        peticion6.open('POST', 'http://localhost:3000/comments'); 
        peticion6.setRequestHeader('Content-type', 'application/json');
        peticion6.send(JSON.stringify(newComment));

        peticion6.addEventListener('load', function() {
            if (peticion6.status === 201) {
                console.log("Comentario añadido");
                bodyComment.value = '';
            }else {
                console.log("Error al añadir el comentario");
            }
        });
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
        case 'body':
            checkBodyComment();
            break;
    }
}));



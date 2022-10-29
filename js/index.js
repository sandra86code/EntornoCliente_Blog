var options = {year: 'numeric', month: 'long', day: 'numeric' }; //Para formatear las fechas

let peticion = new XMLHttpRequest();

peticion.open('GET', 'http://localhost:3000/posts');
peticion.send();

peticion.addEventListener('load', function() {
    if (peticion.status === 200) {
        let posts = JSON.parse(peticion.responseText); // Convertirmos los datos JSON a un objeto
        let postList = document.getElementById("listPost");
        for(let i of posts) {
            let peticion2 = new XMLHttpRequest();
            peticion2.open('GET', `http://localhost:3000/users?id=${i.authorId}`);
            peticion2.send();
            
            peticion2.addEventListener('load', function() {
                if (peticion2.status === 200) {
                    let user = JSON.parse(peticion2.responseText); // Convertirmos los datos JSON a un objeto
                    let AuthorName = user[0].name;
                    console.log(i.id);
                    let postDate = new Date(i.date);
                    let row = `<ul><a href="./post.html?id=${i.id}"><li id="title">${i.title} </li><li> Fecha: ${postDate.toLocaleDateString("es-ES", options)}</li><li> Autor: ${AuthorName} </li></a></ul>`;
                    postList.innerHTML += row;
                    console.log(row);
                }else {
                    console.log("Error " + peticion2.status + " (" + peticion2.statusText + ") en la petición");
                }
            });
            
        }
        
    } else {
        console.log("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
    }
})
console.log("Petición acabada");



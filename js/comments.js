// javascript for create.html
const form = document.querySelector('form');
const createPost = async (e) => {
    e.preventDefault();
    const doc = {
        body: form.body.value,
        authorId: 
      "body": "some comment",
      "authorId": 1,
      "postId": 1,
        
        title: form.title.value,
        body: form.body.value,
        likes: 10
    }
    await fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.replace('/index.html');
}
form.addEventListener('submit', createPost);
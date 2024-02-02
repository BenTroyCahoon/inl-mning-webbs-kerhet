// // Funktion för att hämta och visa blogginlägg
// function getBlogPosts() {
//   fetch("/getposts")
//     .then((response) => response.json())
//     .then((posts) => {
//       posts.forEach((post) => {
//         renderPost(post); // Anropa renderPost för varje inlägg
//       });
//     })
//     .catch((error) => console.error(error));
// }

// // Funktion för att ta bort ett inlägg från DOM baserat på dess ID
// function removePostFromDOM(postId) {
//   const postElement = document.getElementById(`post-${postId}`);
//   if (postElement) {
//     postElement.remove();
//   } else {
//     console.error("Could not find post element in DOM");
//   }
// }

// // Funktion för att ta bort ett inlägg
// function deletePost(postId) {
//   fetch(`/deletepost/${postId}`, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       if (response.ok) {
//         removePostFromDOM(postId); // Ta bort inlägget från DOM om det har tagits bort från servern
//       } else {
//         console.error("Failed to delete post");
//       }
//     })
//     .catch((error) => console.error(error));
// }

// // Funktion för att rendera inlägg
// function renderPost(post) {
//   const postElement = document.createElement("div");
//   postElement.classList.add("blog-post");
//   postElement.id = `post-${post.id}`; // Använd postens id för att identifiera elementet

//   const titleElement = document.createElement("h2");
//   titleElement.textContent = post.title;

//   const contentElement = document.createElement("p");
//   contentElement.textContent = post.content;

//   const deleteButton = document.createElement("button");
//   deleteButton.textContent = "Delete";
//   deleteButton.addEventListener("click", () => {
//     deletePost(post.id); // Anropa deletePost-funktionen när delete-knappen klickas
//   });

//   postElement.appendChild(titleElement);
//   postElement.appendChild(contentElement);
//   postElement.appendChild(deleteButton);

//   document.getElementById("blog-posts-container").prepend(postElement); // Visa nya inlägg överst
}

// Funktion för att lägga till ett nytt inlägg
// function addNewPost(title, content) {
//   fetch("/addpost", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, content }),
//   });

//   renderPost(newPost);
// }

// // Lyssna på formuläret för att lägga till ett nytt inlägg
// const postForm = document.getElementById("blog-posts-container");
// postForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const title = document.getElementById("post-title").value;
//   const content = document.getElementById("post-content").value;
//   addNewPost(title, content);
//   postForm.reset(); // Återställ formuläret efter att inlägget har lagts till
// });

// // Kalla på funktionen när sidan laddas för att visa inläggen
// document.addEventListener("DOMContentLoaded", () => {
//   getBlogPosts(); // Hämta och visa inlägg när sidan laddas
// });
// Funktion för att lägga till ett nytt inlägg
// function addNewPost(title, content) {
//   fetch("/addpost", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, content }),
//   })
//     .then((response) => response.json())
//     .then((newPost) => renderPost(newPost))
//     .catch((error) => console.error("Error:", error));
// }

// // Lyssna på formuläret för att lägga till ett nytt inlägg
// const postForm = document.getElementById("blog-posts-container");
// postForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const title = document.getElementById("post-title").value;
//   const content = document.getElementById("post-content").value;
//   addNewPost(title, content);
//   postForm.reset(); // Återställ formuläret efter att inlägget har lagts till
// });

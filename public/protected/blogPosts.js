function getBlogPosts() {
  clearBlogPosts();
  fetch("/getposts")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post) => {
        renderPost(post); // Anropa renderPost för varje inlägg
      });
    })
    .catch((error) => console.error(error));
}

async function appendCsrfToken() {
  const response = await fetch("/csrf");
  const csrf = await response.text();
  const csrfInput = document.getElementById("csrf-post");
  csrfInput.value = csrf;
}

function clearBlogPosts() {
  const container = document.getElementById("blog-posts-container");
  while (container.firstChild) {
    console.log("cleared");
    container.removeChild(container.firstChild);
  }
}

// Funktion för att ta bort ett inlägg från DOM baserat på dess ID
function removePostFromDOM(postId) {
  const postElement = document.getElementById(`post-${postId}`);
  if (postElement) {
    postElement.remove();
  } else {
    console.error("Could not find post element in DOM");
  }
}

function deletePost(postId) {
  fetch(`/deletepost/${postId}`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log("Response from server:", response); // Lägg till denna rad för att se serverns svar i konsolen
      if (response.ok) {
        removePostFromDOM(postId);
      } else {
        console.error("Failed to delete post");
      }
    })
    .catch((error) => console.error(error));
}

async function renderPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("blog-post");
  postElement.id = `post-${post.id}`;

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;

  const contentElement = document.createElement("p");
  contentElement.innerHTML = post.content;

  const authorElement = document.createElement("p");
  authorElement.textContent = `Author: ${post.author}`;

  const timestampElement = document.createElement("p");
  const formattedTimestamp = new Date(post.created_at).toLocaleString("sv-SE");
  timestampElement.textContent = `Created At: ${formattedTimestamp}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deletePost(post.id);
  });

  document.getElementById("blog-posts-container").prepend(postElement);

  const commentsElement = document.createElement("div");
  commentsElement.classList.add("comments");

  let csrf;
  // Fetch and render comments for this post
  try {
    const response = await fetch(`/getcomments/${post.id}`);
    const jsonResponse = await response.json();
    const comments = jsonResponse.comments;
    csrf = jsonResponse.csrf;

    comments.forEach((comment) => {
      const commentElement = document.createElement("p");
      commentElement.innerHTML = `${comment.username}: ${comment.content}`;
      commentsElement.appendChild(commentElement);
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }

  postElement.appendChild(titleElement);
  postElement.appendChild(authorElement);
  postElement.appendChild(timestampElement);
  postElement.appendChild(contentElement);
  postElement.appendChild(deleteButton);
  postElement.appendChild(commentsElement);

  const newCommentForm = document.createElement("form");
  newCommentForm.action = `/addcomment/${post.id}`;
  newCommentForm.method = "POST";

  const newCommentInput = document.createElement("input");
  newCommentInput.type = "text";
  newCommentInput.name = "content";

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = "_csrf";
  csrfInput.value = csrf;

  const newCommentButton = document.createElement("button");
  newCommentButton.type = "submit"; // Typen "submit" innebär att knappen kommer att fungera som en submit-knapp för formuläret
  newCommentButton.textContent = "Post Comment"; // Knappens text

  newCommentForm.appendChild(newCommentInput);
  newCommentForm.appendChild(csrfInput);
  newCommentForm.appendChild(newCommentButton); // Lägg till knappen i formuläret

  commentsElement.appendChild(newCommentForm); // Lägg till formuläret i commentsElement
}

// Funktion för att lägga till ett nytt inlägg
async function addNewPost(title, content, _csrf) {
  try {
    const response = await fetch("/addpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, _csrf }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    console.log("Inlägg tillagt framgångsrikt!");
    getBlogPosts(); // Hämta och visa inlägg igen för att uppdatera gränssnittet med det nya inlägget
  } catch (error) {
    console.error("Error:", error);
  }
}

// Lyssna på formuläret för att lägga till ett nytt inlägg
const postForm = document.getElementById("addPostForm");
postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const csrf = document.getElementById("csrf-post").value;
  await addNewPost(title, content, csrf);
  postForm.reset(); // Återställ formuläret efter att inlägget har lagts till
});

// Kalla på funktionen när sidan laddas för att visa inläggen
document.addEventListener("DOMContentLoaded", () => {
  getBlogPosts(); // Hämta och visa inlägg när sidan laddas
  appendCsrfToken();
});

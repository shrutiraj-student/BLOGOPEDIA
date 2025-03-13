function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get query params from the URL
function getQueryParam(slug) {
    try {
        const queryStr = window.location.search;
        const params = new URLSearchParams(queryStr);
        const id = params.get('id');
        return id;
    } catch (error) {
        console.error("Error getting query parameter: ", error);
    }
}

//  // Fetching specific articles comments
 async function getArticleComment(slug) {
    const jwt_token = localStorage.getItem('JWT-TOKEN');
  try {
    const response = await fetch(`http://localhost:3001/api/comment/get/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${jwt_token}`,
      }
    });

    if(response.ok) {
      const comments = await response.json();
      return comments.data;
    }
    else {
      alert("Error Occured! Try again later");
    }
}
catch (error) {
  console.error('Error fetching article comments:', error.message);
}
}






async function showArticleDetails() {
    const container = document.getElementById('articleDetailsContainer');
    // API Calling ---------------------------------------------------------------->>>>
    const articleId = getQueryParam('id');
    const comments_article = await getArticleComment(articleId);
    console.log(comments_article);

    const routes = `http://localhost:3001/api/article/${articleId}`;

    const response = await fetch(routes, {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('JWT-TOKEN')}`,
        }
    });

    if (response.status === 200) {
        const article = await response.json();
        // console.log(article.data);  // TESTING DONE

        container.innerHTML = `
            <div class="card mb-3 shadow-lg px-3">
                <div class="card-body">
                    <h1 class="card-title text-primary">${article.data.title}</h1>
                    <p class="card-text text-muted pt-1">By <span class="fst-italic fw-bold">${article.data.author.name}</span> on ${formatDate(article.data.createdAt)}</p>
                    <hr/>
                    <div class="article-description">
                        <p class="text-secondary" style="text-align: justify;">${article.data?.description}</p>
                    </div>
                    <a href="article.html" class="btn btn-secondary mt-5">Back to Articles</a>
                </div>
            </div>
            <hr class="my-1" />
            
            <div class="card card-body mt-2">
                <form id="commentForm">
                    <label class="form-label">Add Comment</label>
                    <textarea class="form-control mb-3" id="commentText" rows="3" placeholder="Write a comment..."></textarea>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
            <div class="card mt-3 shadow-lg px-3">
                <div class="card-body">
                    ${
                        comments_article.length > 0 ? (comments_article.map((comment, index) => {
                            return `
                            <div class="comment-card bg-light mb-3 px-3 py-3 " key=${index}>
                                <div class="d-flex align-items-center mb-2">
                                    <img class="rounded-circle me-3" width="70" height="70" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTadSAgMa0Si3aeLKU9sPJ24i1IZX3nKOVLnA&s" alt="avatar">
                                    <div class="d-flex justify-content-between w-100 align-items-center">
                                        <div>
                                            <h5 class="mb-0">${comment.author.name || "Anonymous"}</h5>
                                            <p class="text-muted">${formatDate(comment.createdAt)}</p>
                                        </div>
                                        <button type="submit" class="btn btn-primary remove-comment" data-comment-id="${comment._id}">Remove</button>
                                    </div>
                                </div>
                                <p class="mb-0 col-10 px-0 mx-auto">${comment.text}</p>
                            </div>
                            `;
                        }).join('')
                    ):
                    (
                    `
                        <div class="text-center">
                            <p class="text-muted">No comments yet.</p>
                        </div>
                    `
                    )
                    }
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `<h2 class="bg-danger text-white p-5 text-center rounded-md">Article not found!</h2>`;
    }




    // add event listner to the remove button
    const removeButtons = document.querySelectorAll('.remove-comment');
    removeButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
            e.preventDefault();
            const commentId = e.target.getAttribute('data-comment-id');
            // console.log(commentId);  //TESTING: print commentId 

            const deleteResponse = await fetch(`http://localhost:3001/api/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('JWT-TOKEN')}`,
                }
            });
            
            if(deleteResponse.ok) {
                alert('Comment removed successfully');
                showArticleDetails(); // Refresh the article details to show the removed comment
            }
            else {
                alert('Failed to remove comment');
            }
        })
    })


    

    // Add event listener to the comment form
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;

        if (!commentText) {
            alert('Comment cannot be empty');
            return;
        }

        const articleId = getQueryParam('id');
        const commentResponse = await fetch(`http://localhost:3001/api/comment/make/${articleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('JWT-TOKEN')}`
            },
            body: JSON.stringify({ text: commentText })
        });

        if (commentResponse.status === 201) {
            alert('Comment added successfully');
            showArticleDetails(); // Refresh the article details to show the new comment
        } else {
            alert('Failed to add comment');
        }
    });
}

document.addEventListener('DOMContentLoaded', showArticleDetails);
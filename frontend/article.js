

// Function to format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric',  };
  return date.toLocaleDateString('en-US', options);
};



// Function to show articles dynamically
const displayArticles = async () => {
  const container = document.querySelector('#articlesContainer');
  container.innerHTML = '';
  const JWT_TOKEN = localStorage.getItem("JWT-TOKEN");

  try {
    const response = await fetch('http://localhost:3001/api/article/v1/all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`,
      }
    });

    if (response.status === 200) {
      const articles = await response.json()
      const data = articles.data;

      if(data.length === 0) {
        container.innerHTML = '<p class="text-center text-primary">No articles found.</p>';
        return;
      }
      // console.log(data[0]);



      data.forEach((article) => {
        const formattedDate = formatDateTime(article?.createdAt);

        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
              <div class="card mb-4 shadow-md">
                <img src="${article.thumbnail_url}" alt="article-image" loading="lazy" />
                <div class="card-body">
                  <h5 class="card-title text-primary">${article?.title}</h5>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="card-text text-warning fw-bold">${article?.author?.name || "Anonymous"}</p>
                    <p class="card-text text-success fw-normal pb-2">${formattedDate}</p>
                  </div>
                  <a href="article-details.html?id=${article?._id}" class="btn btn-primary d-flex justify-content-center align-item-center">Read More</a>
                </div>
              </div>
            `;
        container.appendChild(card);
      });
    }
  }
  catch (error) {
    console.error('Error fetching articles:', error);
    container.innerHTML = '<p class="text-danger">Failed to load articles. Please try again later.</p>';
  }

};

document.addEventListener('DOMContentLoaded', displayArticles);




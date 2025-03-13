

// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;


      // define "POST" body
      const body = JSON.stringify({
        "email": email,
        "password": password
      })

      // Send data to backend
      fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body,
      })
        .then((res) => (
          res.json()
        ))
        .then((data) => {
          // console.log(data);

          if (data.success) {
            alert(`User Logged in successfully`);
            localStorage.setItem('JWT-TOKEN', data.token);
            window.location.href = "article.html";
          }
        })
        .catch((err) => {
          console.error('Error:', err);
          alert('Failed to login. Please check your credentials');
        })

    });
  }




  // Handle Register Form Submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      // console.log('Register submitted:', { name, email, password });

      const body = JSON.stringify({
        "name": name,
        "email": email,
        "password": password
      })



      // Send data to backend
      fetch("http://localhost:3001/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body
      })
        .then((res) => (
          res.json()
        ))
        .then((data) => {
          console.log("Register: ", data);

          if (data.success) {
            alert("Registration successful");
            window.location.href = 'login.html';
          }
        })
        .catch((err) => {
          console.error('Error:', err);
          alert('Failed to register. Please try again');
        })
    });
  }





  // Handle Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      // console.log('Contact form submitted:', { name, email, message });

      const body = JSON.stringify({
        "name": name,
        "email": email,
        "message": message
      });

      // Send data to backend
      fetch("http://localhost:3001/api/user/user-contact-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('JWT-TOKEN')}`
        },
        body: body
      })
       .then((res) => (
          res.json()
        ))
        .then((data) => {
          console.log('Contact: ', data);
          if (data.success) {
            alert('Contact details sent successfully');
            window.location.href = 'index.html';
          }
        })


    });
  }
});




// create an article >>>>
const createArticleForm = document.getElementById("makeForm");
if(createArticleForm) {
  createArticleForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const content = document.getElementById("content").value;

    const body = JSON.stringify({
      "title" : title,
      "thumbnail_url" : thumbnail,
      "description" : content,
    })
    const jwt_token = localStorage.getItem("JWT-TOKEN");
    try {
      const response = await fetch("http://localhost:3001/api/article/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${jwt_token}`
        },
        body: body
      });
      const data = await response.json();
      console.log(data);

      if(data.success) {
        alert("Article created successfully");
        window.location.href = "article.html";
      }
    } 
    catch(err) {
      console.error("Error: ", err);
      alert("Failed to create article");
    }
  })
}
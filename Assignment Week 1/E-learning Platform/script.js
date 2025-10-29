// ----- Course Data -----
const courses = [
    {
      id: 1,
      title: "HTML Basics",
      description: "Learn the building blocks of the web.",
      lessons: ["Introduction", "Tags and Elements", "Forms", "Media and Links"]
    },
    {
      id: 2,
      title: "CSS Fundamentals",
      description: "Style beautiful and responsive websites.",
      lessons: ["Selectors", "Box Model", "Flexbox", "Animations"]
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      description: "Add interactivity and logic to your web pages.",
      lessons: ["Variables", "Functions", "DOM Manipulation", "Events"]
    }
  ];
  
  const mainContent = document.getElementById("main-content");
  const userInfo = document.getElementById("user-info");
  
  // ----- Local Storage -----
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
  let completedCourses = JSON.parse(localStorage.getItem("completedCourses")) || {};
  
  // ----- Auth -----
  function showLogin() {
    mainContent.innerHTML = `
      <div class="auth-form">
        <h2>Login</h2>
        <input type="text" id="login-username" placeholder="Username" />
        <input type="password" id="login-password" placeholder="Password" />
        <button onclick="login()">Login</button>
        <p>Don't have an account? <a href="#" onclick="showSignup()">Sign up</a></p>
      </div>
    `;
  }
  
  function showSignup() {
    mainContent.innerHTML = `
      <div class="auth-form">
        <h2>Sign Up</h2>
        <input type="text" id="signup-username" placeholder="Username" />
        <input type="password" id="signup-password" placeholder="Password" />
        <button onclick="signup()">Create Account</button>
        <p>Already have an account? <a href="#" onclick="showLogin()">Login</a></p>
      </div>
    `;
  }
  
  function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();
  
    if (!username || !password) return alert("Please fill in all fields.");
    if (users.find(u => u.username === username)) return alert("Username already exists!");
  
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully!");
    showLogin();
  }
  
  function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
  
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return alert("Invalid username or password!");
  
    loggedInUser = user;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    userInfo.innerHTML = `👤 ${user.username} | <a href="#" onclick="logout()">Logout</a>`;
    showCourseList();
  }
  
  function logout() {
    loggedInUser = null;
    localStorage.removeItem("loggedInUser");
    userInfo.innerHTML = "";
    showLogin();
  }
  
  // ----- Courses -----
  function showCourseList(searchTerm = "") {
    if (!loggedInUser) return showLogin();
  
    const filteredCourses = courses.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    mainContent.innerHTML = `
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search courses...">
      </div>
      <section class="course-list" id="courseList"></section>
    `;
  
    renderCourses(filteredCourses);
  
    // Add search listener
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => searchCourses(e.target.value));
  }
  
  function renderCourses(coursesToRender) {
    const userCourses = completedCourses[loggedInUser.username] || [];
    const courseList = document.getElementById("courseList");
  
    courseList.innerHTML = coursesToRender
      .map(
        (course) => `
        <div class="course-card" onclick="showCourseDetail(${course.id})">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <p><strong>Status:</strong> ${
            userCourses.includes(course.id) ? "✅ Completed" : "In Progress"
          }</p>
        </div>`
      )
      .join("");
  }
  
  function searchCourses(value) {
    const filtered = courses.filter((c) =>
      c.title.toLowerCase().includes(value.toLowerCase()) ||
      c.description.toLowerCase().includes(value.toLowerCase())
    );
    renderCourses(filtered);
  }
  
  function showCourseDetail(id) {
    const course = courses.find((c) => c.id === id);
    const userCourses = completedCourses[loggedInUser.username] || [];
    const isCompleted = userCourses.includes(id);
    const progress = isCompleted ? 100 : 0;
  
    mainContent.innerHTML = `
      <section class="course-detail">
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progress}%;"></div>
        </div>
        <h3>Lessons:</h3>
        ${course.lessons.map((l, i) => `<div class="lesson">${i + 1}. ${l}</div>`).join("")}
        <button onclick="markCourseCompleted(${id})">
          ${isCompleted ? "Completed ✅" : "Mark as Completed"}
        </button>
        <button onclick="showCourseList()">Back to Courses</button>
      </section>
    `;
  }
  
  function markCourseCompleted(id) {
    const username = loggedInUser.username;
    if (!completedCourses[username]) completedCourses[username] = [];
    if (!completedCourses[username].includes(id)) {
      completedCourses[username].push(id);
      localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
      alert("Course marked as completed!");
    }
    showCourseDetail(id);
  }
  
  // ----- Initialize -----
  if (loggedInUser) {
    userInfo.innerHTML = `👤 ${loggedInUser.username} | <a href="#" onclick="logout()">Logout</a>`;
    showCourseList();
  } else {
    showLogin();
  }
  
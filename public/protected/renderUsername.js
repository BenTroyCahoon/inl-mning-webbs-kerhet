async function fetchUserInfo() {
  const response = await fetch("/user");
  const jsonResponse = await response.json();
  return jsonResponse.msg;
}

async function renderUserInfo() {
  const msg = await fetchUserInfo();
  console.log(msg);
  const userInfoDiv = document.getElementById("user-info");
  userInfoDiv.textContent = msg;
}

renderUserInfo();

$(document).ready(() => {
  $.get("/api/user_data").then(data => {
    $(".email").text(`User: ${data.email}`);
  });
  let user = JSON.parse(localStorage.getItem("user"));
  let id = user.id;
  $.get("/api/score/" + id).then(data => {
    console.log(data);
    let scoreid;
    let arr = [];
    for (i in data) {
      scoreid = data[i].score; // all user scores
      arr.push(data[i].score); // pushing user scores to arr 
    }
    let latestScore = scoreid; // users latest score
    let maxScore = Math.max(...arr); // grabs user highest score from array
    $(".finalScore").text(`Your score is: ${latestScore}pts`);
    if (latestScore <= 10) {
      $(".response").text("You can do better than that!");
    } else {
      $(".response").text("Good Job!");
    }
    $(".highScorebtn").on("click", () => {
      $(".highScore").text(`Your best score is: ${maxScore}pts`);
    });
  });
});
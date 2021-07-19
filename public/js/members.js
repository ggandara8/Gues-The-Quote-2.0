$(document).ready(() => {
  $(".hs").on("click", () => {
    $.get("/api/score").then(data => {
      // console.log(data);
      let AllScores;
      let AllUserId;
      let arr = [];
      let arr2 = [];
      for (i in data){
        AllScores = data[i].score;
        AllUserId = data[i].UserId;
        arr2.push(AllUserId);
        arr.push(data[i].score);
      }
      let max = Math.max(...arr); //highest score of all the users
      $(".highScore").text(`Guess The Quote Highest Score is: ${max}pts`);
      let index = arr.indexOf(max); //index of highest score from all users
      let HSuserid = arr2[index];

      $.get(`/api/alluser_data/${HSuserid}`).then(data => {
        let userHighScorer = data[0].email;
        $(".email").text(`From User: ${userHighScorer}`);
      });
    });
  });
});

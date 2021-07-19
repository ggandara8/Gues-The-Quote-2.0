$(document).ready(() => {
  let Quizcount = 0;
  let answers = [];
  let shuffled = answers
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
  let UserScore = 0;
  let user = JSON.parse(localStorage.getItem("user"));
  let id = user.id;
  let quoteNumber = 1;
  $(".submit").hide();
  $(".help").hide();
  $(".next").hide();
  getFirstAuthor(); //calling getQuote function to start the game
  async function getFirstAuthor() {
    // get the quotes and correct author
    // $(".next").show();
    const url = "/quotes";
    const fetchRes = await fetch(url);
    const json = await fetchRes.json();
    let wrongAuthor = json.data[0].quoteAuthor;
    answers.push({ authorName: wrongAuthor, answer: false });
    getSecondAuthor();
    getQuoteAuthor();
  }
  async function getSecondAuthor() {
    const url = "/quotes";
    const fetchRes = await fetch(url);
    const json = await fetchRes.json();
    let wrongAuthor = json.data[0].quoteAuthor;
    answers.push({ authorName: wrongAuthor, answer: false });
  }

  async function getQuoteAuthor() {
    const url = "/quotes";
    const fetchRes = await fetch(url);
    const json = await fetchRes.json();
    console.log(json);
    let quote = json.data[0].quoteText; // quote
    let author = json.data[0].quoteAuthor;
    answers.push({ authorName: author, answer: true });
    shuffled = answers
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
    $(".next").show(); //populates next button, author and potential answers all at the same time
    $("div.first").empty();
    $(".quote").text(`${quoteNumber}. "${quote}"`);
    $("div.first")
      .append(`<input type="radio" name="option" value=${shuffled[0].answer}>
    <label>${shuffled[0].authorName}</label><br><br>`);
    $("div.first")
      .append(`<input type="radio" name="option" value=${shuffled[1].answer}>
    <label>${shuffled[1].authorName}</label><br><br>`);
    $("div.first")
      .append(`<input type="radio" name="option" value=${shuffled[2].answer}>
    <label>${shuffled[2].authorName}</label><br>`);
  }

  //Next btn on click event
  $(".next").on("click", () => {
    quoteNumber++;
    if ($("input[name = 'option']").is(":checked")) {
      let userAnswer = $("input[name = 'option']:checked").val(); //grabbing the value from the btn
      if (userAnswer === "true") {
        UserScore = UserScore + 2; //score
        $(".correct").text("Correct");
        setTimeout(() => {
          $(".correct").text(" ");
        }, 2000);
      } else {
        $(".incorrect").text("Incorrect");
        setTimeout(() => {
          $(".incorrect").text(" ");
        }, 2000);
      }
    }
    answers = [];
    Quizcount++; //count the amount of questions
    shuffled; //shuffle the position of the answers
    if (Quizcount < 10) {
      getFirstAuthor();
    }
    if (Quizcount === 10) {
      FinalScore();
      $(".next").hide();
      $(".submit").show();
    }
  });
  function FinalScore() {
    $.post("/api/score", {
      score: UserScore,
      userid: id,
    });
  }
});

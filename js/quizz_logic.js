$.ajax({
	method: "GET",
	url: "js/questions.json",
	dataType: "json",
	success: function(msg) {
		console.log(msg);
		var questions = msg;
		playQuizz(questions);
	}
});

function playQuizz(quizzQuestions) {
	var $featPhoto = $("#featPhoto"), // Store location for feat-photo element
		$currentQuestion = $("#cQ"), // Store location for current question indicator element 
		$questionsNumber = $("#qN"), // Store location for questions number indicator element
		$questionElement = $("#question"), // Store location for question container element
		$answers = $("#answers"), // Store location for answers container
		$errorContainer = $("#errorContainer"), // Store location of error container
		$buttonsContainer = $("#buttonsContainer"),
		$submitButton = $("#next"), // Store location for submit button
		questionNo = 0, // Set initial question to 0;
		userAnswers = [], // store user answers in an array
		correctAnswers = 0; // Set correct answers to 0

	// write questions number
	$questionsNumber.text(quizzQuestions.length);

	// add answers
	function insertAnswers(qNo) {
		var html = "";

		for (var i = 0; i < quizzQuestions[qNo].choices.length; i++) { // iterate throw answers array and build radio inputs
			html += "<div class='answer-container'><label for='answer" + i + "'><input type='radio' id='answer" + i + "' name='answer' value='" + quizzQuestions[qNo].choices[i] + "'>" + quizzQuestions[qNo].choices[i] + "</label></div>";
		}
		return html;
	}

	// populate quizz
	function populateQuizz() {
		
		var url = "url(" + quizzQuestions[questionNo].img + ")"; // store the url for feat-photo
		$featPhoto.css("background-image", url); // set the url for feat-photo

		$currentQuestion.text(questionNo + 1); // upgrade question number indicator

		$questionElement.text(quizzQuestions[questionNo].question); // insert current question

		$answers.fadeIn().html(insertAnswers(questionNo)); // insert answers

		questionNo += 1; // upgrade question number
		if (questionNo >= 2) {
			insertBackBtn();
		}
		// select answer if exists
		selectAnswer();
		console.log(userAnswers);
	}

	function insertBackBtn() {
		if (!$("#prev").length) {
			$submitButton.before('<button id="prev">Inapoi</button>');	
		}
	}

	function goBack() {
		if (questionNo === 2) {
			questionNo = 0;
			$("#prev").remove();
		} else {
			questionNo -= 2;	
		}
		console.log(questionNo);
		populateQuizz();
		selectAnswer();
		console.log('back');
		console.log(userAnswers);
	}

	// see if any answer
	function ifAnswer() {
		// answer inputs
		var answers = quizz.answer, // store the answers array
			userAnswer;

		for (var i = 0; i < answers.length; i ++) { // identify the id of the selected answer
			if (answers[i].checked) {
				return answers[i].id.slice(-1); // store only the number from the id
			}
		}
	}

	// get user answers
	function getUserAnswer() {
		var userAnswerId = ifAnswer();

		userAnswers[questionNo - 1] = userAnswerId;
	}

	// restore user answer
	function selectAnswer() {
		var answers = quizz.answer;
		if (userAnswers[questionNo - 1]) {
			answers[userAnswers[questionNo - 1]].checked = true; 
		}
	}

	// verify user answers
	function verifyAnswers() {
		for (var i = 0; i < quizzQuestions.length; i++) {
			if (userAnswers[i] == quizzQuestions[i].correctAnswer) {
				correctAnswers++;
			}
		}
	}

	// generate success or failure messages
	function generateMessage(cq) {
		if (cq < quizzQuestions.length / 2) {
			if (cq == 0) {
				return '<p class="error">Îmi pare rău!<br>Nu ai răspuns corect la nicio întrebare.</p>';
			} else if (cq == 1) {
				return '<p class="error">Îmi pare rău!<br>Ai răspuns corect doar la o întrebare.</p>';
			} else {
				return '<p class="error">Îmi pare rău!<br>Ai răspuns corect doar la ' + cq + ' întrebări.</p>';
			}
		} else {
			if (cq == quizzQuestions.length) {
				return '<p class="success">Felicitări!<br>Ai răspuns corect la toate cele ' + cq + ' întrebări.</p>';
			} else {
				return '<p class="success">Felicitări!<br>Ai răspuns corect la ' + cq + ' întrebări.</p>';
			}
		}
	}

	// Populate quizz when the player enters the page
	populateQuizz();

	// Add an event listener on the button
	$submitButton.on('click', function(e) {
		e.preventDefault();

		if (!$('#errorContainer').is(":hidden")) {
			$errorContainer.hide(); // delete error message
		}

		if (!ifAnswer()) { // check if the user submited an answer before clicking the button
			$errorContainer.fadeIn();
		} else {
			$errorContainer.fadeOut();
			if (questionNo == quizzQuestions.length) { // check if last question
				getUserAnswer();
				console.log(userAnswers);
				verifyAnswers();
				$("#quizzContent").fadeOut(500, function() {
					$("#quizzContent").fadeIn().html('<div class="message-container">' + generateMessage(correctAnswers) + '</div>');
				});
			} else {
				getUserAnswer();
				$('.question-container').fadeOut(500, function() {
					populateQuizz();
					$('.question-container').fadeIn();
				});
			}
		}
	});

	$('#buttonsContainer').on('click', '#prev', function(e) {
		e.preventDefault();
		if (!$('#errorContainer').is(":hidden")) {
			$errorContainer.hide(); // delete error message
		}
		getUserAnswer();
		$('.question-container').fadeOut(500, function() {
			goBack();
			$('.question-container').fadeIn();
		});
	});
}



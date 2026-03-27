const questions = [
{
    q: "Which method selects element by ID in JavaScript?",
    options: ["getElementByClass","getElementById()","querySelectorAll","getById"],
    answer: 1
},
{
    q: "Which HTML attribute is used to link CSS?",
    options: ["src","href","link","style"],
    answer: 1
},
{
    q: "Which method removes last element of array?",
    options: ["push()","pop()","shift()","remove()"],
    answer: 1
},
{
    q: "Which JS method adds element to end?",
    options: ["push()","pop()","add()","insert()"],
    answer: 0
},
{
    q: "Which CSS property changes text color?",
    options: ["font","background","color","text-style"],
    answer: 2
}
];

let current = 0;
let score = 0;
let timer = 30;
let interval;
let userAnswers = [];

// Shuffle
questions.sort(()=>Math.random()-0.5);

function loadQuestion(){
    clearInterval(interval);
    timer = 30;
    document.getElementById("timer").innerText = timer;

    interval = setInterval(()=>{
        timer--;
        document.getElementById("timer").innerText = timer;

        if(timer === 0){
            userAnswers.push(null);
            nextQuestion();
        }
    },1000);

    let q = questions[current];
    document.getElementById("question").innerText = q.q;

    let html = "";
    q.options.forEach((opt,i)=>{
        html += `
        <button class="btn btn-outline-primary w-100 mt-2"
        onclick="checkAnswer(${i})">${opt}</button>`;
    });

    document.getElementById("options").innerHTML = html;

    updateProgress();
}

function checkAnswer(i){
    let correct = questions[current].answer;
    userAnswers.push(i);

    let buttons = document.querySelectorAll("#options button");

    buttons.forEach((btn,index)=>{
        if(index === correct){
            btn.classList.add("correct");
        } else {
            btn.classList.add("wrong");
        }
        btn.disabled = true;
    });

    if(i === correct){
        score++;
    }
}

function nextQuestion(){
    current++;
    if(current < questions.length){
        loadQuestion();
    } else {
        showResult();
    }
}

function updateProgress(){
    let percent = (current / questions.length) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

function showResult(){
    clearInterval(interval);

    let table = `
    <h3>Quiz Result</h3>
    <h5>Score: ${score}/${questions.length}</h5>

    <table class="table table-bordered table-striped mt-3">
        <thead>
            <tr>
                <th>#</th>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
    `;

    questions.forEach((q, index)=>{
        let userAns = userAnswers[index];
        let correctAns = q.answer;

        let isCorrect = userAns === correctAns;

        table += `
        <tr>
            <td>${index+1}</td>
            <td>${q.q}</td>
            <td>${userAns !== null ? q.options[userAns] : "Not Answered"}</td>
            <td>${q.options[correctAns]}</td>
            <td style="color:white; background:${isCorrect ? 'green' : 'red'}">
                ${isCorrect ? "Correct" : "Incorrect"}
            </td>
        </tr>
        `;
    });

    table += `</tbody></table>
    <button class="btn btn-warning mt-3" onclick="restartQuiz()">Restart</button>`;

    document.getElementById("question").innerHTML = "";
    document.getElementById("options").innerHTML = table;
}

// Restart
function restartQuiz(){
    current = 0;
    score = 0;
    userAnswers = [];
    questions.sort(()=>Math.random()-0.5);
    loadQuestion();
}

// Dark Mode
function toggleMode(){
    document.body.classList.toggle("dark");
}

// PDF
function downloadPDF(){
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let y = 20;

    doc.text("Quiz Result", 20, y);
    y += 10;

    doc.text(`Score: ${score}/${questions.length}`, 20, y);
    y += 10;

    questions.forEach((q, index)=>{
        let userAns = userAnswers[index];
        let correctAns = q.answer;

        let status = (userAns === correctAns) ? "Correct" : "Incorrect";

        doc.text(`Q${index+1}: ${q.q}`, 20, y);
        y += 8;

        doc.text(`Your: ${userAns !== null ? q.options[userAns] : "N/A"}`, 20, y);
        y += 8;

        doc.text(`Correct: ${q.options[correctAns]} (${status})`, 20, y);
        y += 10;

        if(y > 270){
            doc.addPage();
            y = 20;
        }
    });

    doc.save("quiz_result.pdf");
}

// Start
loadQuestion();
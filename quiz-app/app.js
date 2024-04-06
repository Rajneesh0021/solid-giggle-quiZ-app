const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const dotenv=require('dotenv').config();
const questions = require('./questions.json');

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serving HTML file
app.use(express.static('public'));

// Endpoint to get questions
app.get('/api/questions', (req, res) => {
    res.json(questions);
});

// Endpoint to submit answers
app.post('/api/submit', (req, res) => {
    const answers = req.body.answers;
    let score = 0;
    const feedback = [];

    questions.forEach((question, index) => {
        if (answers[index] === question.correctIndex.toString()) {
            score++;
            feedback.push({ question: question.question, correct: true });
        } else {
            feedback.push({ question: question.question, correct: false, correctAnswer: question.options[question.correctIndex] });
        }
    });

    res.json({ score, feedback });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

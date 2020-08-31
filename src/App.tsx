import React, {useState} from 'react';
import QuestionsCard from './components/QuestionsCard';
import {fetchQuestion, Difficulty, QuestionState} from './API'
import { GlobalStyle, Wrapper } from './App.styles';


const TOTAL_QUESTION = 10;

export type AnswerObj = {
  question: string,
  answer: string,
  correct:boolean,
  correctAnswer:string
}

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnwers] = useState<AnswerObj[]>([]);
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQUestions = await fetchQuestion(TOTAL_QUESTION, Difficulty.EASY);
    setQuestions(newQUestions);
    setScore(0);
    setUserAnwers([]);
    setNumber(0);
    setLoading(false)


  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //user answer
      const answer = e.currentTarget.value
      //check answer
      const correct = questions[number].correct_answer === answer
      if(correct) setScore(prev => prev + 10)
      
      const answerObj = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnwers(prev => [...prev, answerObj])

    }
  }

  const nextQuestion = () => {
    const nextNumber = number + 1;
    if(nextNumber === TOTAL_QUESTION){
      setGameOver(true)
    }else{

      setNumber(nextNumber);
    }
  }
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Simple Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}

        {!gameOver ? <p className="score">Score: {score} </p> : null}
        {loading && <p>Loading Question...</p>}
        {!loading && !gameOver && (
          <QuestionsCard
            questnumber={number + 1}
            totalQuestion={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTION - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
}

export default App;

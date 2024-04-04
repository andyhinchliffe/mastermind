"use client"

import React, { useState } from 'react';

export default function App() {
	const questions = [
		{
			questionText: 'What is the capital of France?',
			answerOptions: [
				{ answerText: 'New York', isCorrect: false },
				{ answerText: 'London', isCorrect: false },
				{ answerText: 'Paris', isCorrect: true },
				{ answerText: 'Dublin', isCorrect: false },
			],
		},
		{
			questionText: 'Who is CEO of Tesla?',
			answerOptions: [
				{ answerText: 'Jeff Bezos', isCorrect: false },
				{ answerText: 'Elon Musk', isCorrect: true },
				{ answerText: 'Bill Gates', isCorrect: false },
				{ answerText: 'Tony Stark', isCorrect: false },
			],
		},
		{
			questionText: 'The iPhone was created by which company?',
			answerOptions: [
				{ answerText: 'Apple', isCorrect: true },
				{ answerText: 'Intel', isCorrect: false },
				{ answerText: 'Amazon', isCorrect: false },
				{ answerText: 'Microsoft', isCorrect: false },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '1', isCorrect: false },
				{ answerText: '4', isCorrect: false },
				{ answerText: '6', isCorrect: false },
				{ answerText: '7', isCorrect: true },
			],
		},
	];

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
  const [questionState, setQuestionState] = useState(questions);
  const [topic, setTopic] = useState('');
  const [isLoadingChatGPT, setIsLoadingChatGPT] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_CHATGPT_API_KEY;

  const url = 'https://api.openai.com/v1/chat/completions';

  const handleSubmitTopic = (event) => {
    callChatGPT()
    console.log({ topic })
    console.log(ChatGPTquestion)
    event.preventDefault();
}

const handleChangeTopic = (event) => {
  setTopic(event.target.value);
}

	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};
  

  
  const callChatGPT = async () => {
    setIsLoadingChatGPT(true)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": ChatGPTquestion }],
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        // console.log(data);
        console.log(data.choices[0].message.content);
        const quizArray = JSON.parse(data.choices[0].message.content);
        // console.log(typeof quizArray)

        setQuestionState(quizArray)
        // setIsLoadingChatGPT(false)
        
        

    } catch (error) {
        
        console.error('Request failed:', error);
    }
}

const questionsString = JSON.stringify(questions);
    const ChatGPTquestion = "write 10 easy questions about " + topic + " in the format of " + questionsString;

	return (
    <div className="mx-auto p-4 w-72 bg-white rounded-xl ">
		<div className='app'>
			{showScore ? (
				<div className='score-section'>
					You scored {score} out of {questions.length}
				</div>
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
            <div>Topic {topic}</div>
						<div className='question-text'>{questionState[currentQuestion].questionText}</div>
					</div>
					<div className='answer-section p-4 '>
						{questionState[currentQuestion].answerOptions.map((answerOption) => (
							<button key={answerOption.answerText} className="bg-transparent border w-full border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-full mb-2" onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
						))}
					</div>
				</>
			)}
		</div>
    <div className=" p-4">
                            <p className=" text-sm md:text-lg mb-2">Enter your topic</p>
                            <form onSubmit={handleSubmitTopic}>
                                {/* {isLoadingChatGPT ? <Spinner></Spinner> : null} */}
                                
                                <label>
                                    {/* Topic: */}
                                    <input placeholder="Topic" className="bg-white border w-full mb-2 border-slate-300 hover:bg-slate-300 text-slate-500s font-base py-2 px-4 rounded-full" type="text" value={topic} onChange={handleChangeTopic} />
                                </label>
                                <input className="bg-transparent border w-full border-slate-300 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-full" type="submit" value="Generate" />
                            </form>
                        </div>
    </div>
	);
}

// src/components/video/CaseSimulator.tsx
import { useState } from 'react';

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
  explanation?: string;
}

interface CaseData {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface CaseSimulatorProps {
  caseData: CaseData;
}

export default function CaseSimulator({ caseData }: CaseSimulatorProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  
  const currentQuestion = caseData.questions[currentQuestionIndex];
  const totalQuestions = caseData.questions.length;
  
  const handleOptionSelect = (optionIndex: number) => {
    // Only allow selection if user hasn't already selected an answer
    if (showExplanation[currentQuestionIndex]) return;
    
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
    
    setShowExplanation(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setShowExplanation({});
  };
  
  const correctAnswers = Object.keys(selectedOptions).filter(
    questionIdx => {
      const qIdx = parseInt(questionIdx);
      const selectedOption = selectedOptions[qIdx];
      return caseData.questions[qIdx].options[selectedOption]?.isCorrect;
    }
  ).length;
  
  const hasCompletedAllQuestions = Object.keys(selectedOptions).length === totalQuestions;
  
  return (
    <div>
      {/* Case Description */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Case Description</h2>
        <p className="text-gray-800">{caseData.description}</p>
      </div>
      
      {/* Question Progress */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h3>
        <div className="text-sm text-gray-600">
          {Object.keys(selectedOptions).length} answered
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(Object.keys(selectedOptions).length / totalQuestions) * 100}%` }}
        ></div>
      </div>
      
      {/* Current Question */}
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-lg">{currentQuestion.questionText}</p>
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = selectedOptions[currentQuestionIndex] === optionIndex;
            const hasAnswered = showExplanation[currentQuestionIndex];
            const isCorrect = option.isCorrect;
            
            let optionClass = "p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200";
            
            if (hasAnswered) {
              if (isSelected && isCorrect) {
                optionClass = "p-4 border border-green-500 bg-green-50 rounded-lg";
              } else if (isSelected && !isCorrect) {
                optionClass = "p-4 border border-red-500 bg-red-50 rounded-lg";
              } else if (isCorrect) {
                optionClass = "p-4 border border-green-300 bg-green-50 rounded-lg opacity-70";
              } else {
                optionClass = "p-4 border rounded-lg opacity-70";
              }
            }
            
            return (
              <div 
                key={optionIndex}
                className={optionClass}
                onClick={() => handleOptionSelect(optionIndex)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {hasAnswered && isCorrect && (
                      <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {(!hasAnswered || (!isSelected && !isCorrect)) && (
                      <div className="h-6 w-6 border border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    {option.optionText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {showExplanation[currentQuestionIndex] && currentQuestion.explanation && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Explanation</h4>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next Question
          </button>
        ) : (
          hasCompletedAllQuestions && (
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Restart Quiz
            </button>
          )
        )}
      </div>
      
      {/* Quiz Results */}
      {hasCompletedAllQuestions && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg mb-4">
            You scored {correctAnswers} out of {totalQuestions} questions correctly.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full ${
                correctAnswers / totalQuestions >= 0.7 ? 'bg-green-600' : 'bg-yellow-500'
              }`} 
              style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-700">
            {correctAnswers / totalQuestions >= 0.7 
              ? 'Great job! You have a good understanding of this topic.' 
              : 'Keep studying! You might want to review this material again.'}
          </p>
        </div>
      )}
    </div>
  );
}
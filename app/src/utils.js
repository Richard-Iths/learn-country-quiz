import * as R from 'ramda'
import countries from './countries.js'

export const randomQuestions = () => {
	const countriesArr = R.compose(R.keys)(countries).sort(() => 0.5 - Math.random())
	const questions = {}

	for (let i = 1; i <= 5; i++) {
		const question = Math.floor(Math.random() * countriesArr.length - 1)
		const correctAnswer = countriesArr.splice(question, 1).join().toLowerCase()
		questions[i] = { correct: correctAnswer, alternatives: {} }
		const questionsAlternative = [...countriesArr]
		const alternatives = [correctAnswer]
		for (let r = 1; r <= 4; r++) {
			const randomAlternative = Math.floor(Math.random() * countriesArr.length - 1)
			alternatives.push(questionsAlternative.splice(randomAlternative, 1).join().toLowerCase())
		}
		alternatives.sort(() => 0.5 - Math.random()).forEach((item, index) => {
			questions[i].alternatives[index + 1] = item
		})
	}
	return questions
}

const hardCodedQuestions = {
	1: {
		alternatives: {
			1: 'swe',
			2: 'fra',
			3: 'dnk',
			4: 'bra',
		},
		correct: 'swe',
	},
	2: {
		alternatives: {
			1: 'blz',
			2: 'fra',
			3: 'cub',
			4: 'cog',
		},
		correct: 'fra',
	}
}

export const createGame = () => {

	const { improvedQuestions } = JSON.parse(localStorage.getItem('features'))

	const generatedQuestions = improvedQuestions ? randomQuestions() : hardCodedQuestions
	return {
		currentQuestion: 1,
		questions: generatedQuestions,
		score: { player1: 0, player2: 0 },
		status: 'starting',
	}
}


export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

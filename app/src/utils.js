import * as R from 'ramda'
import countries from './countries.js'
import { serverTimestamp } from "firebase/database";
export const randomQuestions = (numbQuestion) => {
	const countriesArr = R.compose(R.keys)(countries).sort(() => 0.5 - Math.random())
	const questions = {}

	for (let i = 1; i <= 5; i++) {
		const question = Math.floor(Math.random() * countriesArr.length - 1)
		const correctAnswer = countriesArr.splice(question, 1).join().toLowerCase()
		questions[i] = { correct: correctAnswer, alternatives: {} }
		const questionsAlternative = [...countriesArr]
		const alternatives = [correctAnswer]
		for (let r = 1; r <= 3; r++) {
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

export const createGame = (props) => {

	const { improvedQuestions } = JSON.parse(localStorage.getItem('features'))

	const generatedQuestions = improvedQuestions ? randomQuestions(props) : hardCodedQuestions
	return {
		currentQuestion: 1,
		questions: generatedQuestions,
		score: { player1: 0, player2: 0 },
		status: 'starting',
	}
}


export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))



export const SetCountDown = async (snap, setCountDownTime, setIsCountDown) => {
	const time = serverTimestamp()
	const EndTimeLocale = new Date().toLocaleString(time.sv)
	const EndTimeMs = new Date(EndTimeLocale).getTime() + (snap.seconds * 1000)
	setCountDownTime(snap.seconds)
	let Intervallen = null
	setIsCountDown(true)
	if (!Intervallen) {
		Intervallen = setInterval(() => {

			const StartTimeLocale = new Date().toLocaleString(time.sv)
			const StartTimeMs = new Date(StartTimeLocale).getTime()
			const CountDown = EndTimeMs - StartTimeMs
			if (CountDown <= 0) {
				setIsCountDown(false)
				clearInterval(Intervallen)
			}

			setCountDownTime(parseInt(Math.ceil(CountDown / 1000)))
		}, 1000)
	}
	await sleep(snap.seconds * 1000)
}


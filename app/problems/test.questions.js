import { equal, notEqual } from "assert"
import { randomQuestions } from "../src/utils.js"



describe("Test generated questions", () => {
  it("should be different question", () => {
    const randomquestionsOne = randomQuestions()
    const randomquestionsTwo = randomQuestions()
    notEqual(randomquestionsOne, randomquestionsTwo)
  }
  )
})


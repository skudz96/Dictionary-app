import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let x = 123123123123;

async function getRandomWord() {
  try {
    const response = await axios.get(
      "https://random-word-api.herokuapp.com/word"
    );
    return response.data[0];
  } catch (error) {
    console.error("Error fetching random word:", error.message);
    return getRandomWord();
  }
}

async function getDefinition(word) {
  try {
    const response = await axios.get(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    return response.data[0].meanings;
  } catch (error) {
    console.error("Error fetching definition:", error.message);
    return getDefinition(await getRandomWord());
  }
}

app.get("/", async (req, res) => {
  try {
    const randomWord = await getRandomWord();
    const definitionArray = await getDefinition(randomWord);

    res.render("index.ejs", {
      word: randomWord,
      definition: definitionArray,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal server Error");
  }
});

app.post("/get-definition", async (req, res) => {
  let searchedWord = req.body.word;
  const definitionArray = await getDefinition(searchedWord);
  try {
    const response = await axios.get(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + searchedWord
    );
    res.render("index.ejs", {
      word: searchedWord,
      definition: definitionArray,
      origin: response.data[0].origin,
    });
  } catch (error) {
    console.error("Word not found, try again!", error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

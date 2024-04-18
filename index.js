import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

    console.log("Random word:", randomWord);
    console.log("Definition:", definitionArray);

    res.render("index.ejs", {
      word: randomWord,
      definition: definitionArray,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const firstResponse = await axios.get(
      "https://random-word-api.herokuapp.com/word"
    );
    const randomWord = firstResponse.data[0];
    const secondResponse = await axios.get(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + randomWord
    );
    var definitionArray = JSON.stringify(secondResponse.data[0].meanings);

    console.log(definitionArray);

    console.log(definitionArray);

    res.render("index.ejs", {
      word: firstResponse.data,
      definition: JSON.parse(definitionArray),
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

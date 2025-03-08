const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Joi = require('joi');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection string (change to your actual connection string)
const connectionString = 'mongodb+srv://<username>:<password>@cluster0.cm7sr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
});

// Recipe Model
const Recipe = mongoose.model('Recipe', recipeSchema);

// Custom middleware to log requests with timestamps
function requestLogger(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} Request to ${req.url}`);
  next();
}

app.use(requestLogger);

// Validation Schema using Joi
const recipeValidationSchema = Joi.object({
  title: Joi.string().min(3).required(),
  ingredients: Joi.string().min(10).required(),
  instructions: Joi.string().min(10).required(),
});

// Routes

// GET: Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).send('Error retrieving recipes');
  }
});

// POST: Add a new recipe
app.post('/api/recipes', async (req, res) => {
  const { error } = recipeValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
    });

    await recipe.save();
    res.status(201).send(recipe);
  } catch (err) {
    res.status(500).send('Error adding recipe');
  }
});

// PUT: Update an existing recipe by ID
app.put('/api/recipes/:id', async (req, res) => {
  const { error } = recipeValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, ingredients: req.body.ingredients, instructions: req.body.instructions },
      { new: true }
    );

    if (!updatedRecipe) return res.status(404).send('Recipe not found');
    res.status(200).send(updatedRecipe);
  } catch (err) {
    res.status(500).send('Error updating recipe');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

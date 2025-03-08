document.getElementById('recipe-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('recipe-title').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;

    if (title && ingredients && instructions) {
        const recipeList = document.getElementById('recipes');

        const recipeItem = document.createElement('li');
        recipeItem.classList.add('recipe-item');

        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = title;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.textContent = `Ingredients: ${ingredients}`;

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = `Instructions: ${instructions}`;

        recipeItem.appendChild(recipeTitle);
        recipeItem.appendChild(recipeIngredients);
        recipeItem.appendChild(recipeInstructions);

        recipeList.appendChild(recipeItem);

        // Clear form after submission
        document.getElementById('recipe-title').value = '';
        document.getElementById('recipe-ingredients').value = '';
        document.getElementById('recipe-instructions').value = '';
    } else {
        alert("All fields are required!");
    }
});

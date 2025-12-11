// recipe.js

//displayRecipes function
function displayRecipes(recipeId) {
    console.log('I was called to display recipe number ', recipeId);
}


// main js starts here
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
displayRecipes(recipeId);
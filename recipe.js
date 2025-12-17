// recipe.js

//displayRecipes function
async function displayRecipes(recipeId) {
    try {
    const res = await fetch(`/api/get_chosen_recipe?searchTerm=${encodeURIComponent(recipeId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json();
    const recipeMeta = json.recipeMeta;
    const recipeSteps = json.recipeSteps;
    const recipeIngredients = json.recipeIngredients;
    
    console.log('recipeMeta: ', recipeMeta);
    console.log('recipeSteps: ', recipeSteps);
    console.log('recipeIngredients: ', recipeIngredients);


    if (res.ok) {
        // if (!results.length) {
        //     searchBtn.disabled = false;
        //     searchBtn.textContent = 'Search';
        //     searchMsg.textContent = 'No results found';
        //     addIngredientMsg.textContent = '';
        //     return;
        // }
    }
    } catch (err) {
    // searchBtn.disabled = false;
    // searchBtn.textContent = 'Search';
    // searchMsg.textContent = 'Network error: ' + err.message;
    // addIngredientMsg.textContent = '';
}
}


// main js starts here
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
displayRecipes(recipeId);



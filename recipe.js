// recipe.js
// fetches selected recipe from DB and posts text on screen

// renderRecipeIngredients function
function renderRecipeIngredients(ingredients) {
    const container = document.getElementById('recipe_ingredients');
    container.innerHTML = '';

    const ul = document.createElement('ul');

    // helper to check if a value should be displayed
    const hasValue = v =>
        v !== null &&
        v !== undefined &&
        v !== '' &&
        v !== 0 &&
        v !== '0';

    ingredients.forEach(item => {
    const parts = [];

    if (hasValue(item.amount_whole)) {
        parts.push(item.amount_whole);
    }

    if (hasValue(item.amount_frac)) {
        parts.push(item.amount_frac);
    }

    if (hasValue(item.unit_id)) {
        parts.push(item.unit_id);
    }

    if (hasValue(item.ingredient_name)) {
        parts.push(item.ingredient_name);
    }

    if (parts.length > 0) {
        const li = document.createElement('li');
        li.textContent = parts.join(' ');
        ul.appendChild(li);
        ul.innerHTML += '<br>';
    }
    });

    container.appendChild(ul);
}

// renderRecipeSteps function
function renderRecipeSteps(steps) {
    const container = document.getElementById('recipe_steps');

    // clear existing content
    container.innerHTML = '';

    const ol = document.createElement('ol');

    // ensure correct order
    steps
    .sort((a, b) => a.step_no - b.step_no)
    .forEach(step => {
        if (!step.step_text) return;

        const li = document.createElement('li');
        li.textContent = step.step_text;
        ol.appendChild(li);
        ol.innerHTML += '<br>';
    });

    container.appendChild(ol);
}

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
    
        if(json) {
            const recipe_title          = document.getElementById("recipe_title");
            const recipe_description    = document.getElementById("recipe_description");

            recipe_title.innerHTML = recipeMeta[0].recipe_name;
            recipe_description.innerHTML = recipeMeta[0].recipe_description;
            renderRecipeIngredients(recipeIngredients);
            renderRecipeSteps(recipeSteps);
        }

    } catch (err) {
        recipe_title.innerHTML = 'Network error: ' + err.message;
    }
}

// 
// main js starts here
// 
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
displayRecipes(recipeId);



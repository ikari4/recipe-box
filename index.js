// index.js

// getRecipes function
async function getRecipes(catDropdown) {
    msg.textContent = "Loading…";
    recipeList.innerHTML = "";

    try {
        const res = await fetch('/api/recipes_db', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { dropValue: catDropdown.value }),
        });
        
        const recipes = await res.json();
        
        if (res.ok) {
            msg.textContent = `Loaded ${recipes.items.length} ${catDropdown.value} recipes`

        recipes.items.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `recipe.html?id=${item.recipe_id}`;
            link.textContent = item.recipe_name;
            li.appendChild(link);
            recipeList.appendChild(li);
        });

        } else {
            msg.textContent = "Error";
        };
    
    } catch (err) {
    msg.textContent = "Network error: " + err.message;
    }
}

// main js starts here
// setup divs in js to modify DOM
const msg = document.getElementById('msg_div');
const recipeList = document.getElementById('recipe_list');
const addDiv = document.getElementById('index_add');

// create link to add_page.html in index_add div
const addLink = document.createElement('a');
addLink.href = 'add_page.html';
addLink.textContent = '+';
addDiv.appendChild(addLink);

// event listener for category dropdown
const catDropdown = document.getElementById('category_drop');
catDropdown.addEventListener('change', () => {
    getRecipes(catDropdown);
});

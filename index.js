// index.js
// displays category dropdown on frontpage of site
// listens for selection and fetches/displays list of recipes
// each recipe has options to edit, delete or view

// getRecipes function: takes selected catorgy and displays list of recipes
async function getRecipes(catDropdownValue) {

    // if user wants to add a new recipe, this sends them to the add page
    if(catDropdownValue === 'new') {
        window.location.href =`add_page.html?id=${catDropdownValue}`;
    }

    msg.innerHTML = `Loading… ${catDropdownValue}`;
    recipeList.innerHTML = "";

    // otherwise, query the database to get the list of recipes in the chosen category
    try {
        const res = await fetch(`/api/get_recipes?category=${encodeURIComponent(catDropdownValue)}`);
        const recipes = await res.json();
        
        // build the results table with options to edit, view or delete each recipe
        if (res.ok) {
            msg.textContent = `Loaded ${recipes.items.length} ${catDropdownValue}`
            const table = document.createElement('table');
            table.className = 'results-table2';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>&#9998</th>
                        <th>Results</th>
                        <th>&#128465</th>
                    </tr>
                </thead>
            `;
            const tbody = document.createElement('tbody');
            recipes.items.forEach(r => {
                const tr = document.createElement('tr');
                const editMe = document.createElement('button');
                editMe.textContent = '✓';
                const deleteMe = document.createElement('button');
                deleteMe.textContent = 'X';

                if (r.recipe_id !=null) deleteMe.dataset.id=String(r.recipe_id);
                
                // when delete button is clicked, delete from DB
                deleteMe.addEventListener('click', async() => {
                    try {
                        const patchRes = await fetch('/api/delete_recipe', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ recipe_id: deleteMe.dataset.id })
                        });

                        if (patchRes.ok) {
                            msg.textContent = `Deleted "${r.recipe_name}" successfully.`;
                            tr.classList.add("deletedRow");
                            deleteMe.disabled = true;
                        } else {
                            msg.textContent = `Error deleting "${r.recipe_name}".`;
                        }

                    } catch (err) {
                        msg.textContent = 'Network error: ' + err.message;
                    }
                });

                // when edit button is clicked, go to add page with recipe
                editMe.addEventListener('click', async() => {
                    window.location.href = `add_page.html?id=${r.recipe_id}`;
                });

                const td1 = document.createElement('td');
                td1.className = 'edit-Btn';
                td1.appendChild(editMe);
                tr.appendChild(td1);
                const td2 = document.createElement('td');
                const link = document.createElement('a');
                link.href = `recipe.html?id=${r.recipe_id}`;
                link.textContent = r.recipe_name;
                td2.appendChild(link);
                tr.appendChild(td2);
                const td3 = document.createElement('td');
                td3.className = 'del-Btn';
                td3.appendChild(deleteMe)
                tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            recipeList.appendChild(table);

        } else {
            searchMsg.textContent = 'Error: ' + (json?.error || res.statusText);
        }

    } catch (err) {
    msg.textContent = "Network error: " + err.message;
    }
}

// main js starts here
// setup divs in js to modify DOM
const msg = document.getElementById('index_msg');
const recipeList = document.getElementById('recipe_list');
const addDiv = document.getElementById('index_add');

// event listener for category dropdown set up on index.html
const catDropdown = document.getElementById('category_drop');
catDropdown.addEventListener('change', () => {
    getRecipes(catDropdown.value);
    catDropdown.value = 'Select Category';
});



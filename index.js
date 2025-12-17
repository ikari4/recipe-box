// index.js

// getRecipes function
async function getRecipes(catDropdownValue) {

    if(catDropdownValue === 'new') {
        window.location.href =`add_page.html?id=${catDropdownValue}`;
    }

    msg.innerHTML = `Loading… ${catDropdownValue}`;
    recipeList.innerHTML = "";

    try {
        const res = await fetch(`/api/get_recipes?category=${encodeURIComponent(catDropdownValue)}`);
        const recipes = await res.json();
        
        if (res.ok) {
            msg.textContent = `Loaded ${recipes.items.length} ${catDropdownValue}`
            const table = document.createElement('table');
            table.className = 'results-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Results</th>
                        <th>&#128465</th>
                    </tr>
                </thead>
            `;
            const tbody = document.createElement('tbody');
            recipes.items.forEach(r => {
                const tr = document.createElement('tr');
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

                const td1 = document.createElement('td');
                const link = document.createElement('a');
                // link.href = `recipe.html?id=${r.recipe_id}`;
                link.href = `add_page.html?id=${r.recipe_id}`;
                link.textContent = r.recipe_name;
                td1.appendChild(link);
                tr.appendChild(td1);
                const td2 = document.createElement('td');
                td2.className = 'del-Btn';
                td2.appendChild(deleteMe)
                tr.appendChild(td2);
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

// create link to add_page.html in index_add div
// const addLink = document.createElement('a');
// addLink.href = 'add_page.html';
// addLink.textContent = 'Add New Recipe or Ingredient';
// addDiv.appendChild(addLink);

// event listener for category dropdown
const catDropdown = document.getElementById('category_drop');
catDropdown.addEventListener('change', () => {
    getRecipes(catDropdown.value);
    catDropdown.value = 'Select Category';
});



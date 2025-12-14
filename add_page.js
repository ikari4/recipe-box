// add_page.js

// call functions to get units and ingredients then calls to create first ingredient row
async function initIngredients() {
    try {
        const ingredientObject = await getIngredients();
        ingredientObjectGlobal = ingredientObject;

        // initialize first rows
        ingredientNo = 0;
        addIngredientRow(ingredientNo, ingredientObjectGlobal);
        stepNo = 0;
        addStepRow(stepNo);

    } catch (err) {
        console.error("Init failed:", err);
    }
}

// gets all ingredients from database
async function getIngredients() {
    try {
        const res = await fetch(`api/get_ingredients`);
        const ingredients = await res.json();
        
        if (res.ok) {
            return(ingredients);
        } else {
            addRecipeMsg.textContent = "Error";
        };
    
    } catch (err) {
        addRecipeMsg.textContent = "Network error: " + err.message;
    }
}

// adds ingredient row on page
function addIngredientRow(ingredientNo, ingredientObject)  {
    ingredientObject = ingredientObject || { ingredients: [] };

    // create quantity input
    const wholes = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const addIngredientQuantity = document.createElement("select")
    addIngredientQuantity.name=`addIngredientQuantity${ingredientNo}`;
    addIngredientQuantity.id=`addIngredientQuantity${ingredientNo}`;
    const quantLabel = document.createElement("option");
    quantLabel.textContent = "Qty";
    quantLabel.value = "";
    quantLabel.disabled = true;
    quantLabel.selected = true;
    quantLabel.defaultSelected = true;
    addIngredientQuantity.appendChild(quantLabel);
    ingredientEntry.appendChild(addIngredientQuantity);
    wholes.forEach(value => {
        const wholeOpt = document.createElement("option");
        wholeOpt.value = value;
        wholeOpt.textContent = value;
        addIngredientQuantity.appendChild(wholeOpt);
    });
    const fractions = ["0", "1/8", "1/4", "1/3", "1/2", "2/3", "3/4"];
    const addIngredientFraction = document.createElement("select");
    addIngredientFraction.name=`addIngredientFraction${ingredientNo}`;
    addIngredientFraction.id=`addIngredientFraction${ingredientNo}`;
    const fracLabel = document.createElement("option");
    fracLabel.textContent = "Qty";
    fracLabel.value = "";
    fracLabel.disabled = true;
    fracLabel.selected = true;
    fracLabel.defaultSelected = true;
    addIngredientFraction.appendChild(fracLabel);
    fractions.forEach(value => {
        const fracOpt = document.createElement("option");
        fracOpt.value = value;
        fracOpt.textContent = value;
        addIngredientFraction.appendChild(fracOpt);
    });
    ingredientEntry.appendChild(addIngredientFraction);

    // create unit drop
    const units = ["tsp", "tbsp", "fl oz", "cup", "pt", "qt", 
        "gal", "oz", "lb", "g", "kg", "mL", "L", "in", "small",
        "medium", "large"];
    const addUnitDrop = document.createElement("select");
    addUnitDrop.name = `addUnitDrop${ingredientNo}`;
    addUnitDrop.id = `addUnitDrop${ingredientNo}`;
    const unitLabel = document.createElement("option");
    unitLabel.textContent = "Unit";
    unitLabel.value = "";
    unitLabel.disabled = true;
    unitLabel.selected = true;
    unitLabel.defaultSelected = true;
    addUnitDrop.appendChild(unitLabel);
    units.forEach(unit => {
        const unitOpt = document.createElement("option");
        unitOpt.value = unit;
        unitOpt.textContent = unit;
        addUnitDrop.appendChild(unitOpt);
    });
    ingredientEntry.appendChild(addUnitDrop);
    
    // create ingredient drop
    const addIngredientDrop = document.createElement("select");
    addIngredientDrop.name = `addIngredientDrop${ingredientNo}`;
    addIngredientDrop.id = `addIngredientDrop${ingredientNo}`;
    const ingrLabel = document.createElement("option");
    ingrLabel.textContent = "Ingredient";
    ingrLabel.value = "";
    ingrLabel.disabled = true;
    ingrLabel.selected = true;
    addIngredientDrop.appendChild(ingrLabel);
    ingredientObject.ingredients.forEach(ingredient => {
        const ingrOpt = document.createElement("option");
        ingrOpt.value = ingredient.ingredient_id;
        ingrOpt.textContent = ingredient.ingredient_name;
        addIngredientDrop.appendChild(ingrOpt);
    });
    ingredientEntry.appendChild(addIngredientDrop);

    // create add an ingredient button
    addIngredientBtn.type = "button";
    addIngredientBtn.textContent = "+";
    ingredientEntry.appendChild(addIngredientBtn);

    // add line break
    ingredientEntry.appendChild(document.createElement("br"));
}

// adds steps row to page
function addStepRow(stepNo)  {
    // create quantity input
    const addStep = document.createElement("textarea")
    addStep.rows = 3;
    addStep.cols = 50;
    addStep.name = `addStep${stepNo}`;
    addStep.id = `addStep${stepNo}`;
    stepEntry.appendChild(addStep);

    // create add an ingredient button
    addStepBtn.type = "button";
    addStepBtn.textContent = "+";
    stepEntry.appendChild(addStepBtn);

    // add line break
    stepEntry.appendChild(document.createElement("br"));

}

// main script starts here
const addRecipeForm     = document.getElementById("addRecipeForm");
const ingredientEntry   = document.getElementById("ingredientEntry");
const addIngredientBtn  = document.createElement("button");
const stepEntry         = document.getElementById("stepEntry");
const addStepBtn        = document.createElement("button");
const submitRecipeBtn   = document.getElementById("submitRecipeBtn");
const addRecipeMsg      = document.getElementById("addRecipeMsg");

// code copied from groceries

const newIngredientForm = document.getElementById('addNewIngredient');
const addIngredientMsg = document.getElementById('addIngredientMsg');
const searchMsg = document.getElementById('searchMsg');
const searchForm = document.getElementById('search');
const listArea = document.getElementById('listArea');
const searchBtn = document.getElementById('searchBtn');

// helper to escape HTML for safe insertion into the DOM
function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, s => (
        {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]
    ));
}

// Submit Add Form
newIngredientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        ingredientName: newIngredientForm.ingredientName.value.trim()
    };

    try {
        const res = await fetch('/api/post_new_ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });

        const json = await res.json();
        if (res.ok) {
            addIngredientMsg.textContent = 'Saved — thank you!';
            searchMsg.textContent = '';
            newIngredientForm.reset();
        } else {
            addIngredientMsg.textContent = 'Error: ' + (json?.error || res.statusText);
            searchMsg.textContent = '';
        }
    } catch (err) {
        addIngredientMsg.textContent = 'Network error: ' + err.message;
        searchMsg.textContent = '';
    }
});

// Submit Search Form
searchForm.addEventListener('submit', async (e) => {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Wait...';
    listArea.innerHTML = '';
    e.preventDefault();
    const searchIngredient = searchForm.searchIngredient.value.trim()

    try {
        const res = await fetch(`/api/get_search?searchTerm=${encodeURIComponent(searchIngredient)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const json = await res.json();
        const results = json.items;

        if (res.ok) {
            if (!results.length) {
                searchBtn.disabled = false;
                searchBtn.textContent = 'Search';
                searchMsg.textContent = 'No results found';
                addIngredientMsg.textContent = '';
                return;
            }

            // build table
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
            results.forEach(r => {
                const tr = document.createElement('tr');
                // checkbox for adding item to grocery list
                // const checkbox = document.createElement('input');
                // checkbox.type = 'checkbox';
                // checkbox.checked = r.checked === 1;
                // button for deleting item from database
                const deleteMe = document.createElement('button');
                deleteMe.textContent = 'X';

                if (r.ingredient_id !=null) deleteMe.dataset.id=String(r.ingredient_id);
                
                // When checkbox changes, update DB and refresh list
                // checkbox.addEventListener('change', async () => {
                //     try {
                //         const patchRes = await fetch('/api/patch', {
                //             method: 'PATCH',
                //             headers: { 'Content-Type': 'application/json' },
                //             body: JSON.stringify({ id: checkbox.dataset.id, checked: checkbox.checked })
                //         });

                //         if (patchRes.ok) {
                //             searchMsg.textContent = `Updated "${r.item_name}" successfully.`;
                //             addIngredientMsg.textContent = '';
                //         } else {
                //             searchMsg.textContent = `Error updating "${r.item_name}".`;
                //             addIngredientMsg.textContent = '';
                //         }
                //     } catch (err) {
                //         searchMsg.textContent = 'Network error: ' + err.message;
                //         addIngredientMsg.textContent = '';
                //     }
                // });

                // When delete button is clicked, delete from DB
                deleteMe.addEventListener('click', async() => {
                    try {
                        const patchRes = await fetch('/api/delete', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ingredient_id: deleteMe.dataset.id })
                        });

                        if (patchRes.ok) {
                            searchMsg.textContent = `Deleted "${r.ingredient_name}" successfully.`;
                            addIngredientMsg.textContent = '';
                            tr.classList.add("deletedRow");
                            deleteMe.disabled = true;
                        } else {
                            searchMsg.textContent = `Error deleting "${r.ingredient_name}".`;
                            addIngredientMsg.textContent = '';
                        }

                    } catch (err) {
                        searchMsg.textContent = 'Network error: ' + err.message;
                        addIngredientMsg.textContent = '';
                    }
                });

                const ingredient = r.ingredient_name ?? '';
                // const store = r.store ?? '';
                // const category = r.category ?? '';
                tr.innerHTML = `
                    <td class="cb-cell"></td>
                    <td>${escapeHtml(ingredient)}</td>
                    <td class="del-Btn"></td>
                `;

                // const cbCell = tr.querySelector('.cb-cell');
                // if (cbCell) cbCell.appendChild(checkbox);
                
                const delBtn = tr.querySelector('.del-Btn');
                if (delBtn) delBtn.appendChild(deleteMe);

                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            listArea.appendChild(table);
            searchMsg.textContent = `Found ${results.length} ingredient(s)`;
            addIngredientMsg.textContent = '';
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
            searchForm.reset();

        } else {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
            searchMsg.textContent = 'Error: ' + (json?.error || res.statusText);
            addIngredientMsg.textContent = '';
            
        }
    } catch (err) {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
        searchMsg.textContent = 'Network error: ' + err.message;
        addIngredientMsg.textContent = '';
    }
    
});





// code copied from groceries

// globals to hold fetched lookup data and initiate page
let ingredientObjectGlobal;
initIngredients();

// display placeholders for counters (rows are created after fetch completes)
var ingredientNo = 0;
var stepNo = 0;

// event listenter to add a new ingredient row
addIngredientBtn.addEventListener("click", () => {
    ingredientNo += 1;
    addIngredientRow(ingredientNo, ingredientObjectGlobal);
})

// event listener to add a new step row
addStepBtn.addEventListener("click", () => {
    stepNo += 1;
    addStepRow(stepNo);
})

// event listener for new recipe submit form
addRecipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const addRecipeName         = document.getElementById("addRecipeName");
    const categoryDrop          = document.getElementById("categoryDrop");
    const addRecipeDescription  = document.getElementById("addRecipeDescription");

    // log recipe metadata and get recipe_id back
    const addRecipeData = [];
    addRecipeData.push({
        recipe_name: addRecipeName.value,
        recipe_category: categoryDrop.value,
        recipe_description: addRecipeDescription.value
    });

    const recipeRes = await fetch("/api/post_recipe_metadata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            addRecipeData: addRecipeData
        })
    });

    const recipeJson = await recipeRes.json();
    const recipe_id = recipeJson.recipe_id;

    // get all the entered ingredient info and log
    const ingredientData = [];

    for (let i = 0; i <= ingredientNo; i++) {
        const quantityEl = document.getElementById(`addIngredientQuantity${i}`);
        const fractionEl = document.getElementById(`addIngredientFraction${i}`);
        const unitEl     = document.getElementById(`addUnitDrop${i}`);
        const ingredEl   = document.getElementById(`addIngredientDrop${i}`);

        if (ingredEl.value === "") continue;

        ingredientData.push({
            recipe_id: recipe_id,
            ingredient_no: i, 
            amount_whole: quantityEl.value,
            amount_frac: fractionEl.value,
            unit_id: unitEl.value,
            ingredient_id: Number(ingredEl.value)
        });
    }

    // get all the entered step info and log
    const stepData = [];

    for (let i = 0; i <= stepNo; i++) {
        const stepEl = document.getElementById(`addStep${i}`);

        if (stepEl.value === "") continue;

        stepData.push({
            recipe_id: recipe_id,
            step_no: i, 
            step_text: stepEl.value,
        });
    }
console.log('stepData: ', stepData);
    // log new recipe ingredient data
    const ingredientRes = await fetch("/api/post_ingredient_data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ingredientData: ingredientData
        })
    });

    const ingredientJson = await ingredientRes.json();

    // log new recipe ingredient data
    const stepRes = await fetch("/api/post_step_data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stepData: stepData
        })
    });

    const stepJson = await stepRes.json();

    if (ingredientJson.success || stepJson.success) {
        
        alert('Recipe added successfully');
        addRecipeForm.reset();
        location.reload();
    }
});

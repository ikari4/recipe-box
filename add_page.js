// add_page.js

//displayRecipes function
async function displayRecipes(recipeId) {
    try {
        const res = await fetch(`/api/get_chosen_recipe?searchTerm=${encodeURIComponent(recipeId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error("Failed to Load Recipe");

    const json = await res.json();
    const recipeMeta = json.recipeMeta[0];
    const recipeSteps = json.recipeSteps;
    const recipeIngredients = json.recipeIngredients;

    populateRecipeMeta(recipeMeta);
    populateIngredients(recipeIngredients);
    populateSteps(recipeSteps);

    } catch (err) {
        console.error("Load recipe failed:", err);
    }
}

// populateRecipeMeta function
function populateRecipeMeta(meta) {
    document.getElementById("addRecipeName").value = meta.recipe_name;
    document.getElementById("addRecipeDescription").value = meta.recipe_description;

  // If category is returned
    if (meta.recipe_category) {
        document.getElementById("categoryDrop").value = meta.recipe_category;
    }
}

// populateIngredients function
function populateIngredients(ingredients) {
    ingredientEntry.innerHTML = "";
    ingredientNo = 0;

    ingredients
        .sort((a, b) => a.ingredient_no - b.ingredient_no)
        .forEach((ing, index) => {
        addIngredientRow(index, ingredientObjectGlobal);

        document.getElementById(`addIngredientQuantity${index}`).value =
            ing.amount_whole;

        document.getElementById(`addIngredientFraction${index}`).value =
            ing.amount_frac;

        document.getElementById(`addUnitDrop${index}`).value =
            ing.unit_id;

        document.getElementById(`addIngredientDrop${index}`).value =
            ing.ingredient_id;
        });

    ingredientNo = ingredients.length - 1;
}

// populateSteps function
function populateSteps(steps) {
    stepEntry.innerHTML = "";
    stepNo = 0;

    steps
        .sort((a, b) => a.step_no - b.step_no)
        .forEach((step, index) => {
        addStepRow(index);
        document.getElementById(`addStep${index}`).value = step.step_text;
        });
    stepNo = steps.length -1;        
}

// call functions to get units and ingredients then calls to create first ingredient row
async function initIngredients() {
    try {
        ingredientObjectGlobal = await getIngredients();

        ingredientNo = 0;
        stepNo = 0;

        // Only create empty rows if NEW recipe
        if (!recipeId || recipeId === 'new') {
            addIngredientRow(ingredientNo, ingredientObjectGlobal);
            addStepRow(stepNo);
        }

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

    const row = document.createElement("div");
    row.className = "ingredient-row";

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
    // ingredientEntry.appendChild(addIngredientQuantity);
    wholes.forEach(value => {
        const wholeOpt = document.createElement("option");
        wholeOpt.value = value;
        wholeOpt.textContent = value;
        addIngredientQuantity.appendChild(wholeOpt);
    });
    const fractions = ["0","1/8", "1/4", "1/3", "1/2", "2/3", "3/4"];
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
    // ingredientEntry.appendChild(addIngredientFraction);

    // create unit drop
    const units = ["tsp", "tbsp", "fl oz", "cup", "pt", "qt", 
        "gal", "oz", "lb", "g", "kg", "mL", "L", "in", "small",
        "medium", "large", "pinch", "dash"];
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
    // ingredientEntry.appendChild(addUnitDrop);
    
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
    // ingredi/entEntry.appendChild(addIngredientDrop);

    // create add an ingredient button
    addIngredientBtn.type = "button";
    addIngredientBtn.textContent = "+";
    // ingredientEntry.appendChild(addIngredientBtn);
    
    row.append(
        addIngredientQuantity,
        addIngredientFraction,
        addUnitDrop,
        addIngredientDrop,
        addIngredientBtn
    );
    ingredientEntry.appendChild(row);
    
    // add line break
    // ingredientEntry.appendChild(document.createElement("br"));
}

// adds steps row to page
function addStepRow(stepNo)  {
    // create quantity input
    const addStep = document.createElement("textarea")
    const row = document.createElement("div");
    row.className = "step-row";
    addStep.placeholder = "Enter Step Text"
    addStep.rows = 3;
    addStep.name = `addStep${stepNo}`;
    addStep.id = `addStep${stepNo}`;
    // stepEntry.appendChild(addStep);

    // create add an ingredient button
    addStepBtn.type = "button";
    addStepBtn.textContent = "+";
    // stepEntry.appendChild(addStepBtn);
    row.append(addStep, addStepBtn);
    stepEntry.appendChild(row);
    // add line break
    // stepEntry.appendChild(document.createElement("br"));

}

// main script starts here
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

if(recipeId && recipeId !== 'new') {
    displayRecipes(recipeId);
}

const addRecipeForm     = document.getElementById("addRecipeForm");
const ingredientEntry   = document.getElementById("ingredientEntry");
const addIngredientBtn  = document.createElement("button");
const stepEntry         = document.getElementById("stepEntry");
const addStepBtn        = document.createElement("button");
const submitRecipeBtn   = document.getElementById("submitRecipeBtn");
const addRecipeMsg      = document.getElementById("addRecipeMsg");
const newIngredientForm = document.getElementById('addNewIngredient');
const addIngredientMsg  = document.getElementById('addIngredientMsg');
const searchMsg         = document.getElementById('searchMsg');
const searchForm        = document.getElementById('search');
const listArea          = document.getElementById('listArea');
const searchBtn         = document.getElementById('searchBtn');
const ingredientSubmitBtn = document.getElementById('ingredientSubmitBtn');

// submit new ingredient form
newIngredientForm.addEventListener('submit', async (e) => {
    ingredientSubmitBtn.disabled = true;
    ingredientSubmitBtn.textContent = 'Wait...';
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
            ingredientSubmitBtn.disabled = false;
            ingredientSubmitBtn.textContent = 'Submit';
            addIngredientMsg.textContent = 'Saved — thank you!';
            searchMsg.textContent = '';
            newIngredientForm.reset();
        } else {
            ingredientSubmitBtn.disabled = false;
            ingredientSubmitBtn.textContent = 'Submit';
            addIngredientMsg.textContent = 'Error: ' + (json?.error || res.statusText);
            searchMsg.textContent = '';
        }
    } catch (err) {
        ingredientSubmitBtn.disabled = false;
        ingredientSubmitBtn.textContent = 'Submit';
        addIngredientMsg.textContent = 'Network error: ' + err.message;
        searchMsg.textContent = '';
    }
});

// submit search form
searchForm.addEventListener('submit', async (e) => {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Wait...';
    listArea.innerHTML = '';
    e.preventDefault();
    const searchIngredient = searchForm.searchIngredient.value.trim()
    console.log(searchIngredient);

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
                const deleteMe = document.createElement('button');
                deleteMe.textContent = 'X';
                if (r.ingredient_id !=null) deleteMe.dataset.id=String(r.ingredient_id);

                deleteMe.addEventListener('click', async() => {
                    try {
                        const patchRes = await fetch('/api/delete_ingredient', {
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
         
                tr.innerHTML = `
                    <td>${r.ingredient_name}</td>
                    <td class="del-Btn"></td>
                `;
                
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

                // when delete button is clicked, delete from DB


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
    submitRecipeBtn.disabled = true;
    submitRecipeBtn.textContent = 'Wait...';
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
        submitRecipeBtn.disabled = false;
        submitRecipeBtn.textContent = 'Submit';
        alert('Recipe added successfully');
        addRecipeForm.reset();
        location.reload();
    }
});



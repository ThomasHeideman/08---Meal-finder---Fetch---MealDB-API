'use strict';
const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultEl = document.getElementById('result-heading'),
  single_mealEL = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e = null, category = null, area = null) {
  if (e && e.preventDefault) e.preventDefault();
  // Clear single meal
  single_mealEL.innerHTML = '';

  // Get search term
  const term = category || area || search.value.trim();
  console.log(term);
  // Check if submit is empty
  if (term) {
    let url;
    if (category) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      console.log(url);
    } else if (area) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
    } else if (term.length === 1) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`;
    } else {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data.meals);
        resultEl.innerHTML = `<h2>Search results for '${term}':</h2>`;
        if (data.meals === null) {
          resultEl.innerHTML = `<h2>There are no search results. Try again!</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal" data-mealID="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" >
            <h3>${meal.strMeal}</h3>
            </div>
            </div>`
            )
            .join('');
        }
      });
    // clear search text
    search.value = '';
  } else {
    submit.classList.add('error');
    search.placeholder = 'Please enter a search term';
  }
}

// get meal by ID
function getMealByID(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(
    res =>
      res.json().then(data => {
        console.log(data);
        const meal = data.meals[0];

        addMealToDOM(meal);
      })
  );
}

// get random meal

function getRandomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`).then(res =>
    res.json().then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
  );
}

// Add meal to DOM
function addMealToDOM(meal) {
  meals.style.display = 'none';
  const tags = meal.strTags ? meal.strTags.split(',') : '';
  const ingredients = [];

  // fill ingredients array
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `<strong>${meal[`strIngredient${i}`]}</strong>, ${
          meal[`strMeasure${i}`]
        }`
      );
    } else {
      break;
    }
  }
  // set innerHTML
  single_mealEL.innerHTML = `
     <div class="single-meal-inner">
     <div class="single-meal-header">

      <button class="btn-close" id="close">
            <i class="fa fa-times color-white"></i>
          </button>
          <h1>${meal.strMeal}</h1>
          </div>
          <div class="single-meal-summary">
          <div class="single-meal-details">
            
            ${
              meal.strCategory
                ? `<p class="meal-category"><strong>Category:</strong> <span class="category" id="category">${meal.strCategory}</span></p>`
                : ''
            }

            ${
              meal.strArea
                ? `<p class="meal-area"><strong>Region/Origin:</strong> <span class="area" id="area">${meal.strArea}</span></p>`
                : ''
            }
            </div>
            ${
              meal.strTags
                ? `<div class="meal-tags">
             ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>`
                : ''
            }
           </div>

          <div class="single-meal-info">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" /> 
            <div class="single-meal-overview">
            

            <div class="meal-ingredients">
              <h3><i class="fa-solid fa-wheat-awn-circle-exclamation fa-xl"></i> Ingredients</h3>
              <ul class="fa-ul"  style="--fa-li-width: 1.75em;--fa-li-margin: 2em;">
              ${ingredients
                .map(
                  ingredient =>
                    `<li><span class="fa-li"><i class="fa-solid fa-square fa-xs"></i></span>${ingredient}</li>`
                )
                .join('')}
              </ul>
            </div>

          </div>
        </div>
        <div class="main">
        
          <div class="meal-instructions">
            <h3><i class="fa-solid fa-kitchen-set fa-xl"></i> Instructions</h3>
            <p>${meal.strInstructions}</p>
          </div>
        </div>
       
         ${
           meal.strSource
             ? `<small><a href="${meal.strSource}" target="_blank">source:${meal.strSource}</a></small>`
             : ''
         }
         </div>`;
  // add the event listener to the close button
  const close = document.getElementById('close');
  const category = document.getElementById('category');
  const area = document.getElementById('area');

  close.addEventListener('click', () => {
    single_mealEL.innerHTML = '';
    meals.style.display = 'grid';
  });

  category.addEventListener('click', () => {
    searchMeal(null, meal.strCategory);
    meals.style.display = 'grid';
  });
  area.addEventListener('click', () => {
    searchMeal(null, null, meal.strArea);
    meals.style.display = 'grid';
  });
}

// Event listeners
search.addEventListener('click', () => {
  if (submit.classList.contains('error')) {
    submit.classList.remove('error');
    search.placeholder = 'Search for meals or keywords';
  }
});
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
  const mealID = e.target.closest('.meal').dataset.mealid;
  getMealByID(mealID);
  console.log(mealID);
});
random.addEventListener('click', getRandomMeal);



// theme
// quote
// options
// docs

let settings = {
    background: '#3a3944',
    color: '#ccc',
    quoting: 'double',
    category: 'any',
    cached_joke: '',
    theme: 'moon'
};

let themes = {
    moon:  ['#3a3944', '#cccccc'],
    light: ['#ececec', '#292929'],
    dark:  ['#323232', '#a1a1a1'],
    sun:   ['#ffc812', '#292929'],
    dream: ['#8421ff', '#ffffff'],
    grass: ['#34d183', '#292929']
};

function fetchCategory() {
    return fetch('https://api.chucknorris.io/jokes/categories')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Internet disconnected");
        })
        .then(json => {
            return Promise.resolve(json);
        })
        .catch(() => {
            return Promise.resolve([]);
        })
}

function loadCategory() {
    fetchCategory()
        .then(category => {
            category.push('any');

            let html = "";
            category.forEach(v => {
                html += `<option>${v}</option>`;
            });

            // el_category.innerHTML = html;
            el_category.value = settings.category;
        })
}

function loadQuoting() {
    el_quoting.value = settings.quoting;
}

function loadTheme() {

}

function loadSettings() {
    return browser.storage.sync.get(settings)
        .then((items) => {
            settings = items;
        })
}

loadSettings()
    .finally(() => {
        // loadCategory();
        loadQuoting();
    });

function notifySaved() {
    el_status.innerHTML = "Options Saved...";
    setTimeout(() => {
        el_status.innerHTML = "";
    }, 1500);
}

function saveCategory() {
    browser.storage.sync.set({category: el_category.value, cached_joke: ''});
    notifySaved();
}

function saveQuoting() {
    browser.storage.sync.set({quoting: el_quoting.value});
    notifySaved();
}

function saveTheme(e) {
    const el = e.target;
    let theme = el.getAttribute('data-theme');
    browser.storage.sync.set({theme: theme, background: themes[theme][0], color: themes[theme][1]});
    notifySaved();
}


const el_category = document.querySelector('.select-category');
const el_quoting  = document.querySelector('.select-quoting');
const el_status   = document.querySelector('.status');
const el_themes   = document.querySelectorAll('.theme td');


el_category.addEventListener('change', saveCategory);
el_quoting .addEventListener('change', saveQuoting);
el_themes.forEach(v => {
    v.addEventListener('click', saveTheme);
});

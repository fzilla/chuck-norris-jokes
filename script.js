"use strict";


let settings = {
    background: '#3a3944',
    color: '#ccc',
    quoting: 'double',
    category: 'any',
    cached_joke: '',
};

let current_joke = '';

function fetchJoke() {
    let url = 'https://api.chucknorris.io/jokes/random';

    if (settings.category !== 'any') url = `${url}?category=${settings.category}`;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Internet disconnected");
        })
        .then(json => {
            return Promise.resolve(json.value);
        })
        .catch(() => {
            return Promise.resolve("Chuck Norris accidentally took down the internet by closing his browser.");
        })
}

function getNewJoke() {
    fetchJoke()
        .then(joke => {
            setJoke(joke);
        })
}

function cacheNewJoke() {
    settings.cached_joke = '';
    browser.storage.sync.set({cached_joke: null})
        .then();

    fetchJoke()
        .then(joke => {
            settings.cached_joke = joke;
            browser.storage.sync.set({cached_joke: joke})
                .then()
        })
}

function loadSettings() {
    return browser.storage.sync.get(settings)
        .then((items) => {
            settings = items;
        })
}

function setTheme() {
    let style = document.documentElement.style;

    style.setProperty('--background', settings.background);
    style.setProperty('--color', settings.color)
}

function quoteString(text, quoting) {
    switch (quoting) {
        case "none":
            return text;

        case "single":
            return `' ${text} '`;

        case "double":
            return `“ ${text} ”`;
    }
}

function setJoke(text) {
    document.querySelector('.joke').innerText =
        document.querySelector('.input_joke').value =
            current_joke = quoteString(text, settings.quoting);
}

function copyJoke() {
    if (!current_joke) return;

    document.getElementById('input_joke').select();
    document.execCommand("copy");
}

function openOptionsPage() {
    if (browser.runtime.openOptionsPage) {
        browser.runtime.openOptionsPage();
    } else {
        window.open(browser.runtime.getURL('options/index.html'));
    }
}

function loadJoke() {
    if (settings.cached_joke)
        setJoke(settings.cached_joke);
    else
        getNewJoke();

    cacheNewJoke();
}

function load() {
    loadSettings()
        .finally(() => {
            loadJoke();
            setTheme();
        });
}

document.addEventListener('DOMContentLoaded', load);

window.addEventListener('keypress', function (event) {
    if (event.key === "r" || event.key === "R") {
        loadJoke();
        return;
    }

    if (event.key === "o" || event.key === "O") {
        openOptionsPage();
        return;
    }

    if (event.key === "c" || event.key === "C") {
        copyJoke();
    }
});

window.addEventListener('dblclick', () => {
    const el_options = document.querySelector('.options');

    el_options.style.transition = '0.8s';
    el_options.style.opacity = '1';

    setTimeout(() => {
        el_options.style.transition = '0.8s';
        el_options.style.opacity = '0';
    }, 4000)
});

document.querySelector('.new-joke')
    .addEventListener('click', () => {
        loadJoke();
    });

document.querySelector('.copy-joke')
    .addEventListener('click', () => {
        copyJoke();
    });

document.querySelector('.open-options')
    .addEventListener('click', () => {
        openOptionsPage();
    });

document.querySelector('.joke')
    .addEventListener('dblclick', e => {
        e.stopPropagation();
        copyJoke();
    });
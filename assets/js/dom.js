export let moviesList = null;
export let inputSearch = null;
export let triggerMode = false;

export const createElement = ({
                                  type,
                                  attrs,
                                  container = null,
                                  evt = null,
                                  handler = null,
                                  position = 'append'
                              }) => {
    const el = document.createElement(type);

    Object.keys(attrs).forEach((key) => {
        if (key !== 'innerHTML') el.setAttribute(key, attrs[key])
        else el.innerHTML = attrs[key]
    })
    if (container && position === 'append') container.append(el)
    if (container && position === 'prepend') container.prepend(el)

    if (evt && handler && typeof handler === 'function')
        el.addEventListener(evt, handler)

    return el
}

export const createStyle = () => {
    createElement({
        type: 'style',
        attrs: {
            innerHTML: `
            * {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  padding: 20px;
  max-width: 1280px;
  margin: 0 auto;
}

.movies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie {
  display: flex;
  align-content: center;
  justify-content: center;
  overflow: hidden;
}

.movie__image {
  width: 100%;
  object-fit: cover;
}

.search {
  margin-bottom: 30px;
}

.search__label-input {
  display: block;
  margin-bottom: 7px;
}

.search__input {
  display: block;
  max-width: 400px;
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid lightsteelblue;
}

.search__label-checkbox {
  font-size: 12px;
  display: inline-block;
  transform: translate(7px, -2px);
}
`
        },
        container: document.head
    })
}

export const createMarkup = () => {
    const container = createElement({
        type: 'div',
        attrs: {class: 'container'},
        container: document.body,
        position: 'prepend'
    })

    createElement({
        type: 'h1',
        attrs: {innerHTML: 'Приложение для поиска фильмов',},
        container
    });

    const searchBox = createElement({
        type: 'div',
        attrs: {class: 'search'},
        container
    })

    const inputBox = createElement({
        type: 'div',
        attrs: {class: 'search__group search__group--input'},
        container: searchBox
    })

    const checkBox = createElement({
        type: 'div',
        attrs: {class: 'search__group search__group--checkbox'},
        container: searchBox
    })

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-input',
            for: 'search',
            innerHTML: 'Поиск фильмов'
        },
        container: inputBox
    })

    inputSearch = createElement({
        type: 'input',
        attrs: {
            class: 'search__input',
            id: 'search',
            placeholder: 'Начните вводить текст',
            type: 'search'
        },
        container: inputBox
    })

    createElement({
        type: 'input',
        attrs: {
            class: 'search__checkbox',
            id: 'checkbox',
            type: 'checkbox'
        },
        container: checkBox,
        evt: 'click',
        handler: () => triggerMode = !triggerMode
    })

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-checkbox',
            for: 'checkbox',
            innerHTML: 'Добавлять фильмы к существующим спискам'
        },
        container: checkBox
    })

    moviesList = createElement({
        type: 'div',
        attrs: {class: 'movies'},
        container
    })
}

export const clearMoviesMarkup = (el) => {
    el && (el.innerHTML = '')
}

export const addMovieToList = (movie) => {
    const item = createElement({
        type: 'div',
        attrs: {class: 'movie'},
        container: moviesList
    });

    createElement({
        type: 'img',
        attrs: {
            class: 'movie__image',
            src: /^(http|https):\/\//i.test(movie.Poster) ? movie.Poster : 'assets/img/no-image.png',
            title: movie.Title,
            alt: movie.Title,
        },
        container: item,
    })
}

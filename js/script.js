'use strict';

const opt = {
    optCloudClassCount: 5,
    optCloudClassPrefix: 'tag-size-'
};

const DOM = {
    article: '.post',
    postTitle: '.post-title',
    titleList: '.titles',
    articleTag: '.post-tags .list',
    activeTags: 'a.active[href^="#tag-"]',
    author: '.author-name',
    activeAuthor: 'a[href^="#author-"]',
    tagsList: '.tags.list',
    authorList: '.list.authors'
};

function titleClickHandler(event) {
    event.preventDefault();

    /* [DONE] remove class 'active' from all article links  */
    document
        .querySelectorAll('.titles a.active')
        .forEach(activelink => activelink.classList.remove('active'));

    /* [DONE] add class 'active' to the clicked link */
    this.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    document
        .querySelectorAll('.posts article.active')
        .forEach(activeArticle => activeArticle.classList.remove('active'));

    //  [DONE]
    /* get 'href' attribute from the clicked link */
    /* find the correct article using the selector (value of 'href' attribute) */
    /* add class 'active' to the correct article */
    document.querySelector(this.getAttribute('href')).classList.add('active');
}

function generateTitleLinks(selector = '') {
    /* remove contents of titleList */
    const linkList = document.querySelector(DOM.titleList);
    linkList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(DOM.article + selector);
    let html = '';

    for (let article of articles) {
        /* get the article id */
        const id = article.getAttribute('id');
        /* find the title element */
        /* get the title from the title element */
        const title = article.querySelector(DOM.postTitle).innerHTML;
        // linkList.insertAdjacentHTML
        /* create HTML of the link */
        html += `<li><a href="#${id}"><span>${title}</span></a></li>`;
    }

    /* insert link into titleList */
    linkList.innerHTML = html;

    document
        .querySelectorAll('.titles a')
        .forEach(link => link.addEventListener('click', titleClickHandler));
}

generateTitleLinks();

function calculateTagsParams(tags) {
    let vals = Object.values(tags);
    return {
        min: Math.min(...vals),
        max: Math.max(...vals)
    };
}

function calculateTagClass(count, param) {
    let range = (param.max - param.min) / opt.optCloudClassCount;
    let j = 1;

    for (let i = param.min + range; i < param.max + 1; i += range) {
        if (count <= i) {
            return opt.optCloudClassPrefix + j;
        }
        j++;
    }
}

function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    /* START LOOP: for every article: */
    document.querySelectorAll(DOM.article).forEach(article => {
        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        /* split tags into array */
        article
            .getAttribute('data-tags')
            .split(' ')
            .map(tag => {
                /* START LOOP: for each tag */
                /* generate HTML of the link */
                /* add generated code to html variable */
                html += `<li><a href="#tag-${tag}">${tag}</a></li>`;

                // To mi ESLint wywala jako błąd
                // !allTags.hasOwnProperty(tag) ? allTags[tag] = 1 : allTags[tag]++;
                !Object.prototype.hasOwnProperty.call(allTags, tag)
                    ? (allTags[tag] = 1)
                    : allTags[tag]++;
                /* END LOOP: for each tag */
            });

        /* find tags wrapper */
        /* insert HTML of all the links into the tags wrapper */
        article.querySelector(DOM.articleTag).innerHTML = html;
        /* [NEW] add html from allTags to tagList */
    });
    /* END LOOP: for every article: */
    const tagsParams = calculateTagsParams(allTags);
    console.log('TCL: generateTags -> tagsParams', tagsParams);

    let htmlTags = Object.keys(allTags).map(tag => {
        let tagClass = calculateTagClass(allTags[tag], tagsParams);
        return `<li><a class="${tagClass}" href="#tag-${tag}">${tag} </a></li>`;
    });

    document.querySelector('.tags').innerHTML = htmlTags.join(' ');
}

generateTags();

function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = this.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    /* remove class active */
    document
        .querySelectorAll(DOM.activeTags)
        .forEach(tag => tag.classList.remove('active'));

    /* find all tag links with "href" attribute equal to the "href" constant */
    /* add class active */
    document
        .querySelectorAll(`a[href="${href}"]`)
        .forEach(tag => tag.classList.add('active'));

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks(`[data-tags~="${tag}"]`);
}

function addClickListenersToTags() {
    /* find all links to tags */
    document
        .querySelectorAll('a[href^="#tag-"]')
        /* add tagClickHandler as event listener for that link */
        .forEach(link => link.addEventListener('click', tagClickHandler));
}

addClickListenersToTags();

function generateAuthors() {
    let authorsAll = {};

    document.querySelectorAll(DOM.article).forEach(article => {
        let author = article.getAttribute('data-author');
        article.querySelector(
            DOM.author
        ).innerHTML = `<a href="#author-${author}">${author}</a>`;

        Object.prototype.hasOwnProperty.call(authorsAll, author)
            ? authorsAll[author]++
            : authorsAll[author] = 1;
    });

    let authorsHtml = Object.keys(authorsAll).map(author => {
        return `<li>
                    <a href="#author-${author}">
                        <span class="author-name">${author}</span>
                    </a>(${authorsAll[author]})
                </li>`;
    });
    document.querySelector(DOM.authorList).innerHTML = authorsHtml.join(' ');
}

generateAuthors();

function addClickListenersToAuthors() {
    document.querySelectorAll('a[href^="#author-"]').forEach(link =>
        link.addEventListener('click', function authorClickHandler(event) {
            event.preventDefault();

            const href = this.getAttribute('href');
            const author = href.replace('#author-', '');

            document
                .querySelectorAll(DOM.activeAuthor)
                .forEach(author => author.classList.remove('active'));

            /* add class active */
            document
                .querySelectorAll(`a[href="${href}"]`)
                .forEach(author => author.classList.add('active'));

            /* execute function "generateTitleLinks" with article selector as argument */
            generateTitleLinks(`[data-author="${author}"]`);
        })
    );
}

addClickListenersToAuthors();

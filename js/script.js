/* eslint-disable no-undef */
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
    authorList: '.list.authors',

    temps: {
        article: '#template-article-link',
        tagLink: '#template-tag-link',
        tagsCloud: '#template-tags-cloud',
        author: '#template-author',
        authorList: '#template-author-list'
    }
};

const templates = {
    // eslint-disable-next-line no-undef
    articleLink: Handlebars.compile(
        document.querySelector(DOM.temps.article).innerHTML
    ),
    tagLink: Handlebars.compile(
        document.querySelector(DOM.temps.tagLink).innerHTML
    ),
    tagsCloud: Handlebars.compile(
        document.querySelector(DOM.temps.tagsCloud).innerHTML
    ),
    author: Handlebars.compile(
        document.querySelector(DOM.temps.author).innerHTML
    ),
    authorList: Handlebars.compile(
        document.querySelector(DOM.temps.authorList).innerHTML
    )
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

        // html += `<li><a href="#${id}"><span>${title}</span></a></li>`;
        const linkHTMLData = { id: id, title: title };
        html += templates.articleLink(linkHTMLData);
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
    let allTags = {};
    document.querySelectorAll(DOM.article).forEach(article => {
        let html = '';

        /* get tags from data-tags attribute */
        article
            .getAttribute('data-tags')
            .split(' ')
            .map(tag => {
                /* generate HTML of the link */
                html += templates.tagLink({ tag: tag });

                /* -------- NA ROZMOWE --------------- */
                // To (ponizej zakomentowane) ESLint mi wywala jako błąd
                // !allTags.hasOwnProperty(tag) ? allTags[tag] = 1 : allTags[tag]++;
                !Object.prototype.hasOwnProperty.call(allTags, tag)
                    ? (allTags[tag] = 1)
                    : allTags[tag]++;
            });

        /* insert HTML of all the links into the tags wrapper */
        /* [NEW] add html from allTags to tagList */
        article.querySelector(DOM.articleTag).innerHTML = html;
    });

    const tagsParams = calculateTagsParams(allTags);

    let htmlTags = Object.keys(allTags).map(tag => {
        let tagClass = calculateTagClass(allTags[tag], tagsParams);
        return templates.tagsCloud({ tagClass: tagClass, tag: tag });
    });

    document.querySelector('.tags').innerHTML = htmlTags.join(' ');
}

generateTags();

function tagClickHandler(event) {
    event.preventDefault();

    const href = this.getAttribute('href');
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
            // ).innerHTML = `<a href="#author-${author}">${author}</a>`;
        ).innerHTML = templates.author({ author: author });

        Object.prototype.hasOwnProperty.call(authorsAll, author)
            ? authorsAll[author]++
            : (authorsAll[author] = 1);
    });

    let authorsHtml = Object.keys(authorsAll).map(author => {
        return templates.authorList({
            author: author,
            count: authorsAll[author]
        });
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

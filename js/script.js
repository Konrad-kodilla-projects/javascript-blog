'use strict';

const DOM = {
    article: '.post',
    postTitle: '.post-title',
    titleList: '.titles',
    articleTag: '.post-tags .list',
    activeTags: 'a.active[href^="#tag-"]'
};


function titleClickHandler(event) {
    event.preventDefault();
    // console.log("TCL: titleClickHandler -> event", event);

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    this.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

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
        // linkList.insertAdjacentHTML('beforebegin', `<li><a href="#${id}"><span>${title}</span></a></li>`);
        /* create HTML of the link */
        html += `<li><a href="#${id}"><span>${title}</span></a></li>`;
    }

    /* insert link into titleList */
    linkList.innerHTML = html;

    document.querySelectorAll('.titles a')
        .forEach(link => link.addEventListener('click', titleClickHandler));
}

generateTitleLinks();


function generateTags() {
    /* find all articles */
    /* START LOOP: for every article: */
    document.querySelectorAll(DOM.article).forEach(article => {
        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        /* split tags into array */
        article.getAttribute('data-tags').split(' ').map(tag => {
            /* START LOOP: for each tag */
            /* generate HTML of the link */
            /* add generated code to html variable */
            html += `<li><a href="#tag-${tag}">${tag}</a></li>`;
            /* END LOOP: for each tag */
        });

        /* find tags wrapper */
        /* insert HTML of all the links into the tags wrapper */
        article.querySelector(DOM.articleTag).innerHTML = html;
    });

    /* END LOOP: for every article: */
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
    document.querySelectorAll(DOM.activeTags)
        .forEach(tag => tag.classList.remove('active'));

    /* find all tag links with "href" attribute equal to the "href" constant */
    /* add class active */
    document.querySelectorAll(`a[href="${href}"]`)
        .forEach(tag => tag.classList.add('active'));

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks(`[data-tags~="${tag}"]`);
}

function addClickListenersToTags() {
    /* find all links to tags */
    document.querySelectorAll('a[href^="#tag-"]')
        /* add tagClickHandler as event listener for that link */
        .forEach(link => link.addEventListener('click', tagClickHandler));
}

addClickListenersToTags();

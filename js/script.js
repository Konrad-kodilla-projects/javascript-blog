'use strict';

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


function generateTitleLinks() {

    /* remove contents of titleList */
    const linkList = document.querySelector('.titles');
    linkList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll('.posts .post');
    let html = ''

    for (let article of articles) {
        /* get the article id */
        const id = article.getAttribute('id');
        /* find the title element */
        /* get the title from the title element */
        const title = article.querySelector('.post-title').innerHTML;
        // linkList.insertAdjacentHTML('beforebegin', `<li><a href="#${id}"><span>${title}</span></a></li>`);
        /* create HTML of the link */
        html += `<li><a href="#${id}"><span>${title}</span></a></li>`;
    }

    /* insert link into titleList */
    linkList.innerHTML = html;
}

generateTitleLinks();


const links = document.querySelectorAll('.titles a');
console.log("TCL: links", links)

for (let link of links) {
    link.addEventListener('click', titleClickHandler);
}
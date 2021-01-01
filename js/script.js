'use strict'

const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    //console.log('Link was clicked!' + clickedElement);    

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
        //console.log('remove .active from: ' + activeLink);
    }
    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('article.active');
    console.log(activeArticles);

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
        //console.log('remove .active from: ' + activeArticle);
    }
    /* get 'href' attribute from the clicked link */
    const selectedArticleHref = clickedElement.getAttribute('href');
    const selectedArticleId = selectedArticleHref.match(/\w+-\d+/);
    console.log("selectedArticleId: " + selectedArticleId);

    /* find the correct article using the selector (value of 'href' attribute) */
    let selectedArticle = document.getElementById(selectedArticleId);

    console.log("selected article: " + selectedArticle);
    /* add class 'active' to the correct article */
    selectedArticle.classList.add('active');

}
const links = document.querySelectorAll('.titles a');

for (let link of links) {
    link.addEventListener('click', titleClickHandler);
    //console.log(link);

}
{
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

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles';

    function generateTitleLinks() {

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';
        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector);
        let html = '';
        for (let article of articles) {
            /* get the article id */
            const articleId = article.getAttribute('id');

            /* get the title from the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            console.log(linkHTML);
            /* insert link into titleList */
            //titleList.insertAdjacentHTML('beforeend', linkHTML);
            html = html + linkHTML;

        }
        titleList.insertAdjacentHTML('beforeend', html);
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
            //console.log(link);
        }
    }
    generateTitleLinks();
}
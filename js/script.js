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

    const
        optArticleTagsSelector = '.post-tags .list',
        optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles';

    function generateTitleLinks(customSelector = '') {

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';
        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        console.log(optArticleSelector + customSelector);
        let html = '';
        for (let article of articles) {
            /* get the article id */
            const articleId = article.getAttribute('id');

            /* get the title from the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            //console.log(linkHTML);
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

    function generateTags() {
        /* find all articles */
        const articles = document.querySelectorAll(optArticleSelector);
        /* START LOOP: for every article: */
        for (let article of articles) {
            /* find tags wrapper */
            const tagWrapper = article.querySelector(optArticleTagsSelector);

            /* make html variable with empty string */
            let html = '';
            /* get tags from data-tags attribute */
            let articleDataTags = article.getAttribute('data-tags');
            console.log(articleDataTags);
            /* split tags into array */
            let articleTags = articleDataTags.split(' ');
            /* START LOOP: for each tag */
            for (let tag of articleTags) {
                /* generate HTML of the link */
                let link = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
                /* add generated code to html variable */
                html = html + link;
                /* END LOOP: for each tag */
            }
            /* insert HTML of all the links into the tags wrapper */
            tagWrapper.insertAdjacentHTML('beforeend', html);
            /* END LOOP: for every article: */
        }
    }

    generateTags();

    function tagClickHandler(event) {
        /* prevent default action for this event */
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;
        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = this.getAttribute('href');
        //console.log(href);
        /* make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace("#tag-", '');
        console.log(tag);
        /* find all tag links with class active */
        const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
        console.log(activeTagLinks);
        /* START LOOP: for each active tag link */
        for (activeTagLink of activeTagLinks) {
            /* remove class active */
            activeTagLink.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all tag links with "href" attribute equal to the "href" constant */
        const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
        /* START LOOP: for each found tag link */
        for (tagLink of tagLinks) {
            /* add class active */
            tagLink.classList.add('active');
            /* END LOOP: for each found tag link */
        }
        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    function addClickListenersToTags() {
        /* find all links to tags */
        const tags = document.querySelectorAll('a[href^="#tag-"]');
        /* START LOOP: for each link */
        for (let tag of tags) {
            /* add tagClickHandler as event listener for that link */
            tag.addEventListener('click', tagClickHandler);
            //console.log(tag);
            /* END LOOP: for each link */
        }
    }

    addClickListenersToTags();


}
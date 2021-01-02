{
    'use strict'
    const titleClickHandler = function(event) {
        event.preventDefault();
        const clickedElement = this;

        /* remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');

        }
        /* add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /* remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('article.active');


        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');

        }
        /* get 'href' attribute from the clicked link */
        const selectedArticleHref = clickedElement.getAttribute('href');
        const selectedArticleId = selectedArticleHref.match(/\w+-\d+/);


        /* find the correct article using the selector (value of 'href' attribute) */
        let selectedArticle = document.getElementById(selectedArticleId);


        /* add class 'active' to the correct article */
        selectedArticle.classList.add('active');

    }

    const
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optTagsListSelector = '.tags.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-';

    function generateTitleLinks(customSelector = '') {

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';
        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        let html = '';
        for (let article of articles) {
            /* get the article id */
            const articleId = article.getAttribute('id');

            /* get the title from the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

            /* insert link into titleList */
            //titleList.insertAdjacentHTML('beforeend', linkHTML);
            html = html + linkHTML;

        }
        titleList.insertAdjacentHTML('beforeend', html);
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);

        }
    }
    generateTitleLinks();

    function calculateTagsParams(allTags) {
        const tagsParams = {
            "min": 100,
            "max": 0
        }
        for (let tag in allTags) {
            console.log(allTags[tag]);
            tagsParams.min = Math.min(allTags[tag], tagsParams.min);
            tagsParams.max = Math.max(allTags[tag], tagsParams.max);
        }
        return tagsParams;
    }

    function calculateTagClass(tagCount, tagsParams) {
        let tagSize = Math.round(tagCount / tagsParams.max * optCloudClassCount, 1);
        return optCloudClassPrefix + tagSize;
    }

    function generateTags() {
        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};
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

            /* split tags into array */
            let articleTags = articleDataTags.split(' ');
            /* START LOOP: for each tag */
            for (let tag of articleTags) {
                /* generate HTML of the link */
                let link = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
                /* add generated code to html variable */
                html = html + link;
                /* [NEW] check if this link is NOT already in allTags */
                if (!allTags[tag]) {
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
                /* END LOOP: for each tag */
            }
            /* [NEW] find list of tags in right column */
            const tagList = document.querySelector('.tags');
            /* [NEW] add html from allTags to tagList */
            //tagList.innerHTML = allTags.join(' ');
            console.log(allTags);
            /* [NEW] create variable for all links HTML code */
            const tagsParams = calculateTagsParams(allTags);
            console.log('tagsParams:', tagsParams);

            let allTagsHTML = '';

            /* [NEW] START LOOP: for each tag in allTags: */
            for (let tag in allTags) {
                /* [NEW] generate code of a link and add it to allTagsHTML */
                let tagClass = calculateTagClass(allTags[tag], calculateTagsParams(allTags));
                allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + tagClass + '">' + tag + ' (' + allTags[tag] + ') ';
            }
            console.log(allTagsHTML);
            /* [NEW] END LOOP: for each tag in allTags: */

            /*[NEW] add HTML from allTagsHTML to tagList */
            tagList.innerHTML = allTagsHTML;


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

        /* make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace("#tag-", '');

        /* find all tag links with class active */
        const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

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

            /* END LOOP: for each link */
        }
    }

    addClickListenersToTags();

    function generateAuthor() {
        /* find all articles */
        const articles = document.querySelectorAll(optArticleSelector);
        /* START LOOP: for every article: */
        for (let article of articles) {
            /* find tags wrapper */
            const authorWrapper = article.querySelector(optArticleAuthorSelector);

            /* get tags from data-tags attribute */
            let articleAuthor = article.getAttribute('data-author');

            /* generate HTML link */
            let link = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
            /* insert HTML of all the links into the tags wrapper */
            authorWrapper.insertAdjacentHTML('beforeend', link);
        }
    }

    generateAuthor();

    function authorClickHandler(event) {
        /* prevent default action for this event */
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;

        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = this.getAttribute('href');

        /* make a new constant "author" and extract author from the "href" constant */
        const author = href.replace("#author-", '');

        /* find all author links with class active */
        const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

        /* START LOOP: for each active tag link */
        for (activeAuthorLink of activeAuthorLinks) {

            /* remove class active */
            activeAuthorLink.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all tag links with "href" attribute equal to the "href" constant */
        const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
        /* START LOOP: for each found author link */
        for (authorLink of authorLinks) {
            /* add class active */
            authorLink.classList.add('active');
            /* END LOOP: for each found author link */
        }
        /* execute function "generateTitleLinks" with custom selector as argument */

        generateTitleLinks('[data-author="' + author + '"]');
    }

    function addClickListenersToAuthor() {
        /* find all links to author */
        const authorLinks = document.querySelectorAll('a[href^="#author"]');

        /* START LOOP: for each link */
        for (let authorLink of authorLinks) {
            /* add tagClickHandler as event listener for that link */
            authorLink.addEventListener('click', authorClickHandler);

            /* END LOOP: for each link */
        }
    }
    addClickListenersToAuthor();
}
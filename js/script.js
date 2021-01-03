{
    'use strict'
    //options
    const opt = {
            'ArticleTagsSelector': '.post-tags .list',
            'ArticleAuthorSelector': '.post-author',
            'ArticleSelector': '.post',
            'TitleSelector': '.post-title',
            'TitleListSelector': '.titles',
            'TagsListSelector': '.tags.list',
            'AuthorsListSelector': '.authors.list',
            'CloudClassCount': 5,
            'CloudClassPrefix': 'tag-size-'
        }
        //utility functions
    function calculateTagsParams(allTags) {
        const tagsParams = {
            "min": 100,
            "max": 0
        }
        for (let tag in allTags) {

            tagsParams.min = Math.min(allTags[tag], tagsParams.min);
            tagsParams.max = Math.max(allTags[tag], tagsParams.max);
        }
        return tagsParams;
    }

    function calculateTagClass(tagCount, tagsParams) {
        let tagSize = Math.round(tagCount / tagsParams.max * opt.CloudClassCount, 1);
        return opt.CloudClassPrefix + tagSize;
    }
    //Templates
    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
        articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
        allAuthors: Handlebars.compile(document.querySelector('#template-all-authors').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloudLink').innerHTML)
    }

    //DOM functions

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

    function generateTitleLinks(customSelector = '') {

        /* remove contents of titleList */
        const titleList = document.querySelector(opt.TitleListSelector);
        titleList.innerHTML = '';
        /* for each article */
        const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);

        let html = '';
        for (let article of articles) {
            /* get the article id */
            const articleId = article.getAttribute('id');

            /* get the title from the title element */
            const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;

            /* create HTML of the link with handlebars templates*/

            const linkHTMLData = { id: articleId, title: articleTitle }; //preparing data for template

            const linkHTML = templates.articleLink(linkHTMLData); //passing data to template

            /* insert link into titleList */

            html = html + linkHTML;
        }
        titleList.insertAdjacentHTML('beforeend', html);
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }
    generateTitleLinks();

    function generateTags() {
        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};
        /* find all articles */
        const articles = document.querySelectorAll(opt.ArticleSelector);
        /* START LOOP: for every article: */
        for (let article of articles) {
            /* find tags wrapper */
            const tagWrapper = article.querySelector(opt.ArticleTagsSelector);

            /* get tags from data-tags attribute */
            let articleDataTags = article.getAttribute('data-tags');
            /* split tags into array */
            let articleTags = articleDataTags.split(' ');

            /* START LOOP: for each tag */
            for (let tag of articleTags) {
                /* render tag with templates to tags wrapper */
                tagWrapper.insertAdjacentHTML('beforeend', templates.articleTag({ tag: tag }));
                /* [NEW] check if this link is NOT already in allTags */
                if (!allTags[tag]) {
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    /* [NEW] increment existing tag */
                    allTags[tag]++;
                }
                /* END LOOP: for each tag */
            }
            /* [NEW] find list of tags in right column */
            const tagList = document.querySelector(opt.TagsListSelector);
            /* [NEW] add html from allTags to tagList */

            /* [NEW] get min and max tag counts as object */
            const tagsParams = calculateTagsParams(allTags);
            /* [NEW] create variable for all links HTML code */

            const allTagsData = { tags: [] };

            /* [NEW] START LOOP: for each tag in allTags: */
            for (let tag in allTags) {
                /* [NEW] generate code of a link and add it to allTagsHTML */

                allTagsData.tags.push({
                    tag: tag,
                    count: allTags[tag],
                    className: calculateTagClass(allTags[tag], tagsParams)
                });

                /* [NEW] END LOOP: for each tag in allTags: */
            }
            /*[NEW] render allTagsData with templates to tagList */

            tagList.innerHTML = templates.tagCloudLink(allTagsData);

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
        /* [NEW] create a new variable allAuthorss with an empty object */
        let allAuthors = {};
        /* find all articles */
        const articles = document.querySelectorAll(opt.ArticleSelector);
        /* START LOOP: for every article: */
        for (let article of articles) {
            /* find tags wrapper */
            const authorWrapper = article.querySelector(opt.ArticleAuthorSelector);
            /* get tags from data-tags attribute */
            let articleAuthor = article.getAttribute('data-author');
            /* render article author with templates*/
            authorWrapper.insertAdjacentHTML('beforeend', templates.articleAuthor({ author: articleAuthor }));
            /* [NEW] check if this author is NOT already in allAuthors */
            if (!allAuthors[articleAuthor]) {
                allAuthors[articleAuthor] = 1;
            } else {
                /*if exist increment counter */
                allAuthors[articleAuthor]++;
            }
        }
        /* Get authors list wrapper to const */
        const authorsList = document.querySelector(opt.AuthorsListSelector);
        /* [NEW] START LOOP: for each author in allAuthors: */
        for (let author in allAuthors) {
            /* render author link to authors list with templates */
            authorsList.insertAdjacentHTML('beforeend', templates.allAuthors({ author: author }));

            /* [NEW] END LOOP: for each author in allAuthors: */
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
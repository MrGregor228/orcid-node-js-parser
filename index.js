const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const fs = require('fs');

const nightmare = new Nightmare({
    show: true
});
const url = ["https://orcid.org/0000-0002-4833-3694/print", "https://orcid.org/0000-0002-4088-6518/print"];

nightmare.goto(url[0])
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
        console.log(getData(response));
    }).catch(err => console.log(err));

function getData(html) {

    const $ = cheerio.load(html);

    let workspaceSectionTitle = [];
    let employmentSection = [];
    let educationAndCualifications = [];
    let workList = [];

    let user = {
        fullName: $(".full-name").text().trim(),
        orcidId: $("#orcid-id").text().trim(),
        about: workspaceSectionTitle,
        employment: employmentSection,
        educationAndCualifications: educationAndCualifications,
        works: workList
    };

    $('.workspace-profile .workspace-section').each((i, item) => {
        workspaceSectionTitle.push({
            title: $(item).find('.workspace-section-title').text(),
            publicContent: $(item).find('div[name=email]').text() || $(item).find('.public-content span').text() || $(item).find('.public-content a').text().trim().split("  ")
        });
    });
    $('#workspace-employment .work-list-container').each((i, item) => {
        employmentSection.push({
            title: $(item).find("ul li .row:first-child .workspace-title").text(),
            details: $(item).find('.info-detail:nth-of-type(1)').text(),
            subdetails: $(item).find('.info-detail:nth-of-type(2)').text(),
            source: $(item).find(".row.source-line .col-xs-12").text()
        });
    });
    $("#workspace-education .workspace-border-box").each((i, item) => {
        educationAndCualifications.push({
            title: $(item).find("li .row:first-child .workspace-title").text(),
            details: $(item).find('.info-detail:nth-of-type(1)').text(),
            subdetails: $(item).find('.info-detail:nth-of-type(2)').text(),
            source: $(item).find(".row.source-line .col-xs-12").text()
        });
    });
    $("#body-work-list .workspace-border-box").each((i, item) => {
        workList.push({
            title: $(item).find(".workspace-title span:first-child").text(),
            journaltitle: $(item).find(".workspace-title .journaltitle").text(),
            infoDetail: $(item).find(".info-detail").text(),
            url: $(item).find(".url-popover").text().replace("http", " http"),
            links: $(item).find(".url-popover a").attr("href"),
            source: $(item).find(".row.source-line .col-xs-12").text()
        });
    });
    
    fs.writeFile(`./db/${user.fullName.replace(" ", "")}.json`, JSON.stringify(user), error => {
        if (error) throw error;
    });

}
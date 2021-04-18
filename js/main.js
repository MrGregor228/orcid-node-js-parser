"use strict";
const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }

    return await response.json();
};
function separateTring(str) {
    if (str.indexOf("gmail.com")) {
        return String(str).replace("gmail.com", "gmail.com ");
    } else if (str.indexOf("edu.ua")) {
        return String(str).replace("edu.ua", "edu.ua ");
    } else if (str.indexOf("kneu.dp.ua")) {
        return String(str).replace("kneu.dp.ua", "kneu.dp.ua ");
    } else {
        return str;
    }
}

let sectionHeading = document.querySelectorAll('.heading');

if (sectionHeading.length == 1) {
    sectionHeading.addEventListener('click', function (event) {
        let target = event.target;
        target.closest('.section').classList.toggle('toggled'); 
    });
} else {
    sectionHeading.forEach(heading => {
        heading.addEventListener('click', function (event) {
            let target = event.target;
            target.closest('.section').classList.toggle('toggled');      
        });
    });
}

getData('../db/AndriiShaikan.json').then(data => {
    console.log(data);
    const userName = document.getElementById('user-name');
    userName.textContent = data.fullName;
    const orcidId = document.getElementById('orcid-id');
    const userInfoContainer = document.querySelector('.user-info');
    const employmentSection = document.querySelector('.employment-section');
    const emplCounter = document.getElementById('empl-counter');
    const educationAndQualifications = document.querySelector('.education-and-qualifications-section');
    const eduCounter = document.getElementById('edu-counter');

    orcidId.textContent = data.orcidId;
    orcidId.setAttribute("href", data.orcidId);

    data.about.forEach(item => {
        userInfoContainer.insertAdjacentHTML('beforeend', `
            <p class="text-field">${item.title}: <span>${separateTring(item.publicContent).split(" ").join(", ")}</span></p>
        `);
    });

    emplCounter.textContent = data.employment.length;
    data.employment.forEach(item => {
        employmentSection.insertAdjacentHTML('beforeend', `
            <div class="info-card">                
                <p class="info-title">${item.title}</p>
                <p class="details">${item.details}</p>
                <p class="subdetails">${item.subdetails}</p>
                <p class="source">${item.source}</p>
            </div>
        `);
    });

    eduCounter.textContent = data.educationAndCualifications.length;
    data.educationAndCualifications.forEach(item => {
        educationAndQualifications.insertAdjacentHTML('beforeend', `
            <div class="info-card">                
                <p class="info-title">${item.title}</p>
                <p class="details">${item.details}</p>
                <p class="subdetails">${item.subdetails}</p>
                <p class="source">${item.source}</p>
            </div>
        `);
    });
});
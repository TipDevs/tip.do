export const asideToggler = function () {
    const showAside = document.querySelector('.show');
    const hideAside = document.querySelector('.hide');
    const aside = document.querySelector('aside');
    const main = document.querySelector('main');
    const body = document.querySelector("body");
    const hideAsideEvent = function (query) {
        if (query.matches) {
            aside.style.display = "none";
            body.classList.remove("with_aside");
            body.classList.add("no_aside");
            main.style.display = "flex";
            main.classList.remove("with_aside");
            main.classList.add("no_aside");
            showAside.style.display = "block";
        }
        else {
            aside.style.display = "none";
            body.classList.remove("with_aside");
            body.classList.add("no_aside");
            main.classList.remove("with_aside");
            main.style.display = "flex";
            showAside.style.display = "block";
        }
    };

    const showAsideEvent = (query) => {
        if (query.matches) {
            aside.style.display = "flex";
            body.classList.remove("no_aside");
            body.classList.add("with_aside");
            main.style.display = "none";
            showAside.style.display = "none";
        }
        else {
            aside.style.display = "flex";
            body.classList.remove("no_aside");
            body.classList.add("with_aside");
            main.classList.add("with_aside");
            main.classList.remove("no_aside");
            showAside.style.display = "none";
            main.style.display = "flex";
        }
    };
    return { hideAsideEvent, showAsideEvent, showAside, hideAside };
};
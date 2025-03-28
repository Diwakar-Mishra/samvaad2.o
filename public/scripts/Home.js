var swiper2 = new Swiper("#mySwiper2", {
    slidesPerView: 1,
    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 640px
        640: {
            slidesPerView: 2,
        },
    },
    // prventing from returning from right to left
    loop: true,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    // addition of autoplay : for automatic slides
    autoplay: {
        delay: 1500
    },
    // addit=ion of sliding dpeed
    speed: 500,
    // allowSlidePrev : false,

});
// ===================== typing text waala sections =====================
// Typed.js ko initialize karna aur text ka effect add karna
var typed = new Typed("#typed-text", {
    strings: ["AI Integrated", "Debate Analyzer", "GD Analyzer"], // Ye words type honge
    typeSpeed: 50,   // Typing speed (ms me, jitna chhota hoga utni fast typing)
    backSpeed: 30,   // Backspace hone ki speed
    backDelay: 2000, // New text type hone se pehle kitna delay ho
    startDelay: 500, // Start hone se pehle ka delay
    showCursor: true, // Cursor "|" dikhana ya nahi (true ka matlab dikhana)
    cursorChar: "|", // Cursor ka character set karna
    loop: true // Infinite loop me chalayega (false karne se ek baar hi chalega)
});
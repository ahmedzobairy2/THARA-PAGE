document.addEventListener("DOMContentLoaded",
    function() {
        let slides = document.querySelectorAll("#wowslider-container1 .ws_images li");
        let bullets = document.querySelectorAll(".ws_bullets a");
        let index = 0;

        function showSlide(i) {
            slides.forEach((s, idx) => { s.style.display = (i === idx) ? "block" : "none"; });
            bullets.forEach((b, idx) => { b.classList.toggle("active", i === idx); });
        }
        bullets.forEach((b, i) => b.addEventListener("click", () => {
            index = i;
            showSlide(index);
        }));
        showSlide(index);
        setInterval(() => {
            index = (index + 1) % slides.length;
            showSlide(index);
        }, 4000);
    });
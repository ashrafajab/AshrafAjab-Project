$(document).ready(function(){

    // Contact form
    $('#contactForm').submit(function(e){
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        $(this).trigger("reset");
    });

    // Order button
    $('.order-btn').click(function(){
        window.location.href = 'order.html';
    });

    // Hamburger menu toggle
    $('.hamburger').click(function(){
        $('.nav-links').toggleClass('active');
    });

    // Smooth scrolling for nav links
    $('.nav-links a[href^="#"]').on('click', function(e){
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if(target.length){
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 60
            }, 800);
        }
    });

    // Scroll-triggered animations
    function animateOnScroll() {
        $('.fade-in').each(function(){
            var bottom_of_element = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            if(bottom_of_window > bottom_of_element - 100){
                $(this).addClass('visible');
            }
        });
    }

    $(window).scroll(animateOnScroll);
    animateOnScroll(); // trigger on load

    $(".dropdown").hover(
    function() {
        $(this).find(".dropdown-menu").stop(true, true).slideDown(200);
    },
    function() {
        $(this).find(".dropdown-menu").stop(true, true).slideUp(200);
    }
);

$(".dropdown > a").on("click", function(e) {
    e.preventDefault();
    $(this).next(".dropdown-menu").slideToggle(200);
});


});

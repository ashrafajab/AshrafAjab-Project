// testimonials.js - Simplified working version

$(function() {
    
    // Initialize carousel
    initTestimonialCarousel();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize mobile navigation
    initMobileNavigation();

    // ==================== FUNCTIONS ====================

    function initTestimonialCarousel() {
        let currentIndex = 0;
        let $cards = $('.testimonial-card');
        let totalCards = $cards.length;
        let $dots = $('.dot');
        let autoSlideInterval;
        
        if (totalCards === 0) return;
        
        function updateCarousel() {
            // Hide all cards
            $cards.removeClass('active');
            // Show current card
            $cards.eq(currentIndex).addClass('active');
            
            // Update dots
            $dots.removeClass('active');
            $dots.eq(currentIndex).addClass('active');
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }
        
        // Control buttons
        $('.next').click(function() {
            nextSlide();
            resetAutoSlide();
        });
        
        $('.prev').click(function() {
            prevSlide();
            resetAutoSlide();
        });
        
        // Dot navigation
        $('.dot').click(function() {
            currentIndex = $(this).index();
            updateCarousel();
            resetAutoSlide();
        });
        
        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Initialize
        updateCarousel();
        startAutoSlide();
        
        // Pause on hover
        $('.testimonial-carousel').hover(
            function() {
                clearInterval(autoSlideInterval);
            },
            function() {
                startAutoSlide();
            }
        );
    }

    function initScrollAnimations() {
        function checkVisibility() {
            $(".fade-in").each(function() {
                let $element = $(this);
                
                if ($element.hasClass("visible")) return;
                
                let elementTop = $element.offset().top;
                let windowHeight = $(window).height();
                let windowTop = $(window).scrollTop();
                
                if (elementTop < windowTop + windowHeight - 100) {
                    $element.addClass("visible");
                }
            });
        }
        
        $(window).on("scroll resize", checkVisibility);
        checkVisibility();
    }

    function initMobileNavigation() {
        // Hamburger menu toggle
        $(".hamburger").click(function() {
            $(this).toggleClass("active");
            $(".nav-links").toggleClass("active");
        });
        
        // Close mobile menu when clicking outside
        $(document).on("click", function(e) {
            if ($(window).width() <= 768) {
                if (!$(e.target).closest(".navbar").length && $(".nav-links").hasClass("active")) {
                    $(".nav-links").removeClass("active");
                    $(".hamburger").removeClass("active");
                }
            }
        });
        
        // Handle window resize
        $(window).resize(function() {
            if ($(window).width() > 768) {
                $(".nav-links").removeClass("active");
                $(".hamburger").removeClass("active");
            }
        });
    }

});
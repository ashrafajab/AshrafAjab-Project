// history.js - Updated with better animations and navigation

$(function() {
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Initialize hamburger menu (if not already in main.js)
    initMobileNavigation();
    
    // Initialize fade-in animations
    initScrollAnimations();
    
    // Add year data to history blocks for timeline
    addYearData();
    
    // Smooth scrolling for internal links
    initSmoothScrolling();

    // ==================== FUNCTIONS ====================

    function initScrollToTop() {
        // Create scroll to top button if it doesn't exist
        if (!$('#scrollTopBtn').length) {
            $('body').append('<button id="scrollTopBtn" title="Go to top"><i class="fas fa-chevron-up"></i></button>');
        }
        
        // Show/hide button on scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#scrollTopBtn').fadeIn(300);
            } else {
                $('#scrollTopBtn').fadeOut(300);
            }
        });
        
        // Scroll to top when clicked
        $('#scrollTopBtn').click(function() {
            $('html, body').animate({
                scrollTop: 0
            }, 800, 'easeInOutCubic');
            return false;
        });
    }

    function initMobileNavigation() {
        // Hamburger menu toggle
        $('.hamburger').click(function() {
            $(this).toggleClass('active');
            $('.nav-links').toggleClass('active');
            
            // Close dropdowns when opening mobile menu
            if ($('.nav-links').hasClass('active')) {
                $('.dropdown').removeClass('active');
                $('.dropdown-menu').slideUp(200);
            }
        });
        
        // Mobile dropdown toggle
        $('.dropdown > a').on('click', function(e) {
            if ($(window).width() <= 768) {
                e.preventDefault();
                var $dropdown = $(this).parent('.dropdown');
                var $menu = $dropdown.find('.dropdown-menu');
                
                // Close other dropdowns
                $('.dropdown').not($dropdown).removeClass('active');
                $('.dropdown-menu').not($menu).slideUp(200);
                
                // Toggle current dropdown
                $dropdown.toggleClass('active');
                $menu.slideToggle(200);
            }
        });
        
        // Close dropdowns when clicking outside (mobile)
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.dropdown, .hamburger').length) {
                $('.dropdown').removeClass('active');
                $('.dropdown-menu').slideUp(200);
                
                // Also close mobile menu if clicking outside
                if ($(window).width() <= 768) {
                    $('.nav-links').removeClass('active');
                    $('.hamburger').removeClass('active');
                }
            }
        });
        
        // Handle window resize
        $(window).resize(function() {
            if ($(window).width() > 768) {
                // Reset mobile menu on desktop
                $('.nav-links').removeClass('active');
                $('.hamburger').removeClass('active');
                $('.dropdown').removeClass('active');
                $('.dropdown-menu').css('display', '');
            }
        });
    }

    function initScrollAnimations() {
        function checkVisibility() {
            $('.fade-in').each(function() {
                var $element = $(this);
                
                // Skip if already visible
                if ($element.hasClass('visible')) return;
                
                var elementTop = $element.offset().top;
                var elementHeight = $element.outerHeight();
                var windowHeight = $(window).height();
                var windowTop = $(window).scrollTop();
                
                // Check if element is in viewport
                if (elementTop < windowTop + windowHeight - 100) {
                    // Add delay for staggered animation
                    var delay = $element.index() * 200;
                    
                    setTimeout(function() {
                        $element.addClass('visible');
                        
                        // Add bounce effect for history blocks
                        if ($element.hasClass('history-block')) {
                            $element.css({
                                'transition': 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            });
                        }
                    }, Math.min(delay, 600));
                }
            });
        }
        
        // Run on load and scroll
        $(window).on('scroll resize', checkVisibility);
        checkVisibility();
        
        // Add parallax effect to hero
        $(window).scroll(function() {
            var scrolled = $(window).scrollTop();
            $('.history-hero-content').css('transform', 'translateY(' + (scrolled * 0.3) + 'px)');
        });
    }

    function addYearData() {
        // Add year data to history blocks for timeline styling
        var years = ['2010', '2015', '2018', '2023'];
        
        $('.history-block').each(function(index) {
            if (index < years.length) {
                $(this).find('.history-text').attr('data-year', years[index]);
            }
        });
    }

    function initSmoothScrolling() {
        // Smooth scroll for anchor links
        $('a[href^="#"]').on('click', function(e) {
            if (this.hash !== "" && $(this.hash).length) {
                e.preventDefault();
                
                var hash = this.hash;
                var headerHeight = $('.site-header').outerHeight() || 0;
                
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - headerHeight
                }, 800, 'easeInOutCubic', function() {
                    // Add hash to URL without scrolling
                    window.location.hash = hash;
                });
            }
        });
        
        // Remove hash from URL on page load
        if (window.location.hash) {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 1);
        }
    }
    
    // Add CSS for cubic-bezier easing if not present
    if (!$('#easing-styles').length) {
        $('head').append('<style id="easing-styles">' +
            'html { scroll-behavior: smooth; }' +
            '.easeInOutCubic { transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }' +
        '</style>');
    }
    
    // Add loading animation
    $(window).on('load', function() {
        setTimeout(function() {
            $('body').addClass('loaded');
        }, 500);
    });

});
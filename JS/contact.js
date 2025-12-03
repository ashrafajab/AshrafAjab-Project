$(function() {
    
    // Initialize contact page functionality
    initScrollAnimations();
    initContactForm();
    initMobileNavigation();

    // ==================== FUNCTIONS ====================

    function initScrollAnimations() {
        function checkVisibility() {
            $(".fade-in").each(function() {
                let element = $(this);
                
                if (element.hasClass("visible")) return;
                
                let elementTop = element.offset().top;
                let windowHeight = $(window).height();
                let windowTop = $(window).scrollTop();
                
                if (elementTop < windowTop + windowHeight - 100) {
                    element.addClass("visible");
                }
            });
        }
        
        $(window).on("scroll resize", checkVisibility);
        checkVisibility();
    }

    function initContactForm() {
        $("#contactForm").submit(function(e) {
            e.preventDefault();
            
            let form = $(this);
            let status = $(".form-status");
            
            // Get form values
            let name = $("#name").val().trim();
            let email = $("#email").val().trim();
            let message = $("#message").val().trim();
            
            // Reset status
            status.text("");
            
            // Validate required fields
            if (name === "" || email === "" || message === "") {
                status.text("Please fill out all required fields").css("color", "red");
                return;
            }
            
            // Validate email
            let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!emailPattern.test(email)) {
                status.text("Please enter a valid email address").css("color", "red");
                return;
            }
            
            // Show loading state
            let submitBtn = $(".submit-btn");
            let originalText = submitBtn.text();
            submitBtn.text("Sending...").prop("disabled", true);
            
            // Simulate sending
            setTimeout(function() {
                // Success
                status.text("Thank you! Your message has been sent.").css("color", "var(--accent-color)");
                form[0].reset();
                submitBtn.text(originalText).prop("disabled", false);
            }, 1500);
        });
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
    }

});
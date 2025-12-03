$(function() {
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize reservation form
    initReservationForm();
    
    // Initialize form date restrictions
    initDateRestrictions();

    // ==================== FUNCTIONS ====================

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

    function initReservationForm() {
        let form = $("#reservationForm");
        let message = $("#formMessage");
        
        form.submit(function(e) {
            e.preventDefault();
            
            // Reset message
            message.removeClass("success error").text("");
            
            // Get form values
            let name = $("#fullName").val().trim();
            let phone = $("#phone").val().trim();
            let guests = $("#guests").val();
            let date = $("#date").val();
            let time = $("#time").val();
            
            // Validate required fields
            if (name === "" || phone === "" || guests === "" || date === "" || time === "") {
                showMessage("Please fill out all required fields", "error");
                shakeForm();
                return;
            }
            
            // Validate phone number
            let phonePattern = /^[0-9+\-\s]{8,15}$/;
            if (!phonePattern.test(phone)) {
                showMessage("Please enter a valid phone number", "error");
                shakeForm();
                return;
            }
            
            // Validate date is not in the past
            let selectedDate = new Date(date);
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showMessage("Please select a future date", "error");
                shakeForm();
                return;
            }
            
            // Show loading state
            let submitBtn = form.find(".btn-primary");
            let originalText = submitBtn.text();
            submitBtn.text("Processing...").prop("disabled", true);
            
            // Simulate form submission
            setTimeout(function() {
                // Success
                showMessage("Thank you! Your reservation has been confirmed. We'll contact you shortly.", "success");
                form[0].reset();
                submitBtn.text(originalText).prop("disabled", false);
                
                // Reset date to today
                let today = new Date().toISOString().split('T')[0];
                $("#date").val(today);
                
            }, 1500);
        });
        
        function showMessage(text, type) {
            message.text(text)
                  .removeClass("success error")
                  .addClass(type + " visible");
            
            // Auto-hide success message after 5 seconds
            if (type === "success") {
                setTimeout(function() {
                    message.fadeOut(500, function() {
                        message.text("").removeClass("visible").fadeIn(0);
                    });
                }, 5000);
            }
        }
        
        function shakeForm() {
            form.addClass("shake");
            setTimeout(function() {
                form.removeClass("shake");
            }, 500);
        }
    }

    function initDateRestrictions() {
        // Set min date to today
        let today = new Date().toISOString().split('T')[0];
        $("#date").attr("min", today);
        
        // Set max date to 3 months from now
        let maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        let maxDateStr = maxDate.toISOString().split('T')[0];
        $("#date").attr("max", maxDateStr);
        
        // Set default date to today
        $("#date").val(today);
        
        // Set time range (12:00 PM to 11:30 PM)
        $("#time").attr("min", "12:00");
        $("#time").attr("max", "23:30");
        $("#time").val("19:00"); // Default to 7:00 PM
    }
    

});
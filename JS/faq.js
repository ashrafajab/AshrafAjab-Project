// faq.js - Enhanced with categories, animations, and better UX

$(function() {
    
    // Initialize FAQ functionality
    initFAQAccordion();
    initFAQSearch();
    initFAQCategories();
    initScrollAnimations();
    initMobileNavigation();
    initFAQCounter();

    // ==================== FUNCTIONS ====================

    function initFAQAccordion() {
        // FAQ Accordion with smooth animations
        $(".faq-question").click(function() {
            const $item = $(this).parent();
            const $answer = $item.find(".faq-answer");
            const $arrow = $(this).find(".arrow");
            
            // Toggle current item
            if ($item.hasClass("active")) {
                // Close with animation
                $item.removeClass("active");
                $answer.slideUp(300, function() {
                    $item.css("border-color", "transparent");
                });
                $arrow.css("transform", "rotate(0deg)");
            } else {
                // Close other items
                $(".faq-item.active").each(function() {
                    const $otherItem = $(this);
                    const $otherAnswer = $otherItem.find(".faq-answer");
                    const $otherArrow = $otherItem.find(".arrow");
                    
                    $otherItem.removeClass("active");
                    $otherAnswer.slideUp(300);
                    $otherArrow.css("transform", "rotate(0deg)");
                });
                
                // Open current item
                $item.addClass("active");
                $answer.slideDown(300);
                $arrow.css("transform", "rotate(45deg)");
                $item.css("border-color", "var(--accent-color)");
                
                // Scroll to center if on mobile
                if ($(window).width() <= 768) {
                    $('html, body').animate({
                        scrollTop: $item.offset().top - 100
                    }, 300);
                }
            }
        });
        
        // Keyboard navigation for FAQ items
        $(".faq-question").on("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                $(this).trigger("click");
            }
        });
        
        // Auto-open first FAQ item on desktop
        if ($(window).width() > 768) {
            $(".faq-item:first-child").addClass("active");
            $(".faq-item:first-child .faq-answer").slideDown(300);
            $(".faq-item:first-child .arrow").css("transform", "rotate(45deg)");
        }
    }

    function initFAQSearch() {
        const $searchInput = $("#faqSearch");
        const $faqItems = $(".faq-item");
        const $noResults = $('<div class="no-results" style="text-align: center; padding: 40px; color: var(--text-color); display: none;"><h3>No results found</h3><p>Try searching with different keywords</p></div>');
        
        // Add no results message
        $(".faq-section .container").append($noResults);
        
        // Debounce function for better performance
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Search function
        const performSearch = function() {
            const searchTerm = $searchInput.val().toLowerCase().trim();
            let foundResults = false;
            
            if (searchTerm.length === 0) {
                // Show all items
                $faqItems.show();
                $noResults.hide();
                return;
            }
            
            $faqItems.each(function() {
                const $item = $(this);
                const question = $item.find(".faq-question h3").text().toLowerCase();
                const answer = $item.find(".faq-answer p").text().toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    $item.show();
                    foundResults = true;
                    
                    // Highlight matching text
                    highlightText($item, searchTerm);
                } else {
                    $item.hide();
                    $item.removeClass("active");
                    $item.find(".faq-answer").slideUp(300);
                    $item.find(".arrow").css("transform", "rotate(0deg)");
                }
            });
            
            // Show/hide no results message
            if (foundResults) {
                $noResults.hide();
            } else {
                $noResults.show();
            }
        };
        
        // Highlight matching text
        function highlightText($item, searchTerm) {
            // Remove previous highlights
            $item.find(".highlight").each(function() {
                $(this).replaceWith($(this).text());
            });
            
            // Highlight in question
            const $question = $item.find(".faq-question h3");
            const questionText = $question.text();
            const highlightedQuestion = questionText.replace(
                new RegExp(`(${searchTerm})`, 'gi'),
                '<span class="highlight" style="background: var(--accent-color); color: var(--white); padding: 2px 4px; border-radius: 3px;">$1</span>'
            );
            $question.html(highlightedQuestion);
            
            // Highlight in answer if visible
            if ($item.hasClass("active")) {
                const $answer = $item.find(".faq-answer p");
                const answerText = $answer.text();
                const highlightedAnswer = answerText.replace(
                    new RegExp(`(${searchTerm})`, 'gi'),
                    '<span class="highlight" style="background: var(--accent-color); color: var(--white); padding: 2px 4px; border-radius: 3px;">$1</span>'
                );
                $answer.html(highlightedAnswer);
            }
        }
        
        // Bind search with debounce
        $searchInput.on("input", debounce(performSearch, 300));
        
        // Clear button functionality
        $searchInput.after('<button class="search-clear" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--accent-color); cursor: pointer; display: none;"><i class="fas fa-times"></i></button>');
        
        $(".search-clear").click(function() {
            $searchInput.val("");
            performSearch();
            $searchInput.focus();
            $(this).hide();
        });
        
        $searchInput.on("input", function() {
            $(".search-clear").toggle($(this).val().length > 0);
        });
    }

    function initFAQCategories() {
        // Create categories if they don't exist
        if (!$(".faq-categories").length) {
            const categories = [
                { id: "all", name: "All Questions", count: 8 },
                { id: "delivery", name: "Delivery", count: 2 },
                { id: "locations", name: "Locations", count: 2 },
                { id: "catering", name: "Catering", count: 2 },
                { id: "quality", name: "Quality", count: 2 }
            ];
            
            const $categoriesSection = $('<section class="faq-categories fade-in"></section>');
            const $container = $('<div class="container"></div>');
            const $title = $('<h2>Browse by Category</h2>');
            const $buttonsDiv = $('<div class="category-buttons"></div>');
            
            categories.forEach(category => {
                $buttonsDiv.append(`<button class="category-btn" data-category="${category.id}">${category.name} <span class="category-count">(${category.count})</span></button>`);
            });
            
            $container.append($title, $buttonsDiv);
            $categoriesSection.append($container);
            $(".faq-hero").after($categoriesSection);
        }
        
        // Add category data to FAQ items
        $(".faq-item").each(function(index) {
            const categories = ["delivery", "locations", "catering", "quality"];
            if (index < categories.length) {
                $(this).attr("data-category", categories[index]);
            } else {
                $(this).attr("data-category", "general");
            }
        });
        
        // Category filtering
        $(".category-btn").click(function() {
            const category = $(this).data("category");
            
            // Update active button
            $(".category-btn").removeClass("active");
            $(this).addClass("active");
            
            // Filter FAQ items
            if (category === "all") {
                $(".faq-item").show();
            } else {
                $(".faq-item").each(function() {
                    $(this).toggle($(this).data("category") === category);
                });
            }
            
            // Update search
            $("#faqSearch").trigger("input");
        });
        
        // Auto-select "All" category
        $(".category-btn[data-category='all']").addClass("active");
    }

    function initScrollAnimations() {
        function checkVisibility() {
            $(".fade-in").each(function() {
                const $element = $(this);
                
                if ($element.hasClass("visible")) return;
                
                const elementTop = $element.offset().top;
                const elementHeight = $element.outerHeight();
                const windowHeight = $(window).height();
                const windowTop = $(window).scrollTop();
                
                if (elementTop < windowTop + windowHeight - 100) {
                    const delay = $element.index() * 100;
                    
                    setTimeout(() => {
                        $element.addClass("visible");
                    }, Math.min(delay, 300));
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

    function initFAQCounter() {
        // Add counter section if it doesn't exist
        if (!$(".faq-counter").length) {
            const $counterSection = $('<section class="faq-counter fade-in"></section>');
            const $container = $('<div class="container"></div>');
            
            const totalQuestions = $(".faq-item").length;
            const answeredQuestions = $(".faq-item .faq-answer p").filter(function() {
                return $(this).text().trim().length > 0;
            }).length;
            
            $container.html(`
                <div class="counter-number">${answeredQuestions}</div>
                <div class="counter-text">Questions Answered</div>
                <div style="color: var(--text-color); font-size: 0.9rem; margin-top: 10px;">
                    Out of ${totalQuestions} total questions
                </div>
            `);
            
            $counterSection.append($container);
            $(".faq-section").after($counterSection);
        }
        
        // Animate counter on scroll
        $(window).scroll(function() {
            const $counterNumber = $(".counter-number");
            const targetNumber = parseInt($counterNumber.text());
            const elementTop = $counterNumber.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop && !$counterNumber.data("animated")) {
                $counterNumber.data("animated", true);
                
                // Animate counting
                let current = 0;
                const increment = targetNumber / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNumber) {
                        clearInterval(timer);
                        $counterNumber.text(targetNumber);
                    } else {
                        $counterNumber.text(Math.floor(current));
                    }
                }, 30);
            }
        });
    }
    
    // Add CSS for animations
    if (!$("#faq-styles").length) {
        $("head").append(`
            <style id="faq-styles">
                .highlight {
                    background: var(--accent-color) !important;
                    color: var(--white) !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    animation: highlightPulse 1s ease-in-out;
                }
                
                @keyframes highlightPulse {
                    0% { background: transparent; }
                    50% { background: var(--accent-light); }
                    100% { background: var(--accent-color); }
                }
                
                .category-count {
                    font-size: 0.9em;
                    opacity: 0.8;
                    margin-left: 5px;
                }
            </style>
        `);
    }

});
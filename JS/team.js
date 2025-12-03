// team.js - Updated and fixed version

$(document).ready(function() {
    // ---------- Bios Data (FIXED image paths) ----------
    let bios = {
        "chef-rolly": {
            name: "Chef Rolly",
            role: "Head Sushi Chef",
            photo: "images/Chef Rolly.jpeg",
            text: "Akira trained in Tokyo and brings 20 years of sushi craft to Sushi Bell. He focuses on fresh seasonal fish, precision cuts and balancing texture and flavor.",
            skills: [
                {name: "Sushi Craft", pct: "98%"},
                {name: "Knife Skills", pct: "96%"},
                {name: "Plating", pct: "92%"}
            ]
        },
        "mohammed": {
            name: "Mohammed Khalil",
            role: "General Manager",
            photo: "images/chef3.jpg",
            text: "Mohammed oversees daily operations, staff training and guest experience. Highly organized with a sharp eye for detail.",
            skills: [
                {name: "Operations", pct: "94%"},
                {name: "Leadership", pct: "92%"}
            ]
        },
        "leila": {
            name: "Leila Haddad",
            role: "Pastry Chef",
            photo: "images/chef2.jpg",
            text: "Leila blends traditional pastry technique with modern flavors — designing desserts that complement our sushi menu.",
            skills: [
                {name: "Dessert Design", pct: "93%"},
                {name: "Creativity", pct: "90%"}
            ]
        },
        "sara": {
            name: "Sara Nassar",
            role: "Front of House",
            photo: "images/chef4.jpg",
            text: "Sara leads guest relations and events, ensuring warm service and smooth dining flow.",
            skills: [
                {name: "Customer Care", pct: "95%"},
                {name: "Events", pct: "88%"}
            ]
        }
    };

    // ---------- Filter buttons ----------
    $('.filter-btn').on('click', function(){
        let filter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        // Show/hide based on filter
        $('.team-card').each(function(){
            let category = $(this).data('category');
            if (filter === 'all' || filter === category) {
                $(this).fadeIn(300);
            } else {
                $(this).fadeOut(300);
            }
        });
        
        // Center the visible cards after filtering
        setTimeout(centerVisibleCards, 350);
        visibleFadeIn();
    });

    // Function to center visible cards
    function centerVisibleCards() {
        $('.team-card:visible').each(function() {
            $(this).css({
                'margin-left': 'auto',
                'margin-right': 'auto'
            });
        });
    }

    // ---------- Bio modal open ----------
    $('.bio-open').on('click', function(){
        let memberId = $(this).closest('.team-card').data('member');
        let memberData = bios[memberId];
        
        if (!memberData) {
            console.error('No data found for member:', memberId);
            return;
        }

        // Set modal content
        $('.bio-photo').attr('src', memberData.photo).attr('alt', memberData.name);
        $('.bio-name').text(memberData.name);
        $('.bio-role').text(memberData.role);
        $('.bio-text').text(memberData.text);

        // Add skills to modal
        let skillsHtml = '';
        if (memberData.skills && memberData.skills.length > 0) {
            skillsHtml = '<h4 style="color:var(--white); margin-top:20px;">Skills:</h4>';
            memberData.skills.forEach(function(skill) {
                skillsHtml += `<div class="skill-item" style="margin:10px 0;">
                    <div style="color:var(--white); font-weight:600;">${skill.name}</div>
                    <div class="skill-bar-small">
                        <div class="skill-fill-small" style="width:${skill.pct}; background:var(--accent-color); height:8px; border-radius:4px;"></div>
                    </div>
                    <div style="color:var(--text-color); font-size:0.9rem;">${skill.pct}</div>
                </div>`;
            });
        }
        $('.bio-skills').html(skillsHtml);

        // Show modal
        $('.bio-modal').fadeIn(200).attr('aria-hidden', 'false');
        $('body').css('overflow', 'hidden'); // Prevent scrolling
    });

    // ---------- Close modal ----------
    $(document).on('click', function(e) {
        // Close when clicking the overlay or close button
        if ($(e.target).hasClass('bio-modal') || $(e.target).hasClass('modal-close')) {
            $('.bio-modal').fadeOut(200).attr('aria-hidden', 'true');
            $('body').css('overflow', 'auto'); // Restore scrolling
        }
    });

    // Close with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('.bio-modal').is(':visible')) {
            $('.bio-modal').fadeOut(200).attr('aria-hidden', 'true');
            $('body').css('overflow', 'auto');
        }
    });

    // ---------- Fade-in animation ----------
    function visibleFadeIn() {
        $('.fade-in').each(function(){
            let $el = $(this);
            if ($el.hasClass('visible')) return;
            
            let elementTop = $el.offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop + 100) {
                $el.addClass('visible');
            }
        });
    }

    // ---------- Skill bars animation ----------
    function animateSkillBars() {
        $('.skill-fill').each(function(){
            let $el = $(this);
            if ($el.data('animated')) return;
            
            let elementTop = $el.offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop + 100) {
                let fillWidth = $el.data('fill');
                $el.css('width', fillWidth);
                $el.data('animated', true);
            }
        });
    }

    // ---------- Initialize animations ----------
    $(window).on('scroll resize', function() {
        visibleFadeIn();
        animateSkillBars();
    });
    
    // Initial run
    visibleFadeIn();
    animateSkillBars();
    
    // Center cards on load
    centerVisibleCards();

    // ---------- Hamburger menu (fallback) ----------
    $('.hamburger').on('click', function(){
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if ($(window).width() <= 768) {
            if (!$(e.target).closest('.navbar').length && $('.nav-links').hasClass('active')) {
                $('.nav-links').removeClass('active');
                $('.hamburger').removeClass('active');
            }
        }
    });

    // Handle window resize
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $('.nav-links').removeClass('active');
            $('.hamburger').removeClass('active');
        }
    });
});

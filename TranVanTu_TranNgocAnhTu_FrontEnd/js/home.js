(function ($) {
  "use strict";

  // ==========================================================
  // 1. NAVBAR SCROLL (Chạy Ngay Lập Tức)
  // ==========================================================
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $("#mainNav").addClass("scrolled");
    } else {
      $("#mainNav").removeClass("scrolled");
    }
  });
  // Kiểm tra Navbar ngay khi tải
  if ($(window).scrollTop() > 45) {
    $("#mainNav").addClass("scrolled");
  }

  // ==========================================================
  // TẤT CẢ CODE CÒN LẠI PHẢI CHẠY SAU KHI DOM SẴNG SÀNG
  // ==========================================================
  $(document).ready(function () {
    // ==========================================================
    // ⭐️⭐️ LOGIC ĐÁNH DẤU MENU ĐANG HOẠT ĐỘNG (ACTIVE NAVBAR LINK) ⭐️⭐️
    // ==========================================================

    // 1. Lấy tên file của trang hiện tại (ví dụ: home.html)
    var currentPath = window.location.pathname.replace(/\/$/, "");
    var pathName = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    // Xử lý Trang Chủ: nếu URL là / hoặc rỗng (thường là index.html), gán nó là tên file Trang Chủ của bạn
    if (pathName === "" || pathName === "index.html") {
      pathName = "home.html";
    }

    // 2. Duyệt qua tất cả các liên kết trong Navbar và so sánh
    $("#mainNav .navbar-nav .nav-link").each(function () {
      var $this = $(this);
      // Lấy tên file từ thuộc tính href của link menu (ví dụ: about.html)
      var linkPath = $this
        .attr("href")
        .substring($this.attr("href").lastIndexOf("/") + 1);

      // 3. So sánh và thêm class 'active' nếu tên file khớp
      if (linkPath === pathName) {
        // Xóa class 'active' khỏi tất cả các liên kết trước (đảm bảo chỉ 1 cái active)
        $("#mainNav .navbar-nav .nav-link").removeClass("active");

        // Thêm class 'active' vào liên kết hiện tại
        $this.addClass("active");
      }
    });

    // ==========================================================
    // KHỐI KHỞI TẠO THƯ VIỆN (Fix lỗi r.getClientRects & TypeError)
    // ==========================================================

    // A. Khởi tạo WOW.js
    if (window.WOW) {
      new WOW().init();
    }

    // B. Khởi tạo Counter-Up (Thêm setTimeout 100ms để đảm bảo DOM sẵn sàng hơn)
    // Đây là cách fix phổ biến cho lỗi r.getClientRects liên quan đến Waypoints/CounterUp
    setTimeout(function () {
      if ($.fn.counterUp) {
        $('[data-toggle="counter-up"]').counterUp({
          delay: 10,
          time: 2000,
        });
      }
    }, 100);

    // C. Khởi tạo Owl Carousel cho Testimonial
    if ($(".testimonial-carousel").length) {
      $(".testimonial-carousel").owlCarousel({
        loop: true,
        margin: 25,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: false,
        smartSpeed: 800,
        center: false,
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          992: { items: 3 },
        },
      });
    }

    // ==========================================================
    // 2. LOGIC TÙY CHỈNH CỦA BẠN (Đã Gói Gọn)
    // ==========================================================

    // Hàm đếm số TÙY CHỈNH (giữ lại nếu bạn không dùng Counter-Up)
    function animateCountUp() {
      $(".count-target").each(function () {
        var $this = $(this);
        var countTo = $this.data("count-to");

        $({ countNum: $this.text() }).animate(
          { countNum: countTo },
          {
            duration: 2000,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
            },
          }
        );
      });
    }

    // Hàm kiểm tra và kích hoạt hiệu ứng cuộn TÙY CHỈNH (animated-item)
    function checkAndAnimateElements() {
      var windowTop = $(window).scrollTop();
      var windowBottom = windowTop + $(window).height();

      // Kích hoạt hiệu ứng cuộn tùy chỉnh
      $(".animated-item, .animated-set").each(function () {
        var $element = $(this);
        var elementTop = $element.offset().top;
        var triggerPoint = elementTop - $(window).height() * 0.15;

        if (windowBottom > triggerPoint && !$element.hasClass("show-done")) {
          var delay = $element.data("delay") || 0;

          setTimeout(function () {
            $element.addClass("show");
            $element.addClass("show-done");
          }, delay);
        }
      });

      // Kích hoạt Hiệu ứng Đếm Số TÙY CHỈNH (Nếu không dùng Counter-Up)
      var $counterSet = $("#counter-set");
      if ($counterSet.length && !$counterSet.hasClass("count-started")) {
        var counterTop = $counterSet.offset().top;
        var counterTriggerPoint = counterTop - $(window).height() * 0.15;

        if (windowBottom > counterTriggerPoint) {
          // Chạy hàm đếm tùy chỉnh của bạn
          animateCountUp();
          $counterSet.addClass("count-started");
        }
      }
    }

    // Kích hoạt lắng nghe sự kiện Scroll và chạy lần đầu
    $(window).on("scroll", checkAndAnimateElements);
    checkAndAnimateElements();

    // ==========================================================
    // 3. TRIGGER MENU-SECTION BẰNG INTERSECTIONOBSERVER (thay Waypoints)
    (function () {
      const el = document.getElementById("menu-section");
      if (!el) return;

      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            // === Code bạn muốn chạy khi #menu-section vào khung nhìn ===
            el.classList.add("in-view");

            // Ví dụ: kích hoạt hiệu ứng cho các item bên trong
            el.querySelectorAll(".animated-item").forEach((item) => {
              const d = parseInt(item.dataset.delay || 0, 10);
              setTimeout(() => {
                item.classList.add("show", "show-done");
              }, d);
            });

            // Chạy 1 lần rồi ngừng quan sát (tương đương this.destroy())
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.25 }
      ); // ~ tương đương offset 75%

      io.observe(el);
    })();

    // ==========================================================
    // 4. MODAL VIDEO
    // ==========================================================
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });
    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });

    // ==========================================================
    // 5. TRƯỢT TESTIMONIAL TÙY CHỈNH
    // ==========================================================
    const feedbackContainer = document.getElementById("feedbackContainer");
    if (feedbackContainer) {
      const totalFeedbacks = 5;
      let currentIndex = 0;
      function updateFeedback() {
        const movePercent = (100 / 3) * currentIndex;
        feedbackContainer.style.transform = `translateX(-${movePercent}%)`;
      }
      setInterval(() => {
        currentIndex++;
        if (currentIndex > totalFeedbacks - 3) {
          currentIndex = 0;
        }
        updateFeedback();
      }, 2000);
    }
  }); // Kết thúc $(document).ready()
})(jQuery);

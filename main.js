(function() {
    function ComeIn() {
        canvas = document.getElementById('canvas');
        canvas.top = canvas.top - 10;
        if (canvas.top <= 0) {
            canvas.top = 0;
        } else {
            requestAnimationFrame(ComeIn);
        }
    }
    function SetCircle() {
        var circle = document.getElementsByClassName('circle')[0];
    }
    function SetLogo() {
        var logo = document.getElementsByClassName('logo')[0];
    }
    document.getElementsByClassName('leftside')[0]
        .addEventListener('click', function (event) {
            window.location.href = 'https://mit-games.kr/wordpress';
    });
    document.getElementsByClassName('rightside')[0]
        .addEventListener('click', function (event) {
            window.location.href = 'https://mit-games.kr/mediawiki';
    });
    document.getElementsByClassName('circle')[0]
        .addEventListener('click', function (event) {
            canvas = document.getElementById('canvas');
            canvas.style.display = 'block';
            canvas.style.top = "0px";
            canvas.style.left = "0px";
            canvas.top = window.innerHeight;
    });
    window.addEventListener('resize', function() {
        SetLogo();
        SetCircle();
    });
    window.addEventListener("load", function () {
        SetLogo();
        SetCircle();
    });
})();

(function() {
    function checkBrowserVersion() {
        const ua = navigator.userAgent;
        let browserName = '';
        let fullVersion = '';

        if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
            browserName = "Chrome";
            fullVersion = ua.substring(ua.indexOf("Chrome/") + 7).split(" ")[0];
        } else if (ua.indexOf("Firefox") > -1) {
            browserName = "Firefox";
            fullVersion = ua.substring(ua.indexOf("Firefox/") + 8);
        } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
            browserName = "Safari";
            fullVersion = ua.substring(ua.indexOf("Version/") + 8).split(" ")[0];
        } else if (ua.indexOf("Edg") > -1) {
            browserName = "Edge";
            fullVersion = ua.substring(ua.indexOf("Edg/") + 4);
        } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) {
            browserName = "IE";
            const match = ua.match(/(MSIE |rv:)(\d+\.\d+)/);
            fullVersion = match ? match[2] : "0";
        }

        const majorVersion = parseInt(fullVersion.split('.')[0], 10);

        const minVersions = {
            "Chrome": 110,
            "Firefox": 100,
            "Edge": 100,
            "Safari": 14,
            "IE": 11
        };

        if (minVersions[browserName] && majorVersion < minVersions[browserName]) {
            alert(`Your browser ${browserName} ${majorVersion} is not supported. Please update to at least version ${minVersions[browserName]}.`);
            document.body.innerHTML = "<h1>Unsupported Browser</h1>";
            return false;
        }
        return true;
    }

    window.addEventListener('load', checkBrowserVersion);
})();

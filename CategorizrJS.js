/**
 * CategorizrJS Version 1.0
 * Written originally by Brett Jankord
 * Please note: http://www.brettjankord.com/2012/01/16/categorizr-a-modern-device-detection-script/
 *              https://github.com/bjankord/Categorizr
 * Ported by Kyle Chaplin - Copyright � 2012
 * Port of Categorizr to JavaScript Implementation using cookies.
 *
 * Big thanks to Rob Manson and http://mob-labs.com for their work on
 * the Not-Device Detection strategy:
 * http://smartmobtoolkit.wordpress.com/2009/01/26/not-device-detection-javascript-perl-and-php-code/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * and GNU Lesser General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 **/
var Categorizr = (function () {
    // Category name - In the event the script is already using 'category' in the session variables, you could easily change it by only needing to change this value.
    var category = 'comDeviceCategory';
    var DESKTOP = "desktop";
    var TABLET = "tablet";
    var TV = "tv";
    var MOBILE = "mobile";
    var catergorize_tablets_as_desktops = false; //If TRUE, tablets will be categorized as desktops
    var catergorize_tvs_as_desktops = false; //If TRUE, smartTVs will be categorized as desktops
    
    function getQueryString() {
        var result = {},
            queryString = location.search.substring(1),
            re = /([^&=]+)=([^&]*)/g,
            m;

        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }

    function setCookie(name, value, seconds) {
        if (typeof (seconds) != 'undefined') {
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(name) {
        name = name + "=";
        var carray = document.cookie.split(';');

        for (var i = 0; i < carray.length; i++) {
            var c = carray[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        this.setCookie(name, "", -1);
    }

    function setDeviceCookie(deviceCategory) {
        setCookie(category, deviceCategory, 2898000);
    }

    return {
        categorize: function () {
            // Set User Agent
            var ua = navigator.userAgent;

            // Check to see if device type is set in query string
            if (typeof getQueryString().view != 'undefined') {
                switch (getQueryString().view) {
                case DESKTOP:
                case TABLET:
                case TV:
                case MOBILE:
                    setDeviceCookie(getQueryString("view"));
                    break;
                }
            }

            // If session not yet set, check user agents
            if (getCookie(category) == null) {
                if (ua.match(/GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)) {
                    // User agent is a TV
                    setDeviceCookie(TV);
                } else if (ua.match(/Xbox|PLAYSTATION.3|Wii/i)) {
                    // User agent is a TV Based Gaming Console
                    setDeviceCookie(TV);
                } else if (ua.match(/iP(a|ro)d/i) || ua.match(/tablet/i) && !ua.match(/RX-34/i) || ua.match(/FOLIO/i)) {
                    // User agent is a Tablet
                    setDeviceCookie(TABLET);
                } else if (ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i)) {
                    // User agent is an Android Tablet
                    setDeviceCookie(TABLET);
                } else if (ua.match(/Kindle/i) || ua.match(/Mac.OS/i) && ua.match(/Silk/i)) {
                    // User agent is a Kindle or Kindle Fire
                    setDeviceCookie(TABLET);
                } else if (ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || ua.match(/MB511/i) && ua.match(/RUTEM/i)) {
                    // User agent is a pre Android 3.0 Tablet
                    setDeviceCookie(TABLET);
                } else if (ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i)) {
                    // User agent is unique Mobile User Agent    
                    setDeviceCookie(MOBILE);
                } else if (ua.match(/Opera/i) && ua.match(/Windows.NT.5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
                    // User agent is an odd Opera User Agent - http://goo.gl/nK90K
                    setDeviceCookie(MOBILE);
                } else if (ua.match(/Windows.(NT|XP|ME|9)/) && !ua.match(/Phone/i) || ua.match(/Win(9|.9|NT)/i)) {
                    // User agent is Windows Desktop
                    setDeviceCookie(DESKTOP);
                } else if (ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i)) {
                    // User agent is Mac Desktop
                    setDeviceCookie(DESKTOP);
                } else if (ua.match(/Linux/i) && ua.match(/X11/i)) {
                    // User agent is a Linux Desktop
                    setDeviceCookie(DESKTOP);
                } else if (ua.match(/Solaris|SunOS|BSD/i)) {
                    // User agent is a Solaris, SunOS, BSD Desktop
                    setDeviceCookie(DESKTOP);
                } else if (ua.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i) && !ua.match(/Mobile/i)) {
                    // User agent is a Desktop BOT/Crawler/Spider
                    setDeviceCookie(DESKTOP);
                } else {
                    // Otherwise assume it is a Mobile Device
                    setDeviceCookie(MOBILE);
                }
            }

            // Categorize Tablets as desktops
            if (catergorize_tablets_as_desktops && getCookie(category) == TABLET) {
                setDeviceCookie(DESKTOP);
            }

            // Categorize TVs as desktops
            if (catergorize_tvs_as_desktops && getCookie(category) == TV) {
                setDeviceCookie(DESKTOP);
            }

            return getCookie(category);
        },

        isDesktop: function () {
            return Categorizr.categorize() == DESKTOP;
        },

        isTablet: function () {
            return Categorizr.categorize() == TABLET;
        },

        isTV: function () {
            return Categorizr.categorize() == TV;
        },

        isMobile: function () {
            return Categorizr.categorize() == MOBILE;
        }
    };
})();
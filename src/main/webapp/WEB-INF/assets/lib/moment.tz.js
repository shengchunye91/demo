//! moment-timezone.js
//! version : 0.2.1
//! author : Tim Wood
//! license : MIT
//! github.com/moment/moment-timezone

(function (root, factory) {
    "use strict";

    /*global define*/
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory);                 // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('moment')); // Node
    } else {
        factory(root.moment);                        // Browser
    }
}(this, function (moment) {
    "use strict";

    // Do not load moment-timezone a second time.
    if (moment.tz !== undefined) { return moment; }

    var VERSION = "0.2.1",
        zones = {},
        links = {};

    /************************************
        Unpacking
    ************************************/

    function charCodeToInt(charCode) {
        if (charCode > 96) {
            return charCode - 87;
        } else if (charCode > 64) {
            return charCode - 29;
        }
        return charCode - 48;
    }

    function unpackBase60(string) {
        var i = 0,
            parts = string.split('.'),
            whole = parts[0],
            fractional = parts[1] || '',
            multiplier = 1,
            num,
            out = 0,
            sign = 1;

        // handle negative numbers
        if (string.charCodeAt(0) === 45) {
            i = 1;
            sign = -1;
        }

        // handle digits before the decimal
        for (i; i < whole.length; i++) {
            num = charCodeToInt(whole.charCodeAt(i));
            out = 60 * out + num;
        }

        // handle digits after the decimal
        for (i = 0; i < fractional.length; i++) {
            multiplier = multiplier / 60;
            num = charCodeToInt(fractional.charCodeAt(i));
            out += num * multiplier;
        }

        return out * sign;
    }

    function arrayToInt (array) {
        for (var i = 0; i < array.length; i++) {
            array[i] = unpackBase60(array[i]);
        }
    }

    function intToUntil (array, length) {
        for (var i = 0; i < length; i++) {
            array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
        }

        array[length - 1] = Infinity;
    }

    function mapIndices (source, indices) {
        var out = [], i;

        for (i = 0; i < indices.length; i++) {
            out[i] = source[indices[i]];
        }

        return out;
    }

    function unpack (string) {
        var data = string.split('|'),
            offsets = data[2].split(' '),
            indices = data[3].split(''),
            untils  = data[4].split(' ');

        arrayToInt(offsets);
        arrayToInt(indices);
        arrayToInt(untils);

        intToUntil(untils, indices.length);

        return {
            name    : data[0],
            abbrs   : mapIndices(data[1].split(' '), indices),
            offsets : mapIndices(offsets, indices),
            untils  : untils
        };
    }

    /************************************
        Zone object
    ************************************/

    function Zone (packedString) {
        if (packedString) {
            this._set(unpack(packedString));
        }
    }

    Zone.prototype = {
        _set : function (unpacked) {
            this.name    = unpacked.name;
            this.abbrs   = unpacked.abbrs;
            this.untils  = unpacked.untils;
            this.offsets = unpacked.offsets;
        },

        _index : function (timestamp) {
            var target = +timestamp,
                untils = this.untils,
                i;

            for (i = 0; i < untils.length; i++) {
                if (target < untils[i]) {
                    return i;
                }
            }
        },

        parse : function (timestamp) {
            var target  = +timestamp,
                offsets = this.offsets,
                untils  = this.untils,
                max     = untils.length - 1,
                offset, offsetNext, offsetPrev, i;

            for (i = 0; i < max; i++) {
                offset     = offsets[i];
                offsetNext = offsets[i + 1];
                offsetPrev = offsets[i ? i - 1 : i];

                if (offset < offsetNext && tz.moveAmbiguousForward) {
                    offset = offsetNext;
                } else if (offset > offsetPrev && tz.moveInvalidForward) {
                    offset = offsetPrev;
                }

                if (target < untils[i] - (offset * 60000)) {
                    return offsets[i];
                }
            }

            return offsets[max];
        },

        abbr : function (mom) {
            return this.abbrs[this._index(mom)];
        },

        offset : function (mom) {
            return this.offsets[this._index(mom)];
        }
    };

    /************************************
        Global Methods
    ************************************/

    function normalizeName (name) {
        return (name || '').toLowerCase().replace(/\//g, '_');
    }

    function addZone (packed) {
        var i, zone, zoneName;

        if (typeof packed === "string") {
            packed = [packed];
        }

        for (i = 0; i < packed.length; i++) {
            zone = new Zone(packed[i]);
            zoneName = normalizeName(zone.name);
            zones[zoneName] = zone;
            upgradeLinksToZones(zoneName);
        }
    }

    function getZone (name) {
        return zones[normalizeName(name)] || null;
    }

    function getNames () {
        var i, out = [];

        for (i in zones) {
            if (zones.hasOwnProperty(i) && zones[i]) {
                out.push(zones[i].name);
            }
        }

        return out.sort();
    }

    function addLink (aliases) {
        var i, alias;

        if (typeof aliases === "string") {
            aliases = [aliases];
        }

        for (i = 0; i < aliases.length; i++) {
            alias = aliases[i].split('|');
            pushLink(alias[0], alias[1]);
            pushLink(alias[1], alias[0]);
        }
    }

    function upgradeLinksToZones (zoneName) {
        if (!links[zoneName]) {
            return;
        }

        var i,
            zone = zones[zoneName],
            linkNames = links[zoneName];

        for (i = 0; i < linkNames.length; i++) {
            copyZoneWithName(zone, linkNames[i]);
        }

        links[zoneName] = null;
    }

    function copyZoneWithName (zone, name) {
        var linkZone = zones[normalizeName(name)] = new Zone();
        linkZone._set(zone);
        linkZone.name = name;
    }

    function pushLink (zoneName, linkName) {
        zoneName = normalizeName(zoneName);

        if (zones[zoneName]) {
            copyZoneWithName(zones[zoneName], linkName);
        } else {
            links[zoneName] = links[zoneName] || [];
            links[zoneName].push(linkName);
        }
    }

    function loadData (data) {
        addZone(data.zones);
        addLink(data.links);
        tz.dataVersion = data.version;
    }

    function zoneExists (name) {
        if (!zoneExists.didShowError) {
            zoneExists.didShowError = true;
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
                console.error("moment.tz.zoneExists('" + name + "') has been deprecated in favor of !moment.tz.zone('" + name + "')");
            }
        }
        return !!getZone(name);
    }

    function needsOffset (m) {
        return !!(m._a && (m._tzm === undefined));
    }

    function logError (message) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error(message);
        }
    }

    /************************************
        moment.tz namespace
    ************************************/

    function tz () {
        var args = Array.prototype.slice.call(arguments, 0, -1),
            name = arguments[arguments.length - 1],
            zone = getZone(name),
            out  = moment.utc.apply(null, args);

        if (zone && needsOffset(out)) {
            out.add(zone.parse(out), 'minutes');
        }

        out.tz(name);

        return out;
    }

    tz.version      = VERSION;
    tz.dataVersion  = '';
    tz._zones       = zones;
    tz._links       = links;
    tz.add          = addZone;
    tz.link         = addLink;
    tz.load         = loadData;
    tz.zone         = getZone;
    tz.zoneExists   = zoneExists; // deprecated in 0.1.0
    tz.names        = getNames;
    tz.Zone         = Zone;
    tz.unpack       = unpack;
    tz.unpackBase60 = unpackBase60;
    tz.needsOffset  = needsOffset;
    tz.moveInvalidForward   = true;
    tz.moveAmbiguousForward = false;

    /************************************
        Interface with Moment.js
    ************************************/

    var fn = moment.fn;

    moment.tz = tz;

    moment.updateOffset = function (mom, keepTime) {
        var offset;
        if (mom._z) {
            offset = mom._z.offset(mom);
            if (Math.abs(offset) < 16) {
                offset = offset / 60;
            }
            mom.zone(offset, keepTime);
        }
    };

    fn.tz = function (name) {
        if (name) {
            this._z = getZone(name);
            if (this._z) {
                moment.updateOffset(this);
            } else {
                logError("Moment Timezone has no data for " + name + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
            }
            return this;
        }
        if (this._z) { return this._z.name; }
    };

    function abbrWrap (old) {
        return function () {
            if (this._z) { return this._z.abbr(this); }
            return old.call(this);
        };
    }

    function resetZoneWrap (old) {
        return function () {
            this._z = null;
            return old.apply(this, arguments);
        };
    }

    fn.zoneName = abbrWrap(fn.zoneName);
    fn.zoneAbbr = abbrWrap(fn.zoneAbbr);
    fn.utc      = resetZoneWrap(fn.utc);

    // Cloning a moment should include the _z property.
    var momentProperties = moment.momentProperties;
    if (Object.prototype.toString.call(momentProperties) === '[object Array]') {
        // moment 2.8.1+
        momentProperties.push('_z');
        momentProperties.push('_a');
    } else {
        // moment 2.7.0
        momentProperties._z = null;
    }

    loadData({
        "version": "2014e",
        "zones": [
            "America/Adak|HAST HADT|a0 90|01010101010101010101010|1BR00 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Anchorage|AKST AKDT|90 80|01010101010101010101010|1BQX0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Anguilla|AST|40|0|",
            "America/Araguaina|BRT BRST|30 20|010|1IdD0 Lz0",
            "America/Argentina/Buenos_Aires|ART|30|0|",
            "America/Asuncion|PYST PYT|30 40|01010101010101010101010|1C430 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0",
            "America/Atikokan|EST|50|0|",
            "America/Bahia|BRT BRST|30 20|010|1FJf0 Rb0",
            "America/Bahia_Banderas|MST CDT CST|70 50 60|01212121212121212121212|1C1l0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0",
            "America/Belem|BRT|30|0|",
            "America/Belize|CST|60|0|",
            "America/Boa_Vista|AMT|40|0|",
            "America/Bogota|COT|50|0|",
            "America/Boise|MST MDT|70 60|01010101010101010101010|1BQV0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Campo_Grande|AMST AMT|30 40|01010101010101010101010|1BIr0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10",
            "America/Cancun|CST CDT|60 50|01010101010101010101010|1C1k0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0",
            "America/Caracas|VET|4u|0|",
            "America/Cayenne|GFT|30|0|",
            "America/Chicago|CST CDT|60 50|01010101010101010101010|1BQU0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Chihuahua|MST MDT|70 60|01010101010101010101010|1C1l0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0",
            "America/Creston|MST|70|0|",
            "America/Dawson|PST PDT|80 70|01010101010101010101010|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Detroit|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Eirunepe|AMT ACT|40 50|01|1KLE0",
            "America/Glace_Bay|AST ADT|40 30|01010101010101010101010|1BQS0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Godthab|WGT WGST|30 20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
            "America/Goose_Bay|AST ADT|40 30|01010101010101010101010|1BQQ1 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Guayaquil|ECT|50|0|",
            "America/Guyana|GYT|40|0|",
            "America/Havana|CST CDT|50 40|01010101010101010101010|1BQR0 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0",
            "America/La_Paz|BOT|40|0|",
            "America/Lima|PET|50|0|",
            "America/Metlakatla|MeST|80|0|",
            "America/Miquelon|PMST PMDT|30 20|01010101010101010101010|1BQR0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Montevideo|UYST UYT|20 30|01010101010101010101010|1BQQ0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10",
            "America/Noronha|FNT|20|0|",
            "America/North_Dakota/Beulah|MST MDT CST CDT|70 60 60 50|01232323232323232323232|1BQV0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Paramaribo|SRT|30|0|",
            "America/Port-au-Prince|EST EDT|50 40|0101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Santa_Isabel|PST PDT|80 70|01010101010101010101010|1C1m0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0",
            "America/Santiago|CLST CLT|30 40|01010101010101010101010|1C1f0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 1wn0 Rd0 1wn0 Rd0 1wn0 Rd0 1zb0 Op0 1zb0 Rd0 1wn0 Rd0",
            "America/Sao_Paulo|BRST BRT|20 30|01010101010101010101010|1BIq0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10",
            "America/Scoresbysund|EGT EGST|10 0|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
            "America/St_Johns|NST NDT|3u 2u|01010101010101010101010|1BQPv 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
        ],
        "links": [
            "America/Adak|America/Atka",
            "America/Adak|US/Aleutian",
            "America/Anchorage|America/Juneau",
            "America/Anchorage|America/Nome",
            "America/Anchorage|America/Sitka",
            "America/Anchorage|America/Yakutat",
            "America/Anchorage|US/Alaska",
            "America/Anguilla|America/Antigua",
            "America/Anguilla|America/Aruba",
            "America/Anguilla|America/Barbados",
            "America/Anguilla|America/Blanc-Sablon",
            "America/Anguilla|America/Curacao",
            "America/Anguilla|America/Dominica",
            "America/Anguilla|America/Grenada",
            "America/Anguilla|America/Guadeloupe",
            "America/Anguilla|America/Kralendijk",
            "America/Anguilla|America/Lower_Princes",
            "America/Anguilla|America/Marigot",
            "America/Anguilla|America/Martinique",
            "America/Anguilla|America/Montserrat",
            "America/Anguilla|America/Port_of_Spain",
            "America/Anguilla|America/Puerto_Rico",
            "America/Anguilla|America/Santo_Domingo",
            "America/Anguilla|America/St_Barthelemy",
            "America/Anguilla|America/St_Kitts",
            "America/Anguilla|America/St_Lucia",
            "America/Anguilla|America/St_Thomas",
            "America/Anguilla|America/St_Vincent",
            "America/Anguilla|America/Tortola",
            "America/Anguilla|America/Virgin",
            "America/Argentina/Buenos_Aires|America/Argentina/Catamarca",
            "America/Argentina/Buenos_Aires|America/Argentina/ComodRivadavia",
            "America/Argentina/Buenos_Aires|America/Argentina/Cordoba",
            "America/Argentina/Buenos_Aires|America/Argentina/Jujuy",
            "America/Argentina/Buenos_Aires|America/Argentina/La_Rioja",
            "America/Argentina/Buenos_Aires|America/Argentina/Mendoza",
            "America/Argentina/Buenos_Aires|America/Argentina/Rio_Gallegos",
            "America/Argentina/Buenos_Aires|America/Argentina/Salta",
            "America/Argentina/Buenos_Aires|America/Argentina/San_Juan",
            "America/Argentina/Buenos_Aires|America/Argentina/San_Luis",
            "America/Argentina/Buenos_Aires|America/Argentina/Tucuman",
            "America/Argentina/Buenos_Aires|America/Argentina/Ushuaia",
            "America/Argentina/Buenos_Aires|America/Buenos_Aires",
            "America/Argentina/Buenos_Aires|America/Catamarca",
            "America/Argentina/Buenos_Aires|America/Cordoba",
            "America/Argentina/Buenos_Aires|America/Jujuy",
            "America/Argentina/Buenos_Aires|America/Mendoza",
            "America/Argentina/Buenos_Aires|America/Rosario",
            "America/Atikokan|America/Cayman",
            "America/Atikokan|America/Coral_Harbour",
            "America/Atikokan|America/Jamaica",
            "America/Atikokan|America/Panama",
            "America/Belem|America/Fortaleza",
            "America/Belem|America/Maceio",
            "America/Belem|America/Recife",
            "America/Belem|America/Santarem",
            "America/Belize|America/Costa_Rica",
            "America/Belize|America/El_Salvador",
            "America/Belize|America/Guatemala",
            "America/Belize|America/Managua",
            "America/Belize|America/Regina",
            "America/Belize|America/Swift_Current",
            "America/Belize|America/Tegucigalpa",
            "America/Belize|Canada/East-Saskatchewan",
            "America/Belize|Canada/Saskatchewan",
            "America/Boa_Vista|America/Manaus",
            "America/Boa_Vista|America/Porto_Velho",
            "America/Boa_Vista|Brazil/West",
            "America/Boise|America/Cambridge_Bay",
            "America/Boise|America/Denver",
            "America/Boise|America/Edmonton",
            "America/Boise|America/Inuvik",
            "America/Boise|America/Ojinaga",
            "America/Boise|America/Shiprock",
            "America/Boise|America/Yellowknife",
            "America/Boise|Canada/Mountain",
            "America/Boise|US/Mountain",
            "America/Campo_Grande|America/Cuiaba",
            "America/Cancun|America/Merida",
            "America/Cancun|America/Mexico_City",
            "America/Cancun|America/Monterrey",
            "America/Cancun|Mexico/General",
            "America/Chicago|America/Indiana/Knox",
            "America/Chicago|America/Indiana/Tell_City",
            "America/Chicago|America/Knox_IN",
            "America/Chicago|America/Matamoros",
            "America/Chicago|America/Menominee",
            "America/Chicago|America/North_Dakota/Center",
            "America/Chicago|America/North_Dakota/New_Salem",
            "America/Chicago|America/Rainy_River",
            "America/Chicago|America/Rankin_Inlet",
            "America/Chicago|America/Resolute",
            "America/Chicago|America/Winnipeg",
            "America/Chicago|Canada/Central",
            "America/Chicago|US/Central",
            "America/Chicago|US/Indiana-Starke",
            "America/Chihuahua|America/Mazatlan",
            "America/Chihuahua|Mexico/BajaSur",
            "America/Creston|America/Dawson_Creek",
            "America/Creston|America/Hermosillo",
            "America/Creston|America/Phoenix",
            "America/Creston|US/Arizona",
            "America/Dawson|America/Ensenada",
            "America/Dawson|America/Los_Angeles",
            "America/Dawson|America/Tijuana",
            "America/Dawson|America/Vancouver",
            "America/Dawson|America/Whitehorse",
            "America/Dawson|Canada/Pacific",
            "America/Dawson|Canada/Yukon",
            "America/Dawson|Mexico/BajaNorte",
            "America/Detroit|America/Fort_Wayne",
            "America/Detroit|America/Grand_Turk",
            "America/Detroit|America/Indiana/Indianapolis",
            "America/Detroit|America/Indiana/Marengo",
            "America/Detroit|America/Indiana/Petersburg",
            "America/Detroit|America/Indiana/Vevay",
            "America/Detroit|America/Indiana/Vincennes",
            "America/Detroit|America/Indiana/Winamac",
            "America/Detroit|America/Indianapolis",
            "America/Detroit|America/Iqaluit",
            "America/Detroit|America/Kentucky/Louisville",
            "America/Detroit|America/Kentucky/Monticello",
            "America/Detroit|America/Louisville",
            "America/Detroit|America/Montreal",
            "America/Detroit|America/Nassau",
            "America/Detroit|America/New_York",
            "America/Detroit|America/Nipigon",
            "America/Detroit|America/Pangnirtung",
            "America/Detroit|America/Thunder_Bay",
            "America/Detroit|America/Toronto",
            "America/Detroit|Canada/Eastern",
            "America/Detroit|US/East-Indiana",
            "America/Detroit|US/Eastern",
            "America/Detroit|US/Michigan",
            "America/Eirunepe|America/Porto_Acre",
            "America/Eirunepe|America/Rio_Branco",
            "America/Glace_Bay|America/Halifax",
            "America/Glace_Bay|America/Moncton",
            "America/Glace_Bay|America/Thule",
            "America/Glace_Bay|Canada/Atlantic",
            "America/St_Johns|Canada/Newfoundland"
        ]
    });


    return moment;
}));
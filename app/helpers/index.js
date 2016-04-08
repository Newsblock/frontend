var common = require('./common');

exports.config = function() {
    return {
        // common
        ifindexby: common.ifindexby,
        plusone: common.plusone,
        link: common.linkHelper,
        'if-equal': common.ifEqual,
        'if-not-equal': common.ifNotEqual,
        'if-contains': common.ifContains,
        archivedate: common.archivedate,
        formatdate: common.formatdate,
        minsfromnow: common.minutesFromNow,
        decodeuri: common.decodeuri,
        decodehtml: common.decodehtml,
        'percentage': common.percentage,
        'add-commas': common.addCommasToNumber,
        'json-string': common.jsonString,
        block: common.block,
        contentFor: common.contentFor,
        'if-gt': common.ifGt,
        'abbreviation-count': common.abbreviationCount,
        'key-count': common.keyCount,
        'if-has-keys': common.ifHasKeys,
        'each-limit': common.eachLimit,
        'each-slice':common.eachSlice,
        imgurl:common.imgUrl,
        'favicon-url':common.faviconUrl,
        'adaptImgUrl': common.adaptImgUrl,
        'publisher-url': common.publisherUrl,
        roundThousands :common.roundThousands,
        'datetime':common.datetime
    };
};

define(['resource_model'], function (ResourceModel) {

    var EventModel = new ResourceModel({
        name:   'event',
        fields: [ 'title', 'description', 'address', 'latitude', 'longitude',
            'attendees', 'beginDate', 'beginTime', 'endDate', 'endTime',
            'registerLink', 'picture', 'organizer', 'organizerId',
            'organizerHash', 'created', 'id' ],
    });

    EventModel.prototype.datetimeHTML = function() {
        var bD = this.beginDate, eD = this.endDate,
            bT = this.beginTime, eT = this.endTime,
            icon = '<img class="icon-img" src="/img/event-detail-icon-calendar.png" />';
        function fmtRange(b, e) {
            var sep = (b && e ? ' - ' : '');
            return b || e ? '<div>' + (b ? b : '') + sep + (e ? e : '') + '</div>' : '';
        }
        if (!bD && !eD && !bT && !eT) return '';
        return '<div class="temporal-local">' + icon
            + '<div class="info-date">'
              + fmtRange(bD, eD)
              + fmtRange(bT, eT)
            + '</div></div>';
    };

    EventModel.prototype.addressHTML = function() {
        if (!this.address) return '';
        var address_lines = this.address.match(/^([^,]+),(.*)/);
        if (address_lines) address_lines.shift(); // remove global match
        else address_lines = [this.address];
        var icon = '<img class="icon-img" src="/img/event-detail-icon-pointer.png" />';
        return '<div class="temporal-local">' + icon
            + '<div class="info-address">' + address_lines.map(function (line) {
                return '<div>' + line + '</div>';
            }).join("\n") + '</div></div>';
    };
    EventModel.prototype.organizerHTML = function() {
        return '<img src="https://secure.gravatar.com/avatar/' + this.organizerHash + '" class="organizer-img" />'
            + '<div class="info-organizer"><span class="title">Organized by</span><br/>'
            + this.organizerId + '</div>'
    };
    EventModel.prototype.descriptionHTML = function() {
        var desc = this.description,
            len  = 240;
        if (desc.length > len) {
            desc = desc.substring(0, len);
            desc = desc.replace(/\w+$/, '');
            desc += ' ...';
        }
        return '<div class="info-description">' + desc + '</div>'
    };

    // TODO: convert to html-fragment
    EventModel.prototype.popupHTML = function() {
        return '<div class="info-content">'
            + '<div class="info-title">' + this.title + '</div>'
            + '<div class="info-when-where">'
              + this.datetimeHTML()
              + this.addressHTML()
            + '</div>'
            + this.descriptionHTML()
            + this.organizerHTML()

            // show details button
            + '<a href="' + this._uri + '">'
            + '<span class="icon-stack icon-button-size info-button">'
                + '<span class="icon-sign-blank icon-stack-base icon-button-color"></span>'
                + '<span class="icon-chevron-right icon-light"></span>'
            + '</span></a></div>';
    };

    return EventModel;
});

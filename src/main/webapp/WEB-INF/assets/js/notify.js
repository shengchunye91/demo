define([ 'jquery', 'pnotify', 'pnotify.buttons' ], function($, PNotify) {
    var notify_stack = {
        dir1 : "down",
        dir2 : "right",
        push : "bottom",
        spacing1 : 20,
        spacing2 : 20,
        firstpos1 : 100,
        context : $("body")
    };
    var styling = $.extend({}, PNotify.styling['fontawesome'], {
        info_icon : "i-warning-blue"
    });
    var buttons = {
    	closer: true,
    	sticker: false,
    	closer_hover: true,
    	sticker_hover: false,
    	labels: {}		
    };
    var notices = {};
    $.extend({
        notify : function(options) {
            // Type of the notice. "notice", "info", "success", or "error".
            var opts = $.extend({
                type : "info",
                delay : 4000,
                styling : styling,
                stack : notify_stack,
                width : '600px',
                min_height : '150px',
                buttons : buttons                
            }, options);
            notify_stack.firstpos2 = $(window).width() / 2 - 300;
            return new PNotify(opts);
        },
        notifyAll : function(notice) {
            var notifier = notices[notice.title];
            if (!notifier) {
                notices[notice.title] = notifier = {
                    args : [],
                    func : _.debounce(function() {
                        notices[arguments[0]] = undefined;
                        $.notify({
                            title : arguments[0],
                            text : arguments[1].join('</br>')
                        });
                    }, 1000)
                };
            }
            notifier.args.push(notice.text);
            notifier.func.apply(this, [notice.title, notifier.args]);
        }
    });
});
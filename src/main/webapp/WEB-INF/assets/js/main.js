require(['jquery', 'underscore', 'backbone', 'moment.tz','app', 'bootstrap', 'slimscroll', 'notify', 'autocomplete'], function ($, _, Backbone, moment,play) {
    _.templateSettings = {
        evaluate : /\{\{([\s\S]+?)\}\}/g,
        interpolate : /\{\{=([\s\S]+?)\}\}/g,
        escape : /\{\{-([\s\S]+?)\}\}/g
    };
    $.ajaxSetup({
        success : function (result, status, jqXHR) {
            if (result.error && result.error.length) {
                var has403 = false;
                $.notify({
                    title : 'Error',
                    text : $.map(result.error, function (err) {
                        has403 = has403 || (err.code == '403');
                        return _.escape(err.message);
                    }).join('</br>')
                });
                if (has403) {
                    location.pathname = '/login';
                }
                return false;
            } else {
                if (this.success && this.success.caller) {
                    this.success.caller.arguments[0][1][0] = result.data;
                }
            }
        },
        error : function (result, status, jqXHR) {
            console.log(arguments);
            return false;
        },
        cache : false
    });
    var BackboneParser = function (resp) {
        if (resp.error && resp.error.length) {
            var has403 = false;
            $.notify({
                title : 'Error',
                text : $.map(resp.error, function (err) {
                    has403 = has403 || (err.code == '403');
                    return _.escape(err.message);
                }).join('</br>')
            });
            if (has403) {
                location.pathname = '/login';
            }
            return [];
        } else if (resp.error && resp.data) {
            return resp.data;
        } else {
            return resp;
        }
    };
    Backbone.Collection = Backbone.Collection.extend({
            parse : BackboneParser
        });
    Backbone.Model = Backbone.Model.extend({
            parse : BackboneParser
        });
    var viewInstances = {};
    var AppRouter = Backbone.Router.extend({
            routes : {
                'allassets' : 'navigateToAllAssets'
            },
            navigateToAllAssets : function () {
                require(['allassets'], function (AllAssetsView) {
                    if (!viewInstances.AllAssetsView) {
                        viewInstances.AllAssetsView = new AllAssetsView({
                                el : $('#pageContent')
                            });
                        viewInstances.AllAssetsView.render();
                    }
                });
            }
        });

    var appRouter = new AppRouter;

    Backbone.history.start();

    var MainView = Backbone.View.extend({
            el : $('body'),
            initialize : function () {
                
            },

            events : {
                'click #myprofile' : 'navToMyprofile'
            },
            checkDefaultRoute : function () {
                var defaultRoute = Backbone.history.getFragment();
                appRouter.navigate('allassets', {
                    trigger : true
                });
            }
        });
    
    play.init();
    var mainView = new MainView();
    mainView.checkDefaultRoute();
});

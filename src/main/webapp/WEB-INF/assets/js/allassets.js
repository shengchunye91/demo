define(
		[ 'jquery', 'underscore', 'backbone', 'app',
				'text!views/allassets.html' ], function($, _, Backbone, app,
				tpl) {

			var PicView = Backbone.View.extend({
				tagName : 'li',
				className : 'span3',
				template : _.template($('#pic-list-template').html()),
				initialize : function() {

				},
				events : {

				},
				render : function() {
					this.$el.html(this.template({'path' : API.BASE}));
					return this;
				},
				clear : function() {
					this.model.destroy();
				}
			});

			return Backbone.View.extend({
				initialize : function() {

				},
				template : _.template(tpl),
				events : {},
				render : function() {
					this.$el.html(this.template());
					this.addAll();

				},
				addOne : function(index) {
		            var picView = new PicView();
		            $('#picUl'+index).append(picView.render().el);
				},
				addAll : function() {
					var index=1;
					for(var i=1;i<13;i++){
						if(i%5==0){
							index+=1;
							continue;
						}
						this.addOne(index);
					}
				}

			});
		});

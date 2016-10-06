var Header = Backbone.View.extend({
    el: $(".page-header"), // DOM элемент header

    template: _.template($('#header').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.html( this.template() );
    }
});